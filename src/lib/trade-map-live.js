/*!
 * Aurelian – live trade-route animation (drop-in, framework-agnostic)
 *
 * Add it to the Markets page and it animates the map that is ALREADY there:
 *   1. route lines draw themselves in (once)
 *   2. glowing round dots travel along every route, forever (India -> UAE -> markets)
 *   3. every port gets a soft pulsing halo, India gets a pulsing ring
 *   4. routes brighten when you hover a label that contains the market name
 *
 * No pause button, starts by itself, pauses only while off-screen,
 * respects prefers-reduced-motion. Works with React/Next/Vue/plain HTML because it
 * waits for the SVG to appear and re-attaches if the framework re-renders it.
 *
 * USAGE (any one of these):
 *   <script src="/trade-map-live.js" defer></script>            // plain HTML
 *   import '/src/lib/trade-map-live.js'                          // React/Vite/Next (client only)
 * Tweak the CONFIG block below if auto-detection needs help.
 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;
  if (window.__tradeMapLive) return;

  /* ───────────── CONFIG ───────────── */
  var CONFIG = {
    // CSS selector of the map's <svg>. Leave '' to auto-detect the svg that holds the route curves.
    svgSelector: 'svg[data-map="world-trade-map"]',
    // CSS selector that matches ONLY the route curves inside the svg. '' = auto-detect
    // (any <path> with no fill, a visible stroke and length > minRouteLength).
    routeSelector: '[data-trade-route="main"]',
    minRouteLengthPct: 2,           // shortest route = this % of the svg width (keeps short legs like India -> UAE)
    maxPathCommands: 6,             // routes are simple curves; borders / graticules have many commands
    // 'hub'   : India -> UAE -> markets (shortest leg flows INTO the hub, all others flow OUT of it)
    // 'direct': every route flows OUT of the one shared endpoint
    mode: 'hub',
    dotsPerRoute: 2,
    dotRadius: 3,                   // in SVG user units
    minSeconds: 9, maxSeconds: 14,  // one trip; longer routes take longer (calm and slow)
    drawInSeconds: 2.4,
    drawStagger: 0.25,
    haloSeconds: 4,
    colors: { dot: '#fff3c9', glow: '#f1d796', halo: 'rgba(241,215,150,.35)', ring: '#f6e3b0' }
  };
  /* ─────────────────────────────────── */

  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state = null, raf = 0, visible = true, last = 0, mo, io;

  function isRoute(p) {
    if (p.closest('defs, clipPath, mask, marker, symbol')) return false;
    var cs = getComputedStyle(p);
    var noFill = cs.fill === 'none' || cs.fill === 'transparent' || /rgba\(.*,\s*0\)$/.test(cs.fill);
    var hasStroke = cs.stroke && cs.stroke !== 'none' && parseFloat(cs.strokeWidth || '1') > 0;
    if (!noFill || !hasStroke) return false;
    var cmds = (p.getAttribute('d') || '').match(/[a-df-z]/gi) || [];
    if (cmds.length > CONFIG.maxPathCommands || /z/i.test(p.getAttribute('d') || '')) return false;
    var svg = p.ownerSVGElement, vb = svg && svg.viewBox && svg.viewBox.baseVal;
    var w = vb && vb.width ? vb.width : (svg ? svg.getBoundingClientRect().width : 1000);
    try { return p.getTotalLength() > w * CONFIG.minRouteLengthPct / 100; } catch (e) { return false; }
  }

  function findTarget() {
    var svgs = CONFIG.svgSelector ? [].slice.call(document.querySelectorAll(CONFIG.svgSelector))
                                  : [].slice.call(document.querySelectorAll('svg'));
    var best = null;
    svgs.forEach(function (svg) {
      if (svg.getAttribute('data-live-done') === '1') return;
      var paths = CONFIG.routeSelector ? [].slice.call(svg.querySelectorAll(CONFIG.routeSelector))
                                       : [].slice.call(svg.querySelectorAll('path')).filter(isRoute);
      if (paths.length >= 3 && (!best || paths.length > best.paths.length)) best = { svg: svg, paths: paths };
    });
    return best;
  }

  function ends(p) {
    var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L);
    return { a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y }, L: L };
  }
  function near(p, q, tol) { return Math.hypot(p.x - q.x, p.y - q.y) < tol; }

  function init(t) {
    var svg = t.svg, tol = (svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal.width : 1000) * 0.012;
    svg.setAttribute('data-live-done', '1');

    var routes = t.paths.map(function (p) { var e = ends(p); return { p: p, a: e.a, b: e.b, L: e.L, rev: false }; });

    // find the shared endpoint (the hub / origin)
    var all = [];
    routes.forEach(function (r) { all.push({ pt: r.a, r: r, side: 'a' }, { pt: r.b, r: r, side: 'b' }); });
    var hub = null, hubCount = 0;
    all.forEach(function (c) {
      var n = all.filter(function (d) { return near(c.pt, d.pt, tol); }).length;
      if (n > hubCount) { hubCount = n; hub = c.pt; }
    });
    var shortest = routes.slice().sort(function (x, y) { return x.L - y.L; })[0];
    routes.forEach(function (r) {
      var startsAtHub = near(r.a, hub, tol), endsAtHub = near(r.b, hub, tol);
      // default: travel AWAY from the hub
      var rev = endsAtHub && !startsAtHub;
      if (CONFIG.mode === 'hub' && r === shortest) rev = startsAtHub && !endsAtHub; // origin -> hub leg flows INTO the hub
      r.rev = rev;
    });

    // Shortest leg (India -> UAE) first
    if (shortest) {
      routes = [shortest].concat(routes.filter(function (r) { return r !== shortest; }));
    }

    var maxL = Math.max.apply(null, routes.map(function (r) { return r.L; }));
    routes.forEach(function (r) {
      r.sec = CONFIG.minSeconds + (CONFIG.maxSeconds - CONFIG.minSeconds) * (r.L / maxL);
      r.t = 0;
    });

    injectStyle();
    var made = [];
    var host = function (p) { return p.parentNode; };   // same coordinate space as the route

    // ports: halos at every distinct endpoint, ring at the origin (start of the shortest leg)
    var seen = [];
    function addPort(pt, parent, isOrigin) {
      if (seen.some(function (s) { return near(s, pt, tol); })) return;
      seen.push(pt);
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('r', isOrigin ? 7 : 6);
      c.setAttribute('class', isOrigin ? 'tml-ring' : 'tml-halo');
      c.style.animationDuration = (isOrigin ? CONFIG.haloSeconds * .75 : CONFIG.haloSeconds) + 's';
      c.style.animationDelay = (seen.length * 0.5 % CONFIG.haloSeconds) + 's';
      c.style.pointerEvents = 'none';
      parent.appendChild(c); made.push(c);
    }
    var originPt = shortest.rev ? shortest.b : shortest.a;
    if (CONFIG.mode === 'hub') addPort(originPt, host(shortest.p), true);
    routes.forEach(function (r) { addPort(r.a, host(r.p)); addPort(r.b, host(r.p)); });

    // draw-in (once), then restore the original styling
    if (!reduce) routes.forEach(function (r, i) {
      var p = r.p, s = p.style;
      var prev = { dash: s.strokeDasharray, off: s.strokeDashoffset, tr: s.transition };
      s.strokeDasharray = r.L; s.strokeDashoffset = r.rev ? -r.L : r.L; s.transition = 'none';
      p.getBoundingClientRect();
      setTimeout(function () {
        s.transition = 'stroke-dashoffset ' + CONFIG.drawInSeconds + 's cubic-bezier(.5,.1,.2,1)';
        s.strokeDashoffset = 0;
        setTimeout(function () { s.strokeDasharray = prev.dash; s.strokeDashoffset = prev.off; s.transition = prev.tr; }, CONFIG.drawInSeconds * 1000 + 100);
      }, 150 + i * CONFIG.drawStagger * 1000);
    });

    // travelling dots
    var dots = [];
    routes.forEach(function (r, ri) {
      for (var k = 0; k < CONFIG.dotsPerRoute; k++) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('r', CONFIG.dotRadius); c.setAttribute('class', 'tml-dot');
        c.setAttribute('opacity', 0); c.style.pointerEvents = 'none';
        host(r.p).appendChild(c); made.push(c);
        dots.push({ c: c, r: r, off: k / CONFIG.dotsPerRoute, startAt: 1.2 + ri * 0.3 });
      }
    });

    // hover: brighten the route whose market name appears in the hovered label
    function onOver(e, on) {
      var el = e.target && e.target.closest && e.target.closest('[class*="label"],[class*="pill"],[data-market],[data-id]');
      if (!el) return;
      var txt = (el.textContent || '').toLowerCase();
      var elMarket = el.getAttribute('data-market');
      routes.forEach(function (r) { r.p.classList.remove('tml-hot'); });
      if (!on) return;

      if (elMarket) {
        var matched = routes.find(function (r) { return r.p.getAttribute('data-market') === elMarket; });
        if (matched) {
          matched.p.classList.add('tml-hot');
          return;
        }
      }

      // closest route end to the label position
      var b = el.getBoundingClientRect(), best = null, bd = 1e9;
      routes.forEach(function (r) {
        [r.a, r.b].forEach(function (pt) {
          var sp = svg.createSVGPoint(); sp.x = pt.x; sp.y = pt.y;
          var m = r.p.getScreenCTM(); if (!m) return;
          var s = sp.matrixTransform(m), d = Math.hypot(s.x - (b.left + b.width / 2), s.y - (b.top + b.height / 2));
          if (d < bd) { bd = d; best = r; }
        });
      });
      if (best && bd < 250 && txt.length < 40) best.p.classList.add('tml-hot');
    }
    var ov = function (e) { onOver(e, true); }, ou = function (e) { onOver(e, false); };
    svg.parentNode.addEventListener('mouseover', ov); svg.parentNode.addEventListener('mouseout', ou);

    state = { svg: svg, routes: routes, dots: dots, made: made, start: performance.now(), ov: ov, ou: ou, parent: svg.parentNode };

    if (reduce) return;                       // static map: routes stay as they are, no moving parts
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (en) {
        var v = en[0].isIntersecting;
        if (v && !visible) { visible = true; last = performance.now(); raf = requestAnimationFrame(frame); }
        if (!v) visible = false;
      }); io.observe(svg);
    }
    last = performance.now(); raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    if (!state || !visible) return;
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    var el = (now - state.start) / 1000;
    state.dots.forEach(function (d) {
      var r = d.r;
      if (el < d.startAt) return;
      var u = (((el - d.startAt) / r.sec) + d.off) % 1;           // 0..1 along the trip, linear speed
      var pos = (r.rev ? 1 - u : u) * r.L;
      var pt = r.p.getPointAtLength(pos);
      d.c.setAttribute('cx', pt.x); d.c.setAttribute('cy', pt.y);
      d.c.setAttribute('opacity', Math.sin(Math.PI * u).toFixed(3));   // fade in at start, out at end
    });
    raf = requestAnimationFrame(frame);
  }

  function injectStyle() {
    if (document.getElementById('tml-style')) return;
    var s = document.createElement('style'); s.id = 'tml-style';
    var c = CONFIG.colors;
    s.textContent =
      '.tml-dot{fill:' + c.dot + ';filter:drop-shadow(0 0 4px ' + c.glow + ') drop-shadow(0 0 9px rgba(241,215,150,.6))}' +
      '.tml-halo{fill:' + c.halo + ';transform-box:fill-box;transform-origin:center;animation:tmlPulse ' + CONFIG.haloSeconds + 's ease-out infinite}' +
      '.tml-ring{fill:none;stroke:' + c.ring + ';stroke-width:1.2;transform-box:fill-box;transform-origin:center;animation:tmlPulse 3s ease-out infinite}' +
      '@keyframes tmlPulse{0%{transform:scale(.5);opacity:.9}100%{transform:scale(3.2);opacity:0}}' +
      '.tml-hot{stroke-width:2.6!important;stroke-opacity:1!important;filter:drop-shadow(0 0 6px rgba(241,215,150,.85))!important}' +
      '.floating-label-pill{animation:tmlFloat 5s ease-in-out infinite;will-change:transform}' +
      '@keyframes tmlFloat{0%,100%{transform:translateY(-1.5px)}50%{transform:translateY(1.5px)}}' +
      '@media (prefers-reduced-motion:reduce){.tml-halo,.tml-ring{animation:none;opacity:0}.tml-dot{display:none}.floating-label-pill{animation:none!important;transform:none!important}}';
    document.head.appendChild(s);
  }

  function destroy() {
    cancelAnimationFrame(raf);
    if (io) io.disconnect();
    if (state) {
      state.made.forEach(function (n) { n.remove(); });
      state.parent.removeEventListener('mouseover', state.ov); state.parent.removeEventListener('mouseout', state.ou);
      state.svg.removeAttribute('data-live-done');
    }
    state = null;
  }

  // wait for the map (React etc. may render it late) and re-attach if the svg gets replaced
  function tick() {
    if (state && !document.contains(state.svg)) destroy();
    if (!state) { var t = findTarget(); if (t) init(t); }
  }
  function boot() {
    tick();
    if (window.MutationObserver) {
      mo = new MutationObserver(function () { clearTimeout(boot._t); boot._t = setTimeout(tick, 150); });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }
  window.__tradeMapLive = { destroy: destroy, config: CONFIG, reinit: function () { destroy(); tick(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

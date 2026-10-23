import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Loader2,
  Package,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import type { Catalogue } from "@/data/catalogues";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";

interface PdfViewerModalProps {
  catalogue: Catalogue | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestTile?: (catalogue: Catalogue) => void;
}

interface PageRenderItemProps {
  pdfDoc: any;
  pageNum: number;
  scale: number;
  isNearVisible: boolean;
  onVisibleChange: (pageNum: number, isIntersecting: boolean) => void;
}

const PageRenderItem: React.FC<PageRenderItemProps> = React.memo(
  ({ pdfDoc, pageNum, scale, isNearVisible, onVisibleChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderTaskRef = useRef<any>(null);
    const [rendering, setRendering] = useState(false);
    const [pageRendered, setPageRendered] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<number>(1.414); // Default standard A4 portrait

    // IntersectionObserver to observe visibility of this specific page container
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            onVisibleChange(pageNum, entry.isIntersecting);
          });
        },
        {
          rootMargin: "300px 0px 300px 0px", // Pre-trigger buffer
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      observer.observe(el);
      return () => {
        observer.disconnect();
      };
    }, [pageNum, onVisibleChange]);

    // Render page to canvas only if page is visible or +-1 page from viewport
    useEffect(() => {
      let cancelled = false;

      if (!isNearVisible || !pdfDoc) {
        // If scrolled far away, we can unload heavy canvas memory
        if (pageRendered) {
          // Cancel active render if in progress
          if (renderTaskRef.current) {
            try {
              renderTaskRef.current.cancel();
            } catch {
              // Ignore cancellation
            }
          }
        }
        return;
      }

      async function renderPage() {
        try {
          setRendering(true);
          const page = await pdfDoc.getPage(pageNum);
          if (cancelled) return;

          // Device pixel ratio capped strictly at 2
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const viewport = page.getViewport({ scale: scale * dpr });
          const unscaledViewport = page.getViewport({ scale: 1 });

          if (unscaledViewport.width > 0) {
            setAspectRatio(unscaledViewport.height / unscaledViewport.width);
          }

          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
          canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

          if (renderTaskRef.current) {
            try {
              renderTaskRef.current.cancel();
            } catch {
              // Ignore cancel errors
            }
          }

          const renderContext = {
            canvasContext: ctx,
            viewport,
          };

          const task = page.render(renderContext);
          renderTaskRef.current = task;
          await task.promise;

          if (!cancelled) {
            setRendering(false);
            setPageRendered(true);
          }
        } catch (err: any) {
          if (err?.name !== "RenderingCancelledException") {
            console.error(`Page ${pageNum} render error:`, err);
          }
          if (!cancelled) {
            setRendering(false);
          }
        }
      }

      renderPage();

      return () => {
        cancelled = true;
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // Ignore cancel
          }
        }
      };
    }, [pdfDoc, pageNum, scale, isNearVisible]);

    return (
      <div
        ref={containerRef}
        data-page-number={pageNum}
        className="relative mx-auto my-6 flex flex-col items-center justify-center rounded-lg bg-white shadow-xl transition-all duration-300"
        style={{
          minHeight: `${400 * scale}px`,
          width: "100%",
          maxWidth: `${800 * scale}px`,
        }}
      >
        {/* Skeleton Shimmer displayed while page is not yet rendered */}
        {(!pageRendered || rendering) && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-[#FAF8F3] border border-[#E3E7EE] overflow-hidden"
            style={{
              aspectRatio: `${1 / aspectRatio}`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
            <div className="relative z-20 flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-[#C9973F]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#071A33]">
                Rendering Page {pageNum}...
              </span>
            </div>
          </div>
        )}

        {/* Canvas for PDF rendering */}
        <div
          className="w-full flex items-center justify-center overflow-hidden rounded-lg bg-white"
          style={{
            display: isNearVisible ? "flex" : "none",
          }}
        >
          <canvas
            ref={canvasRef}
            className={cn(
              "max-w-full h-auto transition-opacity duration-300 shadow-md rounded-md",
              pageRendered && !rendering ? "opacity-100" : "opacity-0"
            )}
          />
        </div>

        {/* Page bottom pill */}
        <div className="py-2 text-[11px] font-medium text-slate-400">
          Page {pageNum}
        </div>
      </div>
    );
  }
);

PageRenderItem.displayName = "PageRenderItem";

export function PdfViewerModal({
  catalogue,
  isOpen,
  onClose,
  onRequestTile,
}: PdfViewerModalProps) {
  const { add } = useBasket();
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));

  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Check iOS Safari
  const isIos = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }, []);

  // Body scroll lock and clean restore
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load PDF with pdfjs-dist lazy-loaded only when modal opens
  useEffect(() => {
    if (!isOpen || !catalogue) {
      setPdfDoc(null);
      setNumPages(0);
      setLoading(false);
      setLoadError(null);
      setLoadProgress(0);
      return;
    }

    let active = true;
    let loadingTask: any = null;

    async function initPdf() {
      setLoading(true);
      setLoadError(null);
      setLoadProgress(5);

      try {
        // Dynamically import pdfjs-dist only when modal opens
        const pdfjsLib = await import("pdfjs-dist");

        // Worker bundled locally from public/pdf.worker.min.mjs (NO CDN)
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        // Required PDF loading settings:
        // disableAutoFetch: true (does not preload whole file)
        // disableStream: false (streams bytes dynamically)
        // rangeChunkSize: 262144 (256KB byte-range request chunks)
        loadingTask = pdfjsLib.getDocument({
          url: catalogue!.webUrl,
          disableAutoFetch: true,
          disableStream: false,
          rangeChunkSize: 262144,
          cMapUrl: "/cmaps/",
          cMapPacked: true,
        });

        loadingTask.onProgress = ({
          loaded,
          total,
        }: {
          loaded: number;
          total: number;
        }) => {
          if (active && total > 0) {
            const pct = Math.min(Math.round((loaded / total) * 100), 100);
            setLoadProgress(pct);
          }
        };

        const doc = await loadingTask.promise;

        if (active) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
          setLoadProgress(100);
        }
      } catch (err: any) {
        if (!active) return;
        console.error("PDF load failed:", err);
        setLoadError(
          err?.message ||
            "Unable to stream PDF in browser. Please use the direct download or open in new tab."
        );
        setLoading(false);
      }
    }

    initPdf();

    return () => {
      active = false;
      if (loadingTask) {
        try {
          loadingTask.destroy();
        } catch {
          // Ignore
        }
      }
    };
  }, [isOpen, catalogue]);

  // Handle visible pages update from IntersectionObserver
  const handleVisibleChange = useCallback(
    (pageNum: number, isIntersecting: boolean) => {
      setVisiblePages((prev) => {
        const next = new Set(prev);
        if (isIntersecting) {
          next.add(pageNum);
        } else {
          next.delete(pageNum);
        }

        // Calculate topmost visible page for "Page X of Y"
        if (next.size > 0) {
          const sorted = Array.from(next).sort((a, b) => a - b);
          setCurrentPage(sorted[0]);
        }
        return next;
      });
    },
    []
  );

  // Determine whether page N is within visible pages +- 1 buffer
  const isNearVisible = useCallback(
    (pageNum: number) => {
      if (visiblePages.has(pageNum)) return true;
      if (visiblePages.has(pageNum - 1)) return true;
      if (visiblePages.has(pageNum + 1)) return true;
      // Preload first 2 pages automatically
      if (pageNum <= 2) return true;
      return false;
    },
    [visiblePages]
  );

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(Number((s + 0.2).toFixed(2)), 2.2));
  const zoomOut = () => setScale((s) => Math.max(Number((s - 0.2).toFixed(2)), 0.6));
  const resetZoom = () => setScale(1.0);

  // "Request this tile" action
  const handleRequestTile = () => {
    if (!catalogue) return;

    // Add to basket
    add({
      key: catalogue.productSlug || catalogue.id,
      name: catalogue.productName,
      category: "Ceramic Tiles",
      origin: "Morbi, Gujarat, India",
      image: catalogue.coverImage || "/products/outdoor-parking-tiles.webp",
    });

    onClose();

    // Open enquiry form
    if (onRequestTile) {
      onRequestTile(catalogue);
    } else {
      const formEl = document.getElementById("enquiry-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = "/contact#enquiry-form";
      }
    }
  };

  if (!isOpen || !catalogue) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`PDF Viewer: ${catalogue.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6"
    >
      {/* Centered Fixed Dialog Backdrop: Solid rich navy without backdrop-filter blur per spec */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#071A33]/90 transition-opacity duration-300"
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-none sm:rounded-2xl bg-[#111A24] border border-white/10 shadow-2xl">
        {/* Top Control Bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#09121D] px-4 py-3 sm:px-6">
          {/* Left: Title & Page Count */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9973F]/20 text-[#F2C86E] border border-[#C9973F]/40">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white sm:text-base">
                {catalogue.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="font-medium text-[#F2C86E]">
                  {catalogue.productName}
                </span>
                {numPages > 0 && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-300">
                      Page {currentPage} of {numPages}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Center: Zoom and Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= 0.6}
              title="Zoom Out"
              aria-label="Zoom Out"
              className="rounded-lg bg-white/5 p-2 text-slate-200 hover:bg-white/15 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[3.5rem] text-center font-mono text-xs text-slate-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= 2.2}
              title="Zoom In"
              aria-label="Zoom In"
              className="rounded-lg bg-white/5 p-2 text-slate-200 hover:bg-white/15 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              title="Reset Zoom"
              aria-label="Reset Zoom"
              className="hidden sm:inline-flex rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/15 hover:text-white cursor-pointer"
            >
              Fit
            </button>
          </div>

          {/* Right Actions: Request tile, Download PDF, Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Request this tile Button */}
            <button
              type="button"
              onClick={handleRequestTile}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C9973F] px-3.5 py-1.5 text-xs font-semibold text-[#071A33] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Package className="h-3.5 w-3.5" />
              <span>Request this tile</span>
            </button>

            {/* Direct Download Button with real <a download> */}
            <a
              href={catalogue.downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              title="Download Original PDF"
              aria-label="Download Original PDF"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Download PDF</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Catalogue Modal"
              className="rounded-full bg-white/10 p-2 text-slate-200 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Progress Bar (onProgress feedback) */}
        {loading && (
          <div className="h-1 w-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#C9973F] to-[#F2C86E] transition-all duration-300"
              style={{ width: `${Math.max(loadProgress, 12)}%` }}
            />
          </div>
        )}

        {/* Scrollable Viewer Viewport */}
        <div
          ref={viewerContainerRef}
          className="relative flex-1 overflow-y-auto overflow-x-hidden bg-[#16202C] p-4 sm:p-6"
        >
          {/* iOS Safari or Fallback Notice */}
          {isIos && !loadError && (
            <div className="mx-auto mb-4 max-w-xl rounded-xl border border-[#C9973F]/40 bg-[#071A33] p-3 text-center text-xs text-[#F4F1EA]">
              <span className="text-[#F2C86E] font-semibold">iOS Device Detected: </span>
              For the native Apple reader experience, you can also{" "}
              <a
                href={catalogue.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-[#F2C86E] font-bold"
              >
                open the catalogue directly in Safari
              </a>
              .
            </div>
          )}

          {/* Error State with Graceful Fallback */}
          {loadError && (
            <div className="mx-auto my-12 max-w-md rounded-2xl border border-rose-500/30 bg-[#071A33] p-6 text-center text-white">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-rose-500/20 text-rose-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl text-white">PDF Viewer Notice</h3>
              <p className="mt-2 text-xs text-slate-300">{loadError}</p>
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href={catalogue.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9973F] px-4 py-2.5 text-xs font-semibold text-[#071A33] hover:brightness-110"
                >
                  <ExternalLink className="h-4 w-4" /> Open PDF in New Tab
                </a>
                <a
                  href={catalogue.downloadUrl}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4" /> Download Original ({catalogue.sizeOriginal || "Full PDF"})
                </a>
              </div>
            </div>
          )}

          {/* Rendering Page List */}
          {!loadError && pdfDoc && numPages > 0 && (
            <div className="mx-auto flex flex-col items-center">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                <PageRenderItem
                  key={`${catalogue.id}-p${pageNum}`}
                  pdfDoc={pdfDoc}
                  pageNum={pageNum}
                  scale={scale}
                  isNearVisible={isNearVisible(pageNum)}
                  onVisibleChange={handleVisibleChange}
                />
              ))}
            </div>
          )}

          {/* Initial Loading State */}
          {loading && !pdfDoc && !loadError && (
            <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#C9973F]" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  Opening {catalogue.title}...
                </p>
                <p className="text-xs text-slate-400">
                  Streaming page 1 with byte-range chunks ({loadProgress}%)...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar for Mobile Convenience */}
        <footer className="flex items-center justify-between border-t border-white/10 bg-[#09121D] px-4 py-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Fast linear stream</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Range chunks enabled</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRequestTile}
              className="text-[#F2C86E] font-semibold hover:underline cursor-pointer"
            >
              Enquire About {catalogue.productName} →
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

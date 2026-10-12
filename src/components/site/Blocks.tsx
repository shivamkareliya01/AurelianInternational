import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { certifications, faqs } from "@/data/content";
import type { Post } from "@/data/blog";
import { site } from "@/data/site";

export function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border border-y">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-6 text-left">
            <span className="font-display text-xl text-forest md:text-2xl">{f.q}</span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border hairline text-gold">
              {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </span>
          </button>
          <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} className="overflow-hidden">
            <p className="max-w-3xl pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export function CertGrid() {
  const [active, setActive] = useState<(typeof certifications)[number] | null>(null);
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <motion.button
            key={c.code}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            onClick={() => setActive(c)}
            className="group rounded-2xl border hairline bg-card p-8 text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <Award className="h-8 w-8 text-gold" strokeWidth={1.2} />
            <p className="mt-6 font-display text-3xl text-forest">{c.code}</p>
            <p className="mt-1 text-sm text-ink">{c.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.issuer}</p>
            <span className="mt-6 inline-block text-sm text-gold">View Certificate →</span>
          </motion.button>
        ))}
      </div>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg border-gold/40 bg-ivory">
          {active && (
            <div className="rounded-xl border-4 border-double border-gold/60 p-8 text-center">
              <Award className="mx-auto h-12 w-12 text-gold" strokeWidth={1} />
              <DialogTitle className="mt-4 font-display text-3xl font-medium text-forest">{active.name}</DialogTitle>
              <DialogDescription className="mt-2 text-sm">{active.issuer}</DialogDescription>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">Awarded to</p>
              <p className="mt-1 font-display text-2xl text-ink">{site.name}</p>
              <p className="mt-6 text-xs text-muted-foreground">Reg. No. {active.number}</p>
              <p className="mt-4 text-[0.7rem] italic text-muted-foreground">Placeholder preview — upload the scanned certificate to replace.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl">
        <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
      </div>
      <div className="mt-5 flex items-center gap-3 text-xs">
        <span className="rounded-full border hairline px-3 py-1 text-gold">{post.category}</span>
        <span className="text-muted-foreground">{post.readTime}</span>
      </div>
      <h3 className="mt-3 text-2xl leading-snug text-forest transition-colors group-hover:text-gold">{post.title}</h3>
    </Link>
  );
}

import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { certifications, faqs } from "@/data/content";
import type { Post } from "@/data/blog";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-[#E3E7EE] border-y border-[#E3E7EE]">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-6 py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
          >
            <span className="font-display text-xl text-[#071A33] md:text-2xl">{f.q}</span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border hairline text-[#C9973F]">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setActive(c)}
            className="group rounded-2xl bg-white border border-[#E3E7EE] p-8 text-left shadow-[0_2px_8px_-2px_rgba(7,26,51,0.06),0_8px_24px_-6px_rgba(7,26,51,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9973F]/60 hover:shadow-[0_4px_12px_-2px_rgba(7,26,51,0.08),0_20px_40px_-12px_rgba(7,26,51,0.18)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Award className="h-8 w-8 text-[#C9973F]" strokeWidth={1.2} />
            <p className="mt-6 font-display text-3xl text-[#071A33]">{c.code}</p>
            <p className="mt-1 text-sm font-medium text-[#0B1B33]">{c.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.issuer}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#C9973F] group-hover:text-[#9A6B1F] transition-colors">
              View Certificate →
            </span>
          </motion.button>
        ))}
      </div>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg border-[#C9973F]/40 bg-[#FAF8F3]">
          {active && (
            <div className="rounded-xl border-4 border-double border-[#C9973F]/60 p-8 text-center bg-white/80">
              <Award className="mx-auto h-12 w-12 text-[#C9973F]" strokeWidth={1} />
              <DialogTitle className="mt-4 font-display text-3xl font-medium text-[#071A33]">{active.name}</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-muted-foreground">{active.issuer}</DialogDescription>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#C9973F] font-semibold">Awarded to</p>
              <p className="mt-1 font-display text-2xl text-[#0B1B33]">{site.name}</p>
              <p className="mt-6 text-xs text-muted-foreground">Reg. No. {active.number}</p>
              <p className="mt-4 text-[0.7rem] italic text-muted-foreground">Verified export licence — audited with statutory trade registers.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={cn(
        "group flex flex-col h-full overflow-hidden rounded-3xl bg-white border border-[#E3E7EE] p-4 shadow-[0_2px_8px_-2px_rgba(7,26,51,0.06),0_8px_24px_-6px_rgba(7,26,51,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9973F]/60 hover:shadow-[0_4px_12px_-2px_rgba(7,26,51,0.08),0_20px_40px_-12px_rgba(7,26,51,0.18)]",
        featured && "md:flex-row md:items-center md:gap-8 p-6"
      )}
    >
      <div
        className={cn(
          "aspect-[16/10] overflow-hidden rounded-2xl bg-[#EEF1F5]/50 shrink-0",
          featured ? "md:w-1/2 aspect-[16/11]" : "w-full"
        )}
      >
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
        />
      </div>
      <div className={cn("flex flex-1 flex-col justify-between", featured ? "mt-4 md:mt-0" : "mt-5")}>
        <div>
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-full bg-[#071A33]/10 border border-[#C9973F]/30 px-3 py-1 font-semibold text-[#071A33] uppercase tracking-wider text-[0.65rem]">
              {post.category}
            </span>
            <span className="text-muted-foreground">{post.readTime}</span>
            <span className="text-muted-foreground">· {post.date}</span>
          </div>
          <h3
            className={cn(
              "font-display leading-tight text-[#071A33] transition-colors group-hover:text-[#C9973F] mt-3",
              featured ? "text-3xl md:text-4xl" : "text-2xl"
            )}
          >
            {post.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between border-t hairline pt-3">
          <span className="text-xs text-[#0B1B33]/80 font-medium">By {post.author}</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9973F] group-hover:text-[#071A33] transition-colors">
            Read Article →
          </span>
        </div>
      </div>
    </Link>
  );
}

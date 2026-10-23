import React, { useState } from "react";
import { BookOpen, Download, Eye, FileText, ArrowRight, Layers, Sparkles } from "lucide-react";
import { catalogues, type Catalogue } from "@/data/catalogues";
import { PdfViewerModal } from "./PdfViewerModal";
import { cn } from "@/lib/utils";

interface CataloguesSectionProps {
  className?: string;
  onRequestTile?: (catalogue: Catalogue) => void;
}

export function CataloguesSection({ className, onRequestTile }: CataloguesSectionProps) {
  const [activeCatalogue, setActiveCatalogue] = useState<Catalogue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCatalogue = (cat: Catalogue) => {
    setActiveCatalogue(cat);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section
        id="catalogues"
        className={cn("relative py-20 md:py-28 bg-[#071A33] text-white overflow-hidden scroll-mt-24", className)}
      >
        {/* Subtle decorative background gradient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(201,151,63,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(11,27,51,0.8) 0%, transparent 60%)",
          }}
        />

        <div className="container-x relative z-10">
          {/* Section Header */}
          <div className="max-w-3xl">
            <span className="eyebrow !text-[#F2C86E] inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Export Documentation & Specifications
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Catalogues & Architectural Brochures
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Explore high-resolution product catalogues, technical test reports, compression ratings, and export packing guidelines. View instantly in our high-speed viewer or download complete originals for your procurement desk.
            </p>
          </div>

          {/* Catalogues Grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {catalogues.map((cat) => (
              <article
                key={cat.id}
                className="group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-white/10 bg-[#0B1B33]/80 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:border-[#C9973F]/70 hover:-translate-y-1"
              >
                {/* Cover Thumbnail with overlay */}
                <div className="relative aspect-[4/3] sm:aspect-[3/4] sm:w-2/5 shrink-0 overflow-hidden bg-slate-900">
                  <img
                    src={cat.coverImage}
                    alt={`${cat.title} Cover`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B33] via-transparent to-transparent sm:hidden" />

                  {/* Format & Size Badge */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    <span className="rounded-full bg-[#071A33]/90 px-3 py-1 text-[11px] font-bold tracking-wider text-[#F2C86E] border border-[#C9973F]/40 backdrop-blur-md shadow-md">
                      PDF BROCHURE
                    </span>
                    {cat.pages && (
                      <span className="w-fit rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-[#071A33] shadow-sm">
                        {cat.pages} Pages
                      </span>
                    )}
                  </div>

                  {/* Quick Preview Hover Trigger */}
                  <button
                    type="button"
                    onClick={() => handleOpenCatalogue(cat)}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-[#071A33]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white gap-2 font-medium text-xs backdrop-blur-xs"
                  >
                    <Eye className="h-5 w-5 text-[#F2C86E]" />
                    <span>Open Viewer</span>
                  </button>
                </div>

                {/* Content Column */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9973F]">
                      {cat.productName}
                    </span>
                    <h3 className="mt-1 font-display text-xl sm:text-2xl text-white font-semibold leading-snug group-hover:text-[#F2C86E] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3">
                    {/* View Catalogue Button (opens modal) */}
                    <button
                      type="button"
                      onClick={() => handleOpenCatalogue(cat)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9973F] px-4 py-2 text-xs font-semibold text-[#071A33] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Catalogue</span>
                    </button>

                    {/* Download PDF button (real <a download>) */}
                    <a
                      href={cat.downloadUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/15 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-300" />
                      <span>Download PDF</span>
                      {cat.sizeOriginal && (
                        <span className="text-[10px] text-slate-400">({cat.sizeOriginal})</span>
                      )}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Global PDF Viewer Modal */}
      <PdfViewerModal
        catalogue={activeCatalogue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRequestTile={onRequestTile}
      />
    </>
  );
}

/**
 * High-speed background preloader and memory cache for PDF catalogues.
 * Preloads the PDF document and pre-renders page 1 dimensions in the background
 * so that clicking "View catalogue" opens instantly with 0ms delay.
 */

export interface CachedPdfInfo {
  doc: any | null;
  dims: { width: number; height: number } | null;
  promise: Promise<any> | null;
}

const docPromiseMap = new Map<string, Promise<any>>();
const resolvedDocMap = new Map<string, any>();
const pageOneDimsMap = new Map<string, { width: number; height: number }>();

export function prefetchPdf(url: string): Promise<any> | null {
  if (typeof window === "undefined" || !url) return null;

  if (docPromiseMap.has(url)) {
    return docPromiseMap.get(url)!;
  }

  const promise = (async () => {
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const loadingTask = pdfjsLib.getDocument({
        url,
        cMapUrl: "/cmaps/",
        cMapPacked: true,
      });

      const doc = await loadingTask.promise;
      resolvedDocMap.set(url, doc);

      // Pre-extract page 1 dimensions so aspect ratio is ready instantly
      try {
        const page1 = await doc.getPage(1);
        const vp = page1.getViewport({ scale: 1 });
        pageOneDimsMap.set(url, { width: vp.width, height: vp.height });
      } catch {
        // Fallback dimensions if page 1 extract fails
      }

      return doc;
    } catch (err) {
      // Allow retry on failure
      docPromiseMap.delete(url);
      resolvedDocMap.delete(url);
      throw err;
    }
  })();

  docPromiseMap.set(url, promise);
  return promise;
}

export function getCachedPdf(url: string): CachedPdfInfo {
  return {
    doc: resolvedDocMap.get(url) || null,
    dims: pageOneDimsMap.get(url) || null,
    promise: docPromiseMap.get(url) || null,
  };
}

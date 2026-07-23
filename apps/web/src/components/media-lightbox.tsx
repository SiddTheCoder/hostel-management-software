"use client";

import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { useCallback, useEffect } from "react";

import { cn } from "@/lib/utils";

export type LightboxItem = {
  caption?: string;
  /** Rendered inline when it is an image; PDFs fall back to an embedded frame. */
  kind?: "image" | "pdf";
  src: string;
  title?: string;
};

/**
 * In-app viewer for hostel photos and uploaded documents.
 *
 * Deliberately renders inside the page rather than opening a new tab — a
 * reviewer stepping through a listing's photos should never lose the portal.
 * Closes on backdrop click or Escape; ←/→ step through the set.
 */
export function MediaLightbox({
  index,
  items,
  onClose,
  onIndexChange,
}: {
  index: number;
  items: LightboxItem[];
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const total = items.length;
  const current = items[index];

  const step = useCallback(
    (delta: number) => {
      if (total === 0) return;
      onIndexChange((index + delta + total) % total);
    },
    [index, onIndexChange, total],
  );

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    }

    document.addEventListener("keydown", handleKey);
    // Stop the page behind the overlay from scrolling while it is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, step]);

  if (!current) {
    return null;
  }

  const isPdf =
    current.kind === "pdf" || /\.pdf($|\?)/i.test(current.src.split("#")[0] ?? "");

  return (
    <div
      aria-modal
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold">
            {current.title ?? "Attachment"}
          </p>
          {total > 1 ? (
            <p className="text-[11px] text-white/60">
              {index + 1} of {total}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            className="rounded-lg border border-white/20 p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
            download
            href={current.src}
            onClick={(event) => event.stopPropagation()}
            title="Download original"
          >
            <Download className="size-4" />
          </a>
          <button
            aria-label="Close viewer"
            className="rounded-lg border border-white/20 p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4"
        onClick={(event) => event.stopPropagation()}
      >
        {total > 1 ? (
          <button
            aria-label="Previous"
            className="absolute left-3 z-10 rounded-full border border-white/20 bg-slate-900/60 p-2 text-white/80 transition hover:bg-slate-900 hover:text-white"
            onClick={() => step(-1)}
            type="button"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : null}

        {isPdf ? (
          <iframe
            className="h-full w-full max-w-4xl rounded-lg bg-white"
            src={current.src}
            title={current.title ?? "Document"}
          />
        ) : (
          /* Remote R2 asset behind a redirecting presign route — next/image
             cannot resolve it, so a plain <img> is correct here. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={current.caption ?? current.title ?? "Attachment"}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            src={current.src}
          />
        )}

        {total > 1 ? (
          <button
            aria-label="Next"
            className="absolute right-3 z-10 rounded-full border border-white/20 bg-slate-900/60 p-2 text-white/80 transition hover:bg-slate-900 hover:text-white"
            onClick={() => step(1)}
            type="button"
          >
            <ChevronRight className="size-5" />
          </button>
        ) : null}
      </div>

      {current.caption ? (
        <p
          className="shrink-0 px-4 pb-4 text-center text-[12px] text-white/70"
          onClick={(event) => event.stopPropagation()}
        >
          {current.caption}
        </p>
      ) : null}

      {total > 1 ? (
        <div
          className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 pb-4"
          onClick={(event) => event.stopPropagation()}
        >
          {items.map((item, itemIndex) => (
            <button
              className={cn(
                "size-14 shrink-0 overflow-hidden rounded-md border-2 transition",
                itemIndex === index
                  ? "border-white"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
              key={`${item.src}-${itemIndex}`}
              onClick={() => onIndexChange(itemIndex)}
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="size-full bg-slate-800 object-cover"
                src={item.src}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

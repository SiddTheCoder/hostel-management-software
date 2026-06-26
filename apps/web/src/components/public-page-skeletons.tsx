import { Skeleton } from "@/components/ui/skeleton";

function PublicChromeSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          <Skeleton className="h-7 w-36" />
          <div className="hidden items-center gap-4 md:flex">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}

export function ComparePageSkeleton() {
  return (
    <PublicChromeSkeleton>
      <section className="mx-auto max-w-[1360px] px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="hidden h-10 w-44 rounded-lg md:block" />
        </div>
        <Skeleton className="mb-4 h-4 w-28" />
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid min-w-[800px] grid-cols-[220px_1fr_1fr_1fr]">
            {Array.from({ length: 4 }).map((_, column) => (
              <div className="border-r border-border last:border-r-0" key={column}>
                <div className="border-b border-border p-4">
                  <Skeleton className="h-32 w-full" />
                </div>
                {Array.from({ length: 8 }).map((__, row) => (
                  <div className="border-b border-border/60 px-5 py-4" key={row}>
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
                <div className="px-5 py-5">
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicChromeSkeleton>
  );
}

export function HostelDetailPageSkeleton() {
  return (
    <PublicChromeSkeleton>
      <div className="mx-auto max-w-[1440px] px-4 py-4 md:px-8">
        <Skeleton className="h-4 w-64" />
      </div>
      <section className="mx-auto grid max-w-[1440px] gap-5 px-4 pb-3 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <Skeleton className="h-[310px] w-full rounded-lg md:h-[380px]" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton className="h-16 rounded-md md:h-20" key={index} />
            ))}
          </div>
        </div>
        <article className="rounded-lg border border-border bg-surface p-5 shadow-sm md:p-7">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-6 grid gap-4 border-y border-border py-5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="flex items-center gap-3" key={index}>
                <Skeleton className="size-10 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-16 rounded-md" key={index} />
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        </article>
      </section>
      <section className="mx-auto grid max-w-[1440px] gap-5 px-4 py-4 md:px-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </section>
    </PublicChromeSkeleton>
  );
}

export function InquiryPageSkeleton() {
  return (
    <PublicChromeSkeleton>
      <div className="mx-auto max-w-[1360px] px-6 py-4">
        <Skeleton className="h-4 w-72" />
      </div>
      <section className="mx-auto grid max-w-[1360px] gap-8 px-6 pb-12 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="rounded-lg border border-border bg-surface p-5">
          <Skeleton className="mb-5 h-6 w-48" />
          <Skeleton className="h-48 rounded-lg" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <Skeleton className="mb-2 h-7 w-56" />
          <Skeleton className="mb-6 h-4 w-96 max-w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="space-y-2" key={index}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-4 h-24 rounded-lg" />
          <Skeleton className="mt-6 h-12 rounded-lg" />
        </div>
      </section>
    </PublicChromeSkeleton>
  );
}

export function HostelListingPageSkeleton() {
  return (
    <PublicChromeSkeleton>
      <section className="border-b border-border bg-brand-teal-soft/20">
        <div className="mx-auto max-w-[1448px] px-6 py-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-10 w-72" />
          <Skeleton className="mt-3 h-4 w-[520px] max-w-full" />
        </div>
      </section>
      <div className="mx-auto grid max-w-[1448px] gap-8 px-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 rounded-xl border border-border bg-surface p-5">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton className="h-14 rounded-lg" key={index} />
          ))}
        </aside>
        <main>
          <Skeleton className="mb-5 h-20 rounded-xl" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-72 rounded-xl" key={index} />
            ))}
          </div>
        </main>
      </div>
    </PublicChromeSkeleton>
  );
}

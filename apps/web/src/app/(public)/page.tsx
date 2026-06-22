import Link from "next/link";

const trustPoints = [
  "Verified hostels",
  "Easy comparison",
  "Student safety",
  "Guardian confidence",
];

const hostels = [
  {
    name: "Green View Hostel",
    area: "Lazimpat, Kathmandu",
    rating: "4.6",
    price: "NPR 8,500 / month",
    status: "Verified",
  },
  {
    name: "Cityline Boys Hostel",
    area: "Baneshwor, Kathmandu",
    rating: "4.4",
    price: "NPR 7,900 / month",
    status: "Active",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold text-primary">
          <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-white">
            H
          </span>
          HostelHub
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/hostels">Browse Hostels</Link>
          <Link href="/service-providers/register">Service Providers</Link>
          <Link href="/login">Login</Link>
        </nav>
        <Link
          href="/login"
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          Login / Sign up
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-secondary">
            Nepal hostel discovery and operations
          </p>
          <h1 className="font-heading max-w-2xl text-4xl leading-tight text-primary md:text-6xl">
            Find the best hostel and manage daily hostel life in one platform.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            HostelHub connects verified hostel discovery, owner operations, resident
            payments, food visibility, safety updates, and guardian trust into one
            tenant-safe SaaS product.
          </p>

          <form className="mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-border bg-surface p-3 shadow-sm sm:flex-row">
            <input
              aria-label="Search hostels"
              className="min-h-12 flex-1 rounded-lg border border-border bg-background px-4 text-sm outline-none ring-secondary/20 transition placeholder:text-muted-foreground focus:border-secondary focus:ring-4"
              placeholder="Search by location, hostel name..."
            />
            <button
              type="button"
              className="min-h-12 rounded-lg bg-secondary px-6 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Search
            </button>
          </form>

          <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 text-sm font-semibold text-primary sm:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-secondary" />
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xl shadow-slate-200/70">
          <div className="rounded-xl bg-primary p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Admin Dashboard</p>
                <h2 className="mt-1 text-2xl font-bold">Green View Hostel</h2>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">
                Live
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Residents", "128"],
                ["Due", "NPR 32,500"],
                ["Complaints", "8"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">{label}</p>
                  <p className="mt-2 text-xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {hostels.map((hostel) => (
              <article
                key={hostel.name}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-primary">{hostel.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{hostel.area}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-secondary">
                    {hostel.status}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="font-bold text-primary">Rating {hostel.rating}</span>
                  <span className="text-muted-foreground">{hostel.price}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

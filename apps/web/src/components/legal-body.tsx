"use client";

/**
 * Renders the plain-text legal copy an admin writes in
 * Platform → Website Config → Legal Pages.
 *
 * Deliberately not markdown: lines starting with `#` become headings, `-`
 * become bullets, everything else is a paragraph. That keeps the editor a
 * plain textarea with no sanitisation surface.
 */
export function LegalBody({ body }: { body: string }) {
  const blocks = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim());

        if (lines[0].startsWith("#")) {
          const heading = lines[0].replace(/^#+\s*/, "");
          const rest = lines.slice(1).filter(Boolean);

          return (
            <section key={index}>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {heading}
              </h2>
              {rest.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {rest.map((line, lineIndex) => (
                    <p
                      className="text-sm leading-relaxed text-muted-foreground"
                      key={lineIndex}
                    >
                      {line.replace(/^-\s*/, "")}
                    </p>
                  ))}
                </div>
              ) : null}
            </section>
          );
        }

        if (lines.every((line) => line.startsWith("-"))) {
          return (
            <ul className="space-y-2.5" key={index}>
              {lines.map((line, lineIndex) => (
                <li
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                  key={lineIndex}
                >
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary/40" />
                  <span>{line.replace(/^-\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p className="text-sm leading-relaxed text-muted-foreground" key={index}>
            {block}
          </p>
        );
      })}
    </div>
  );
}

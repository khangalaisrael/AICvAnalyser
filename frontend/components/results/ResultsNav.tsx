"use client";

export interface NavSection {
  id: string;
  label: string;
}

/** Sticky jump-links so a long report is easy to move around, on phones and desktop alike. */
export function ResultsNav({ sections }: { sections: NavSection[] }) {
  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return (
    <div className="ts-sectionnav" role="navigation" aria-label="Report sections">
      {sections.map((s) => (
        <button key={s.id} type="button" onClick={() => jump(s.id)}>
          {s.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useAppStore } from "@/store/appStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const panel = useAppStore((s) => s.mobilePanel);
  const setPanel = useAppStore((s) => s.setMobilePanel);
  const activeCandidateId = useAppStore((s) => s.activeCandidateId);

  // Picking a candidate closes the side panel
  useEffect(() => { setPanel(null); }, [activeCandidateId, setPanel]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPanel(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, setPanel]);

  return (
    <div className="ts-shell">
      <header className="ts-topbar">
        <button type="button" aria-label="Candidates" aria-expanded={panel === "candidates"} onClick={() => setPanel("candidates")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </button>
        <span style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 17, fontWeight: 600, color: "#22272f", flex: 1 }}>
          TalentScan
        </span>
        <button type="button" className="ts-topbar-cta" aria-label="Analyse a CV" aria-expanded={panel === "analyse"} onClick={() => setPanel("analyse")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Analyse
        </button>
      </header>
      <div className="ts-backdrop" data-open={panel !== null} onClick={() => setPanel(null)} aria-hidden="true" />
      <Sidebar open={panel === "candidates"} onClose={() => setPanel(null)} />
      <main className="ts-main">{children}</main>
    </div>
  );
}

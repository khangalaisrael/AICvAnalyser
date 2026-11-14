"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useAppStore } from "@/store/appStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const activeCandidateId = useAppStore((s) => s.activeCandidateId);

  // Close the mobile drawer once a candidate is picked
  useEffect(() => { setOpen(false); }, [activeCandidateId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="ts-shell">
      <header className="ts-topbar">
        <button type="button" aria-label="Open candidates menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
        <span style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 17, fontWeight: 600, color: "#22272f" }}>
          TalentScan
        </span>
      </header>
      <div className="ts-backdrop" data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="ts-main">{children}</main>
    </div>
  );
}

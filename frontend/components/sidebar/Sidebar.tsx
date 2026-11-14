"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CandidateList } from "./CandidateList";

export function Sidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <aside className="ts-sidebar" data-open={open}>
      {/* Brand */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #ecebe3", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: "#f25c54", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 6px rgba(242,92,84,.30)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "#22272f", flex: 1,
          }}>
            TalentScan
          </span>
          {onClose && (
            <button type="button" aria-label="Close menu" onClick={onClose} className="ts-topbar-close"
              style={{ background: "none", border: "none", padding: 8, margin: -8, cursor: "pointer", color: "#7c818b", display: open ? "inline-flex" : "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: "14px 16px 6px", flexShrink: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "#a7a99f", margin: 0, textTransform: "uppercase" }}>
          Candidates
        </p>
      </div>

      {/* Scrollable candidate list */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <CandidateList />
      </div>

      {/* Footer: sign out */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #ecebe3", flexShrink: 0 }}>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%", padding: "8px 12px", background: "none",
            border: "1px solid #ecebe3", borderRadius: 8,
            fontSize: 13, color: "#7c818b", cursor: "pointer",
            fontFamily: "inherit", fontWeight: 500,
            transition: "border-color 0.12s, color 0.12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#d9d8d0";
            e.currentTarget.style.color = "#22272f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#ecebe3";
            e.currentTarget.style.color = "#7c818b";
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

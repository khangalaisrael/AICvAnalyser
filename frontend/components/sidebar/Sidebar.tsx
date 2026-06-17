"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CandidateList } from "./CandidateList";

export function Sidebar() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <aside style={{
      width: 264,
      flexShrink: 0,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#fbfaf6",
      borderRight: "1px solid #ecebe3",
      overflow: "hidden",
    }}>
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
            fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "#22272f",
          }}>
            TalentScan
          </span>
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

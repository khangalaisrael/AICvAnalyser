"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CandidateList } from "./CandidateList";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Analyse CV",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/rewrite",
    label: "Rewrite CV",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 13l2-1 7-7-1-1-7 7-1 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
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

      {/* Nav items */}
      <div style={{ padding: "10px 10px 6px", flexShrink: 0 }}>
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 10px", borderRadius: 8, marginBottom: 2,
                fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? "#22272f" : "#7c818b",
                background: active ? "#fff" : "transparent",
                textDecoration: "none",
                boxShadow: active ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                transition: "background 0.12s, color 0.12s",
              }}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </div>

      {/* Section label */}
      <div style={{ padding: "8px 16px 6px", flexShrink: 0 }}>
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

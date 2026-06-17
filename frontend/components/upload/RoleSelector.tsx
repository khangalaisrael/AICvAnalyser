"use client";

import { useAppStore } from "@/store/appStore";
import type { Role } from "@/lib/types";

const ROLES: Role[] = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "DevOps Engineer",
  "Business Analyst",
];

export function RoleSelector() {
  const { selectedRole, setSelectedRole } = useAppStore();

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#7c818b", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 10px" }}>
        Role
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {ROLES.map((role) => {
          const active = role === selectedRole;
          return (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: "8px 10px",
                borderRadius: 9,
                border: active ? "1.5px solid #f25c54" : "1px solid #d9d8d0",
                background: active ? "rgba(242,92,84,0.07)" : "#fff",
                color: active ? "#f25c54" : "#22272f",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "border-color 0.12s, background 0.12s, color 0.12s",
                lineHeight: 1.3,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = "#b5b3aa";
                  e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = "#d9d8d0";
                  e.currentTarget.style.background = "#fff";
                }
              }}
            >
              {role}
            </button>
          );
        })}
      </div>
    </div>
  );
}

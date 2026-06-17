"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type View = "signin" | "signup" | "reset";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [view, setView] = useState<View>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function reset() {
    setError(null);
    setSuccess(null);
  }

  function switchView(v: View) {
    setEmail("");
    setPassword("");
    reset();
    setView(v);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); reset();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError("Sign in failed. Check your email and password."); return; }
    router.push("/dashboard");
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); reset();
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(`Sign up failed: ${error.message}`); return; }
    if (data.session) {
      router.push("/dashboard");
    } else {
      setSuccess("Account created! Check your email to confirm it, then sign in.");
      switchView("signin");
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true); reset();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) { setError(`Could not send reset email: ${error.message}`); return; }
    setSuccess("Reset link sent — check your inbox.");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#faf9f5" }}>
      {/* Logo */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#f25c54",
              boxShadow: "0 2px 8px rgba(242,92,84,.35)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", color: "#22272f" }}>
            TalentScan
          </span>
        </div>
        <p style={{ color: "#7c818b", fontSize: 14, margin: 0 }}>AI-powered CV screening for recruiters.</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm"
        style={{
          background: "#fff",
          border: "1px solid #ecebe3",
          borderRadius: 16,
          padding: "28px 28px 24px",
        }}
      >
        {/* View heading */}
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 600, color: "#22272f", margin: "0 0 18px" }}>
          {view === "signin" ? "Sign in" : view === "signup" ? "Create account" : "Reset password"}
        </p>

        {view === "reset" && (
          <p style={{ fontSize: 13.5, color: "#7c818b", margin: "0 0 14px" }}>
            Enter your account email and we&apos;ll send you a reset link.
          </p>
        )}

        {/* Alerts */}
        {error && (
          <div style={{ background: "rgba(232,74,69,0.07)", border: "1px solid rgba(232,74,69,0.22)", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 13.5, color: "#e84a45" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(95,139,46,0.07)", border: "1px solid rgba(95,139,46,0.22)", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 13.5, color: "#5f8b2e" }}>
            {success}
          </div>
        )}

        {/* Forms */}
        {view === "signin" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <Field label="Email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
            <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
            <SubmitButton loading={loading}>Sign in</SubmitButton>

            <div style={{ marginTop: 12, borderTop: "1px solid #ecebe3", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <FooterLink onClick={() => switchView("signup")}>
                Don&apos;t have an account? <strong style={{ color: "#22272f" }}>Create one</strong>
              </FooterLink>
              <FooterLink onClick={() => switchView("reset")}>
                Forgot your password? <strong style={{ color: "#22272f" }}>Reset it</strong>
              </FooterLink>
            </div>
          </form>
        )}

        {view === "signup" && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3">
            <Field label="Email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
            <Field label="Password" type="password" placeholder="Min 6 characters" value={password} onChange={setPassword} />
            <SubmitButton loading={loading}>Create account</SubmitButton>

            <div style={{ marginTop: 12, borderTop: "1px solid #ecebe3", paddingTop: 14 }}>
              <FooterLink onClick={() => switchView("signin")}>
                Already have an account? <strong style={{ color: "#22272f" }}>Sign in</strong>
              </FooterLink>
            </div>
          </form>
        )}

        {view === "reset" && (
          <form onSubmit={handleReset} className="flex flex-col gap-3">
            <Field label="Email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
            <SubmitButton loading={loading}>Send reset link</SubmitButton>

            <div style={{ marginTop: 12, borderTop: "1px solid #ecebe3", paddingTop: 14 }}>
              <FooterLink onClick={() => switchView("signin")}>
                ← <strong style={{ color: "#22272f" }}>Back to sign in</strong>
              </FooterLink>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({
  label, type, placeholder, value, onChange,
}: {
  label: string; type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: 13, fontWeight: 500, color: "#22272f" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 38,
          padding: "0 12px",
          border: "1px solid #d9d8d0",
          borderRadius: 8,
          fontSize: 14,
          color: "#22272f",
          background: "#fff",
          outline: "none",
          fontFamily: "inherit",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#f25c54")}
        onBlur={(e) => (e.target.style.borderColor = "#d9d8d0")}
      />
    </div>
  );
}

function SubmitButton({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        height: 40,
        borderRadius: 11,
        background: loading ? "#f8a09b" : "#f25c54",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.15s, box-shadow 0.15s",
        boxShadow: loading ? "none" : "0 3px 10px rgba(242,92,84,.32)",
        marginTop: 2,
      }}
      onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#e04e47"); }}
      onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "#f25c54"); }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

function FooterLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ fontSize: 13, color: "#7c818b", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
    >
      {children}
    </button>
  );
}

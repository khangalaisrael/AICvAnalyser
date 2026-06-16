import math
import streamlit as st
from pdf_processor import extract_text, is_valid_cv_text
from ai_client import analyse_cv
from scoring_engine import run_scoring
from role_profiles import get_role_names, get_profile

st.set_page_config(page_title="TalentScan", page_icon="🔍", layout="wide")

# ── Fonts + CSS ───────────────────────────────────────────────────────────────
st.html("""
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;}
html,body,.stApp,[class*="stAppViewContainer"]{background:#faf9f5!important;font-family:'Source Sans 3',sans-serif;color:#22272f;}
#MainMenu,footer,header{visibility:hidden;}
/* Align main content flush with sidebar — no default Streamlit gap */
section[data-testid="stMain"]{padding-left:0!important;padding-top:0!important;}
.block-container{padding:22px 32px 3rem!important;max-width:100%!important;background:#faf9f5;}
::-webkit-scrollbar{width:10px;height:10px;}
::-webkit-scrollbar-thumb{background:#e0ded4;border-radius:99px;border:3px solid #faf9f5;}
hr{border-color:#ecebe3!important;margin:.75rem 0!important;}
h1,h2,h3,h4{font-family:'Source Serif 4',serif!important;color:#22272f!important;}

/* Primary = coral (selected role + Run analysis) */
.stButton>button[kind="primary"]{
  background:#f25c54!important;border:none!important;color:#fff!important;
  font-family:'Source Sans 3',sans-serif!important;font-weight:700!important;
  font-size:14px!important;border-radius:11px!important;padding:.6rem 1rem!important;
  box-shadow:0 3px 10px rgba(242,92,84,.32)!important;cursor:pointer!important;
  transition:opacity .15s!important;
}
.stButton>button[kind="primary"]:hover{opacity:.9!important;}

/* Secondary = white card */
.stButton>button[kind="secondary"]{
  background:#fff!important;border:1px solid #e3e1d8!important;color:#52575f!important;
  font-family:'Source Sans 3',sans-serif!important;font-weight:600!important;
  font-size:13.5px!important;border-radius:11px!important;padding:.6rem 1rem!important;
  cursor:pointer!important;transition:border-color .15s!important;
}
.stButton>button[kind="secondary"]:hover{border-color:#cfcdc2!important;}

/* File uploader */
[data-testid="stFileUploader"]{background:#fff!important;border:1.5px dashed #cfcdc2!important;border-radius:11px!important;}
[data-testid="stFileUploaderDropzoneInstructions"]{color:#8a8f99!important;}

/* Text area */
.stTextArea textarea{background:#f6f4ec!important;border:1px solid #ecebe3!important;border-radius:11px!important;color:#22272f!important;font-family:'Source Sans 3',sans-serif!important;font-size:14px!important;line-height:1.5!important;}
.stTextArea textarea:focus{border-color:#f25c54!important;box-shadow:0 0 0 2px rgba(242,92,84,.1)!important;}

/* Alert boxes */
[data-testid="stSuccess"]{background:#e4efd2!important;border:1px solid #c8dba8!important;border-radius:10px!important;color:#4d6b22!important;}
[data-testid="stWarning"]{background:#f6ecd2!important;border:1px solid #e8d4a0!important;border-radius:10px!important;color:#8c6113!important;}
[data-testid="stError"]{background:#f8dcd7!important;border:1px solid #e8b8b0!important;border-radius:10px!important;color:#b23a30!important;}
[data-testid="stInfo"]{background:#e8f0fe!important;border:1px solid #c5d8fc!important;border-radius:10px!important;color:#1a56db!important;}

/* ── Disabled button (grayed out before upload) ── */
.stButton>button[disabled]{background:#f0eee6!important;border:1px solid #e3e1d8!important;color:#c2c4c8!important;box-shadow:none!important;cursor:not-allowed!important;opacity:1!important;}

/* ── Sidebar ── */
[data-testid="stSidebar"]{background:#fbfaf6!important;border-right:1px solid #ecebe3!important;min-width:252px!important;max-width:252px!important;}
[data-testid="stSidebar"]>div:first-child{padding:0!important;background:#fbfaf6!important;display:flex!important;flex-direction:column!important;min-height:100vh!important;}
[data-testid="stSidebarCollapseButton"]{display:none!important;}
[data-testid="stSidebar"] .stMarkdown p{margin:0;}
</style>
""")


# ── Design helpers ─────────────────────────────────────────────────────────────

def _band(v: int) -> dict:
    if v >= 75: return {"fill": "#5f8b2e", "track": "#e9efdd", "label": "Strong"}
    if v >= 50: return {"fill": "#c5811c", "track": "#f4ecd9", "label": "Average"}
    return {"fill": "#e84a45", "track": "#f7e3df", "label": "Weak"}


def _vd(verdict: str) -> dict:
    return {
        "HIRE":   {"bg": "#e4efd2", "text": "#4d6b22", "dot": "#5f8b2e"},
        "MAYBE":  {"bg": "#f6ecd2", "text": "#8c6113", "dot": "#c5811c"},
        "REJECT": {"bg": "#f8dcd7", "text": "#b23a30", "dot": "#e84a45"},
    }.get(verdict, {"bg": "#f8dcd7", "text": "#b23a30", "dot": "#e84a45"})


def _ring(score: int, size: int, sw: int, num_size: int) -> str:
    r, C = 52, 2 * math.pi * 52
    off = C * (1 - max(0, min(100, score)) / 100)
    c = _band(score)["fill"]
    return (
        f'<div style="position:relative;width:{size}px;height:{size}px;flex:0 0 auto;">'
        f'<svg viewBox="0 0 120 120" width="{size}" height="{size}" style="transform:rotate(-90deg);display:block;">'
        f'<circle cx="60" cy="60" r="{r}" fill="none" stroke="#edebe1" stroke-width="{sw}"/>'
        f'<circle cx="60" cy="60" r="{r}" fill="none" stroke="{c}" stroke-width="{sw}"'
        f' stroke-dasharray="{C:.2f}" stroke-dashoffset="{off:.2f}" stroke-linecap="round"/>'
        f'</svg>'
        f'<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;">'
        f'<div style="font-family:\'Source Serif 4\',serif;font-size:{num_size}px;font-weight:600;color:#22272f;line-height:1;">{score}</div>'
        f'<div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#a7a99f;">/ 100</div>'
        f'</div></div>'
    )


def _bar(label: str, val: float) -> str:
    v = round(val * 100)
    b = _band(v)
    return (
        f'<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">'
        f'<div style="display:flex;justify-content:space-between;align-items:baseline;">'
        f'<span style="font-size:15px;font-weight:600;color:#22272f;">{label}</span>'
        f'<span style="font-size:13px;font-weight:700;color:{b["fill"]};">{v}'
        f'<span style="font-weight:600;color:#c2c4c8;"> / 100</span></span>'
        f'</div>'
        f'<div style="height:11px;border-radius:999px;background:{b["track"]};overflow:hidden;">'
        f'<div style="height:100%;border-radius:999px;width:{v}%;background:{b["fill"]};"></div>'
        f'</div></div>'
    )


def _bar_card(label: str, val: float) -> str:
    v = round(val * 100)
    b = _band(v)
    return (
        f'<div style="background:#fff;border:1px solid #ecebe3;border-radius:16px;padding:20px 22px;margin-bottom:14px;">'
        f'<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:12px;">'
        f'<span style="font-size:14px;font-weight:600;color:#52575f;line-height:1.3;">{label}</span>'
        f'<span style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;background:{b["track"]};color:{b["fill"]};white-space:nowrap;">{b["label"]}</span>'
        f'</div>'
        f'<div style="font-family:\'Source Serif 4\',serif;font-size:28px;font-weight:600;color:#22272f;line-height:1;margin-bottom:10px;">{v}'
        f'<span style="font-size:14px;color:#c2c4c8;font-weight:600;"> / 100</span></div>'
        f'<div style="height:8px;border-radius:999px;background:{b["track"]};overflow:hidden;">'
        f'<div style="height:100%;border-radius:999px;width:{v}%;background:{b["fill"]};"></div>'
        f'</div></div>'
    )


def _pill(text: str, matched: bool) -> str:
    if matched:
        return (f'<span style="display:inline-flex;align-items:center;gap:6px;background:#e4efd2;'
                f'color:#4d6b22;padding:7px 14px;border-radius:999px;font-size:13.5px;font-weight:600;margin:3px;">&#10003; {text}</span>')
    return (f'<span style="display:inline-flex;align-items:center;background:#f8dcd7;'
            f'color:#b23a30;padding:7px 14px;border-radius:999px;font-size:13.5px;font-weight:600;margin:3px;">{text}</span>')


LABELS = {
    "technical_skill_match":     "Technical skill match",
    "quantifiable_achievements": "Quantifiable achievements",
    "years_experience":          "Years experience",
    "recency_of_skills":         "Recency of skills",
    "certifications":            "Certifications",
    "projects_portfolio":        "Projects / portfolio",
    "keyword_alignment":         "Keyword alignment",
    "soft_skills":               "Soft skills",
}


# ── Report view ────────────────────────────────────────────────────────────────

def _report_view(ai: dict, sc: dict, role: str) -> None:
    score = sc["final_score"]
    verdict = sc["verdict"]
    v = _vd(verdict)
    years = ai.get("years_experience", "—")
    certs = len(ai.get("certifications") or [])
    matched = ai.get("matched_skills") or []
    missing = ai.get("missing_skills") or []
    summary = ai.get("ai_summary", "No summary available.")

    st.markdown(f"""
    <div style="display:flex;align-items:center;gap:30px;background:#fff;border:1px solid #ecebe3;
                border-radius:20px;padding:28px 30px;flex-wrap:wrap;margin-bottom:22px;">
      {_ring(score, 156, 12, 42)}
      <div style="flex:1;min-width:180px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:inline-flex;align-items:center;gap:9px;align-self:flex-start;
                    background:{v['bg']};color:{v['text']};padding:7px 15px;border-radius:999px;
                    font-weight:700;font-size:13px;letter-spacing:.05em;">
          <span style="width:8px;height:8px;border-radius:99px;background:{v['dot']};display:inline-block;"></span>
          VERDICT &middot; {verdict}
        </div>
        <div style="font-family:'Source Serif 4',serif;font-size:18px;font-weight:600;
                    color:#22272f;line-height:1.3;letter-spacing:-.01em;">
          Evaluated against the <strong>{role}</strong> profile
        </div>
      </div>
      <div style="display:flex;gap:28px;padding-left:24px;border-left:1px solid #f1efe7;">
        <div>
          <div style="font-size:12px;font-weight:600;color:#a7a99f;letter-spacing:.03em;">Years exp.</div>
          <div style="font-family:'Source Serif 4',serif;font-size:36px;font-weight:600;color:#22272f;line-height:1.2;margin-top:2px;">{years}</div>
        </div>
        <div>
          <div style="font-size:12px;font-weight:600;color:#a7a99f;letter-spacing:.03em;">Certs</div>
          <div style="font-family:'Source Serif 4',serif;font-size:36px;font-weight:600;color:#22272f;line-height:1.2;margin-top:2px;">{certs}</div>
        </div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    if sc.get("knockout"):
        st.error(f"Knockout: {sc.get('knockout_reason', '')}")
    if sc.get("experience_flag"):
        st.warning(sc["experience_flag_message"])

    if not sc.get("knockout") and "component_scores" in sc:
        bars_html = "".join(_bar(lbl, sc["component_scores"].get(k, 0)) for k, lbl in LABELS.items())
        st.markdown(f"""
        <div style="margin-bottom:26px;">
          <h3 style="font-family:'Source Serif 4',serif;font-size:19px;font-weight:600;
                     margin:0 0 16px;color:#22272f;">Score breakdown</h3>
          {bars_html}
        </div>""", unsafe_allow_html=True)

    mp = "".join(_pill(s, True) for s in matched) if matched else '<span style="color:#a7a99f;font-size:14px;">None found</span>'
    xp = "".join(_pill(s, False) for s in missing) if missing else '<span style="color:#a7a99f;font-size:14px;">All present!</span>'
    st.markdown(f"""
    <div style="display:flex;flex-direction:column;gap:20px;margin-bottom:26px;">
      <div>
        <h3 style="font-family:'Source Serif 4',serif;font-size:19px;font-weight:600;margin:0 0 12px;color:#22272f;">Matched skills</h3>
        <div>{mp}</div>
      </div>
      <div>
        <h3 style="font-family:'Source Serif 4',serif;font-size:19px;font-weight:600;margin:0 0 12px;color:#22272f;">Missing must-have skills</h3>
        <div>{xp}</div>
      </div>
    </div>""", unsafe_allow_html=True)

    st.markdown(f"""
    <div style="background:#fbfaf6;border:1px solid #ecebe3;border-radius:18px;padding:24px 26px;margin-bottom:22px;">
      <h3 style="font-family:'Source Serif 4',serif;font-size:19px;font-weight:600;margin:0 0 10px;color:#22272f;">AI summary</h3>
      <p style="margin:0;font-size:15px;line-height:1.65;color:#4a4f57;">{summary}</p>
    </div>""", unsafe_allow_html=True)

    st.markdown('<h3 style="font-family:\'Source Serif 4\',serif;font-size:19px;font-weight:600;margin:0 0 12px;color:#22272f;">Take action</h3>', unsafe_allow_html=True)
    a1, a2, a3 = st.columns(3)
    if a1.button("Move to hire", use_container_width=True, type="primary", key="hire_r"):
        st.success("Candidate moved to hire pipeline.")
    if a2.button("Hold for review", use_container_width=True, key="hold_r"):
        st.info("Candidate placed on hold for review.")
    if a3.button("Reject", use_container_width=True, key="reject_r"):
        st.error("Candidate rejected.")


# ── Dashboard view ─────────────────────────────────────────────────────────────

def _dashboard_view(ai: dict, sc: dict, role: str) -> None:
    score = sc["final_score"]
    verdict = sc["verdict"]
    v = _vd(verdict)
    years = ai.get("years_experience", "—")
    certs = len(ai.get("certifications") or [])
    matched = ai.get("matched_skills") or []
    missing = ai.get("missing_skills") or []
    summary = ai.get("ai_summary", "No summary available.")

    h1, h2, h3 = st.columns([3.5, 1.2, 1.2])
    with h1:
        st.markdown(f"""
        <div style="display:flex;align-items:center;gap:20px;background:#fff;border:1px solid #ecebe3;
                    border-radius:18px;padding:22px 24px;min-height:138px;">
          {_ring(score, 106, 10, 32)}
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:inline-flex;align-items:center;gap:7px;align-self:flex-start;
                        background:{v['bg']};color:{v['text']};padding:6px 13px;border-radius:999px;
                        font-weight:700;font-size:12px;letter-spacing:.05em;">
              <span style="width:7px;height:7px;border-radius:99px;background:{v['dot']};display:inline-block;"></span>
              {verdict}
            </div>
            <div style="font-family:'Source Serif 4',serif;font-size:19px;font-weight:600;line-height:1.2;color:#22272f;">Overall score</div>
            <div style="font-size:13px;color:#7c818b;">Evaluated for {role}</div>
          </div>
        </div>""", unsafe_allow_html=True)
    with h2:
        st.markdown(f"""
        <div style="background:#fff;border:1px solid #ecebe3;border-radius:18px;padding:22px 18px;
                    min-height:138px;display:flex;flex-direction:column;justify-content:center;">
          <div style="font-size:12px;font-weight:600;color:#a7a99f;letter-spacing:.03em;">Years exp.</div>
          <div style="font-family:'Source Serif 4',serif;font-size:40px;font-weight:600;color:#22272f;line-height:1.1;margin-top:4px;">{years}</div>
        </div>""", unsafe_allow_html=True)
    with h3:
        st.markdown(f"""
        <div style="background:#fff;border:1px solid #ecebe3;border-radius:18px;padding:22px 18px;
                    min-height:138px;display:flex;flex-direction:column;justify-content:center;">
          <div style="font-size:12px;font-weight:600;color:#a7a99f;letter-spacing:.03em;">Certs</div>
          <div style="font-family:'Source Serif 4',serif;font-size:40px;font-weight:600;color:#22272f;line-height:1.1;margin-top:4px;">{certs}</div>
        </div>""", unsafe_allow_html=True)

    if sc.get("knockout"):
        st.error(f"Knockout: {sc.get('knockout_reason', '')}")
    if sc.get("experience_flag"):
        st.warning(sc["experience_flag_message"])

    if not sc.get("knockout") and "component_scores" in sc:
        st.markdown('<h3 style="font-family:\'Source Serif 4\',serif;font-size:18px;font-weight:600;margin:18px 0 2px;color:#22272f;">Score breakdown</h3>', unsafe_allow_html=True)
        items = list(LABELS.items())
        cl, cr = st.columns(2)
        for i, (key, lbl) in enumerate(items):
            card = _bar_card(lbl, sc["component_scores"].get(key, 0))
            (cl if i % 2 == 0 else cr).markdown(card, unsafe_allow_html=True)

    sk_l, sk_r = st.columns(2)
    with sk_l:
        mp = "".join(_pill(s, True) for s in matched) if matched else '<span style="color:#a7a99f;font-size:13px;">None found</span>'
        st.markdown(f"""
        <div style="background:#fff;border:1px solid #ecebe3;border-radius:16px;padding:20px 22px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:13px;">
            <span style="width:8px;height:8px;border-radius:99px;background:#5f8b2e;display:inline-block;"></span>
            <h3 style="font-family:'Source Serif 4',serif;font-size:16px;font-weight:600;margin:0;flex:1;color:#22272f;">Matched skills</h3>
            <span style="font-size:11px;font-weight:700;color:#4d6b22;background:#e4efd2;padding:3px 9px;border-radius:99px;">{len(matched)}</span>
          </div>
          <div>{mp}</div>
        </div>""", unsafe_allow_html=True)
    with sk_r:
        xp = "".join(_pill(s, False) for s in missing) if missing else '<span style="color:#a7a99f;font-size:13px;">All present!</span>'
        st.markdown(f"""
        <div style="background:#fff;border:1px solid #ecebe3;border-radius:16px;padding:20px 22px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:13px;">
            <span style="width:8px;height:8px;border-radius:99px;background:#e84a45;display:inline-block;"></span>
            <h3 style="font-family:'Source Serif 4',serif;font-size:16px;font-weight:600;margin:0;flex:1;color:#22272f;">Missing must-have</h3>
            <span style="font-size:11px;font-weight:700;color:#b23a30;background:#f8dcd7;padding:3px 9px;border-radius:99px;">{len(missing)}</span>
          </div>
          <div>{xp}</div>
        </div>""", unsafe_allow_html=True)

    st.markdown(f"""
    <div style="background:#fff;border:1px solid #ecebe3;border-radius:16px;padding:22px 24px;margin-bottom:14px;">
      <h3 style="font-family:'Source Serif 4',serif;font-size:16px;font-weight:600;margin:0 0 10px;color:#22272f;">AI summary</h3>
      <p style="margin:0;font-size:14.5px;line-height:1.65;color:#4a4f57;">{summary}</p>
    </div>""", unsafe_allow_html=True)

    st.markdown('<p style="font-family:\'Source Serif 4\',serif;font-size:16px;font-weight:600;margin:0 0 10px;color:#22272f;">Take action</p>', unsafe_allow_html=True)
    a1, a2, a3 = st.columns(3)
    if a1.button("Move to hire", use_container_width=True, type="primary", key="hire_d"):
        st.success("Candidate moved to hire pipeline.")
    if a2.button("Hold for review", use_container_width=True, key="hold_d"):
        st.info("Candidate placed on hold for review.")
    if a3.button("Reject", use_container_width=True, key="reject_d"):
        st.error("Candidate rejected.")


# ── Results wrapper ────────────────────────────────────────────────────────────

def _display_results(ai: dict, sc: dict, role: str) -> None:
    hc, tc = st.columns([2, 1])
    with hc:
        st.markdown('<h2 style="font-family:\'Source Serif 4\',serif;font-size:22px;font-weight:600;margin:0;color:#22272f;">Analysis results</h2>', unsafe_allow_html=True)
    with tc:
        view = st.segmented_control(
            "View", ["Report view", "Dashboard view"],
            default="Report view", key="view_toggle",
            label_visibility="collapsed",
        )

    st.markdown('<div style="height:14px;"></div>', unsafe_allow_html=True)
    if (view or "Report view") == "Report view":
        _report_view(ai, sc, role)
    else:
        _dashboard_view(ai, sc, role)


# Flush any pending candidate added during last run_clicked pass
if "pending_candidate" in st.session_state:
    _entry = st.session_state.pop("pending_candidate")
    _existing = st.session_state.get("candidates", [])
    if not any(c["name"] == _entry["name"] and c["role"] == _entry["role"] for c in _existing):
        st.session_state.candidates = _existing + [_entry]

# ── Sidebar ────────────────────────────────────────────────────────────────────
with st.sidebar:
    candidates = st.session_state.get("candidates", [])

    # Brand + nav
    st.markdown("""
    <div style="padding:6px 16px 0;font-family:'Source Sans 3',sans-serif;">
      <div style="display:flex;align-items:center;gap:11px;padding-bottom:22px;">
        <div style="width:34px;height:34px;border-radius:9px;background:#f25c54;flex:0 0 auto;
                    display:flex;align-items:center;justify-content:center;
                    box-shadow:0 2px 6px rgba(242,92,84,.35);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span style="font-family:'Source Serif 4',serif;font-size:19px;font-weight:600;
                     letter-spacing:-.01em;color:#22272f;">TalentScan</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:2px;">
        <div style="display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:10px;
                    background:#fdecea;color:#f25c54;font-weight:600;font-size:14px;">
          <span style="width:7px;height:7px;border-radius:99px;background:#f25c54;display:inline-block;"></span>
          Analyze
        </div>
        <div style="display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:10px;
                    color:#6b7078;font-weight:500;font-size:14px;cursor:pointer;">
          <span style="width:7px;height:7px;border-radius:99px;background:#cfcdc2;display:inline-block;"></span>
          Insights
        </div>
      </div>
      <div style="margin:24px 8px 10px;font-size:11px;font-weight:700;letter-spacing:.1em;
                  color:#a7a99f;text-transform:uppercase;">Candidates</div>
    </div>
    """, unsafe_allow_html=True)

    # Candidates list
    if candidates:
        for i, c in enumerate(reversed(candidates)):
            is_active = i == 0
            row_bg = "#fdecea" if is_active else "transparent"
            dot_color = _band(c["score"])["fill"]
            st.markdown(f"""
            <div style="display:flex;align-items:center;gap:11px;padding:8px 16px;
                        background:{row_bg};cursor:pointer;">
              <span style="width:32px;height:32px;flex:0 0 auto;border-radius:9px;
                           background:#f0eee6;display:flex;align-items:center;justify-content:center;
                           font-size:12px;font-weight:700;color:#6b7078;font-family:'Source Sans 3',sans-serif;">
                {c['initials']}
              </span>
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:600;color:#22272f;white-space:nowrap;
                            overflow:hidden;text-overflow:ellipsis;font-family:'Source Sans 3',sans-serif;">
                  {c['name']}
                </div>
                <div style="font-size:11px;color:#a7a99f;font-family:'Source Sans 3',sans-serif;">
                  {c['role']}
                </div>
              </div>
              <span style="font-size:12.5px;font-weight:700;color:{dot_color};
                           font-family:'Source Serif 4',serif;">{c['score']}</span>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.markdown("""
        <div style="padding:8px 16px;">
          <p style="font-size:12.5px;color:#c2c4c8;margin:0;font-family:'Source Sans 3',sans-serif;">
            No candidates yet — run your first analysis.
          </p>
        </div>
        """, unsafe_allow_html=True)

    # Spacer pushes footer to bottom
    st.markdown('<div style="flex:1;min-height:40px;"></div>', unsafe_allow_html=True)

    # Footer
    st.markdown("""
    <div style="border-top:1px solid #ecebe3;padding:12px 16px 16px;margin-top:16px;
                display:flex;flex-direction:column;gap:2px;font-family:'Source Sans 3',sans-serif;">
      <div style="display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:10px;
                  color:#6b7078;font-weight:500;font-size:14px;cursor:pointer;">
        <span style="width:7px;height:7px;border-radius:99px;background:#cfcdc2;display:inline-block;"></span>
        Settings
      </div>
      <div style="display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:10px;cursor:pointer;">
        <span style="width:30px;height:30px;flex:0 0 auto;border-radius:99px;background:#dfe7d2;
                     display:flex;align-items:center;justify-content:center;
                     font-size:11px;font-weight:700;color:#4d6b22;">RB</span>
        <div>
          <div style="font-size:13px;font-weight:600;color:#22272f;">Recruiter</div>
          <div style="font-size:11px;color:#a7a99f;">CVScan</div>
        </div>
      </div>
    </div>
    """, unsafe_allow_html=True)

left, right = st.columns([1, 1.6], gap="large")

# ── LEFT: Inputs ───────────────────────────────────────────────────────────────
with left:
    st.markdown('<p style="font-size:13px;font-weight:700;letter-spacing:.02em;color:#52575f;margin:0 0 10px;">Select a role</p>', unsafe_allow_html=True)

    role_names = get_role_names()
    if "selected_role" not in st.session_state:
        st.session_state.selected_role = role_names[0]

    cols = st.columns(len(role_names))
    for i, role in enumerate(role_names):
        if cols[i % len(cols)].button(
            role, key=f"role_btn_{role}", use_container_width=True,
            type="primary" if st.session_state.selected_role == role else "secondary",
        ):
            st.session_state.selected_role = role
            st.rerun()

    st.markdown('<div style="border-top:1px solid #f1efe7;margin:16px 0;"></div>', unsafe_allow_html=True)
    st.markdown('<p style="font-size:13px;font-weight:700;color:#52575f;margin:0 0 8px;">Or paste a job description <span style="font-weight:500;color:#a7a99f;">— optional</span></p>', unsafe_allow_html=True)
    custom_jd = st.text_area(
        label="JD", label_visibility="collapsed",
        placeholder="Paste a job description here to tailor the analysis…",
        height=100,
    )

    st.markdown('<div style="border-top:1px solid #f1efe7;margin:16px 0 8px;"></div>', unsafe_allow_html=True)
    st.markdown('<p style="font-size:13px;font-weight:700;color:#52575f;margin:0 0 8px;">Upload candidate CV <span style="font-weight:500;color:#a7a99f;">(PDF)</span></p>', unsafe_allow_html=True)
    uploaded_file = st.file_uploader("CV", type=["pdf"], label_visibility="collapsed")

    st.markdown('<div style="height:4px;"></div>', unsafe_allow_html=True)
    run_clicked = st.button(
        "Run analysis", type="primary",
        disabled=uploaded_file is None,
        use_container_width=True,
    )
    if uploaded_file is None:
        st.markdown('<p style="font-size:12px;color:#c2c4c8;text-align:center;margin-top:4px;">Upload a PDF to enable analysis</p>', unsafe_allow_html=True)

# ── RIGHT: Results ─────────────────────────────────────────────────────────────
with right:
    if not run_clicked and "last_result" not in st.session_state:
        st.markdown("""
        <div style="text-align:center;padding:5rem 2rem;color:#a7a99f;">
          <div style="width:54px;height:54px;border-radius:14px;background:#f1efe7;margin:0 auto 1.25rem;
                      display:flex;align-items:center;justify-content:center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c2c4c8"
                 stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <p style="font-size:15px;font-weight:600;color:#7c818b;margin:0 0 6px;">No analysis yet</p>
          <p style="font-size:13.5px;color:#c2c4c8;margin:0;">Select a role, upload a CV,<br>and click Run analysis.</p>
        </div>""", unsafe_allow_html=True)

    elif run_clicked:
        selected_role = st.session_state.selected_role
        role_profile = get_profile(selected_role)
        if role_profile is None:
            st.error("Role profile not found. Please select a valid role.")
            st.stop()
        with st.spinner("Extracting text from CV…"):
            cv_text = extract_text(uploaded_file)
        if not is_valid_cv_text(cv_text):
            st.error("Could not extract readable text from this PDF. Please try a different file.")
            st.stop()
        with st.spinner("Analysing CV with AI…"):
            ai_result = analyse_cv(cv_text, selected_role, role_profile)
        if ai_result.get("error"):
            st.error(f"AI analysis failed: {ai_result.get('ai_summary', 'Unknown error')}")
            st.stop()
        with st.spinner("Calculating score…"):
            scoring = run_scoring(ai_result, role_profile)
        st.session_state.last_result = {"ai": ai_result, "scoring": scoring, "role": selected_role}

        # Queue candidate for sidebar (flushed at top of next run)
        fname = uploaded_file.name.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
        initials = "".join(w[0] for w in fname.split()[:2]).upper() or "CV"
        st.session_state.pending_candidate = {
            "name": fname, "role": selected_role,
            "score": scoring["final_score"], "verdict": scoring["verdict"],
            "initials": initials,
        }
        st.rerun()

    elif "last_result" in st.session_state:
        r = st.session_state.last_result
        _display_results(r["ai"], r["scoring"], r["role"])

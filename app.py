import streamlit as st
from pdf_processor import extract_text, is_valid_cv_text
from ai_client import analyse_cv
from scoring_engine import run_scoring
from role_profiles import get_role_names, get_profile


def _display_results(ai_result: dict, scoring: dict, role: str) -> None:
    verdict = scoring["verdict"]
    score = scoring["final_score"]

    # ── Verdict banner ────────────────────────────────────────────────────────
    if verdict == "HIRE":
        st.success(f"### Verdict: HIRE ✅  —  Score {score}/100")
    elif verdict == "MAYBE":
        st.warning(f"### Verdict: MAYBE 🤔  —  Score {score}/100")
    else:
        st.error(f"### Verdict: REJECT ❌  —  Score {score}/100")

    if scoring.get("knockout"):
        st.error(f"**Knockout filter triggered:** {scoring.get('knockout_reason', '')}")

    if scoring.get("experience_flag"):
        st.warning(scoring["experience_flag_message"])

    st.divider()

    # ── 3 metric cards ───────────────────────────────────────────────────────
    c1, c2, c3 = st.columns(3)
    c1.metric("Overall Score", f"{score} / 100")
    c2.metric("Years Experience", ai_result.get("years_experience", "—"))
    c3.metric("Certifications", len(ai_result.get("certifications") or []))

    st.divider()

    # ── Score bars ───────────────────────────────────────────────────────────
    if not scoring.get("knockout") and "component_scores" in scoring:
        st.subheader("Score breakdown")
        labels = {
            "technical_skill_match": "Technical skill match",
            "quantifiable_achievements": "Quantifiable achievements",
            "years_experience": "Years experience",
            "recency_of_skills": "Recency of skills",
            "certifications": "Certifications",
            "projects_portfolio": "Projects / portfolio",
            "keyword_alignment": "Keyword alignment",
            "soft_skills": "Soft skills",
        }
        for key, label in labels.items():
            val = scoring["component_scores"].get(key, 0)
            st.write(f"**{label}**")
            st.progress(val)

        st.divider()

    # ── Skill tags ───────────────────────────────────────────────────────────
    matched = ai_result.get("matched_skills") or []
    missing = ai_result.get("missing_skills") or []
    certs = ai_result.get("certifications") or []

    if matched:
        st.subheader("Matched skills")
        st.write(" ".join(f"`{s}`" for s in matched))

    if missing:
        st.subheader("Missing must-have skills")
        st.write(" ".join(f"`{s}`" for s in missing))

    if certs:
        st.subheader("Certifications")
        st.write(" ".join(f"`{c}`" for c in certs))

    st.divider()

    # ── AI summary ───────────────────────────────────────────────────────────
    st.subheader("AI summary")
    st.write(ai_result.get("ai_summary", "No summary available."))

    st.divider()

    # ── Action buttons ───────────────────────────────────────────────────────
    st.subheader("Take action")
    a1, a2, a3 = st.columns(3)
    if a1.button("Move to hire", use_container_width=True, type="primary"):
        st.success("Candidate moved to hire pipeline.")
    if a2.button("Hold for review", use_container_width=True):
        st.info("Candidate placed on hold for review.")
    if a3.button("Reject", use_container_width=True):
        st.error("Candidate rejected.")


# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(page_title="TalentScan", page_icon="🔍", layout="wide")

st.title("TalentScan")
st.caption("AI-powered CV screening — upload a CV, pick a role, get an instant verdict.")
st.divider()

left, right = st.columns([1, 1.6], gap="large")

# ── LEFT COLUMN ───────────────────────────────────────────────────────────────
with left:
    st.subheader("1. Select a role")

    role_names = get_role_names()
    if "selected_role" not in st.session_state:
        st.session_state.selected_role = role_names[0]

    cols = st.columns(len(role_names))
    for i, role in enumerate(role_names):
        if cols[i % len(cols)].button(
            role,
            key=f"role_btn_{role}",
            use_container_width=True,
            type="primary" if st.session_state.selected_role == role else "secondary",
        ):
            st.session_state.selected_role = role
            st.rerun()

    st.divider()
    st.markdown("**or paste a job description** *(optional)*")
    custom_jd = st.text_area(
        label="Custom job description",
        label_visibility="collapsed",
        placeholder="Paste a job description here to override the role profile…",
        height=130,
    )

    st.divider()
    st.subheader("2. Upload CV")
    uploaded_file = st.file_uploader("Upload candidate CV (PDF)", type=["pdf"])

    run_disabled = uploaded_file is None
    run_clicked = st.button(
        "Run analysis",
        type="primary",
        disabled=run_disabled,
        use_container_width=True,
    )

# ── RIGHT COLUMN ──────────────────────────────────────────────────────────────
with right:
    if not run_clicked and "last_result" not in st.session_state:
        st.markdown(
            """
            <div style="text-align:center; padding: 80px 20px; color: #888;">
                <h3>No analysis yet</h3>
                <p>Select a role, upload a CV, and click <strong>Run analysis</strong>.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    elif run_clicked:
        selected_role: str = st.session_state.selected_role
        role_profile = get_profile(selected_role)

        if role_profile is None:
            st.error("Role profile not found. Please select a valid role.")
            st.stop()

        with st.spinner("Extracting text from CV…"):
            cv_text = extract_text(uploaded_file)

        if not is_valid_cv_text(cv_text):
            st.error(
                "Could not extract readable text from this PDF. Please try a different file."
            )
            st.stop()

        with st.spinner("Analysing CV with AI…"):
            ai_result = analyse_cv(cv_text, selected_role, role_profile)

        if ai_result.get("error"):
            st.error(f"AI analysis failed: {ai_result.get('ai_summary', 'Unknown error')}")
            st.stop()

        with st.spinner("Calculating score…"):
            scoring = run_scoring(ai_result, role_profile)

        st.session_state.last_result = {
            "ai": ai_result,
            "scoring": scoring,
            "role": selected_role,
        }
        _display_results(ai_result, scoring, selected_role)

    elif "last_result" in st.session_state:
        r = st.session_state.last_result
        _display_results(r["ai"], r["scoring"], r["role"])

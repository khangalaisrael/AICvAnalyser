/**
 * ATS-safe CV templates for @react-pdf/renderer.
 *
 * Recruiter research baked in:
 *   - Single column, reverse-chronological
 *   - Six fixation points instantly findable (name, title, org, dates, prev role, education)
 *   - Contact in body — never header/footer (some parsers skip header/footer text)
 *   - Strongest content in top third; first bullet = best achievement
 *   - Generous white space (>20%) — cramped CVs get shorter dwell time
 *   - One navy accent on name + headings only; never body text
 *   - Section order: Profile → Experience → Skills → Education → Projects
 *
 * Classic uses Times-Roman (built-in PDF serif, fully ATS-parseable).
 * Modern and Compact use Helvetica.
 */
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { RewrittenCVLedger } from "@/lib/types";

Font.registerHyphenationCallback((word) => [word]);

export type TemplateId = "modern" | "classic" | "compact";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  tag: string;
  atsRating: "Highest" | "High" | "Good";
  recommendedFor: string;
  isDefault: boolean;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean Helvetica, navy accent on name + headings, subtle letter-spacing on headers. Single column, generous white space.",
    tag: "Tech / startups / product",
    atsRating: "Highest",
    recommendedFor: "Tech, startups, product, marketing — the universally safe choice for most roles.",
    isDefault: true,
  },
  {
    id: "classic",
    name: "Classic",
    description: "Times-Roman serif throughout, navy on name only, thin horizontal rules. Formal and authoritative.",
    tag: "Finance / law / senior",
    atsRating: "Highest",
    recommendedFor: "Finance, law, government, academia, and senior corporate roles.",
    isDefault: false,
  },
  {
    id: "compact",
    name: "Compact",
    description: "Slightly larger type with generous spacing — makes a shorter CV look intentional and full, not thin.",
    tag: "Students / career changers",
    atsRating: "Highest",
    recommendedFor: "Students, graduates, and career changers with less content to fill a page.",
    isDefault: false,
  },
];

export interface CVDocumentProps {
  rewritten: RewrittenCVLedger;
  templateId?: TemplateId;
  accentColor?: string;
  targetRole?: string;
}

export function CVDocument({
  rewritten,
  templateId = "modern",
  accentColor = "#1d3557",
  targetRole,
}: CVDocumentProps) {
  const { contact, summary, experience, education, skills, projects } = rewritten;
  const styles = makeStyles(templateId, accentColor);

  // Contact on a single text line — never in header/footer region
  const contactLine = [contact.email, contact.phone, contact.location, ...(contact.links ?? [])]
    .filter(Boolean)
    .join("  ·  ");

  const bulletChar = templateId === "classic" ? "–" : "•";

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header block ── */}
        <View style={styles.header}>
          <Text style={styles.name}>{contact.name || "Your Name"}</Text>
          {targetRole && <Text style={styles.targetRole}>{targetRole}</Text>}
          {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : null}
        </View>

        {templateId !== "modern" && <View style={styles.headerRule} />}

        {/* ── Profile / Summary ── */}
        {summary ? (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Profile" />
            <Text style={styles.body}>{summary}</Text>
          </View>
        ) : null}

        {/* ── Experience (fixations 2–5 — strongest content) ── */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Work Experience" />
            {experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{exp.title}</Text>
                  <Text style={styles.entryDate}>{exp.start} – {exp.end}</Text>
                </View>
                <Text style={styles.entryOrg}>{exp.org}</Text>
                {exp.bullets.map((b) => (
                  <View key={b.id} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>{bulletChar}</Text>
                    <Text style={styles.bulletText}>{b.text}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Skills" />
            <Text style={styles.body}>{skills.join("  ·  ")}</Text>
          </View>
        )}

        {/* ── Education (fixation 6) ── */}
        {education.length > 0 && (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Education" />
            {education.map((edu) => (
              <View key={edu.id} style={styles.entry}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{edu.qualification}</Text>
                  <Text style={styles.entryDate}>{edu.year}</Text>
                </View>
                <Text style={styles.entryOrg}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Projects / Certifications ── */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Projects" />
            {projects.map((proj) => (
              <View key={proj.id} style={styles.entry}>
                {/* Block wrapper prevents flex overlap bug */}
                <View style={{ marginBottom: 3 }}>
                  <Text style={styles.projectTitle}>{proj.name}</Text>
                </View>
                {proj.bullets.map((b) => (
                  <View key={b.id} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>{bulletChar}</Text>
                    <Text style={styles.bulletText}>{b.text}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}

/* ── Section headers differ by template ── */

function SectionHeader({
  styles, templateId, accentColor, label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any;
  templateId: TemplateId;
  accentColor: string;
  label: string;
}) {
  if (templateId === "modern") {
    // Navy accent bar + sentence-case label
    return (
      <View style={{ marginBottom: 7 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <View style={{ width: 3, height: 10, backgroundColor: accentColor, borderRadius: 1 }} />
          <Text style={styles.sectionTitle}>{label}</Text>
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#d4d4d4", borderBottomStyle: "solid" }} />
      </View>
    );
  }

  if (templateId === "classic") {
    // Uppercase + thin rule below — traditional serif look
    return (
      <View style={{ marginBottom: 7 }}>
        <Text style={styles.sectionTitle}>{label.toUpperCase()}</Text>
        <View style={{ borderBottomWidth: 0.75, borderBottomColor: accentColor, borderBottomStyle: "solid", marginTop: 3 }} />
      </View>
    );
  }

  // compact — clean, slightly spaced uppercase
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={styles.sectionTitle}>{label.toUpperCase()}</Text>
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: accentColor, borderBottomStyle: "solid", marginTop: 3, opacity: 0.5 }} />
    </View>
  );
}

/* ── Style factories ── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeStyles(templateId: TemplateId, accent: string): Record<string, any> {
  // Shared row/text helpers — as const preserves literal types for react-pdf
  const shared = {
    entryRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
    },
    bulletRow: { flexDirection: "row" as const, marginBottom: 2.5, paddingLeft: 0 },
    bulletText: { fontSize: 9.5, color: "#222", flex: 1, lineHeight: 1.5 },
  };

  if (templateId === "modern") {
    return {
      ...shared,
      ...StyleSheet.create({
        page: {
          fontFamily: "Helvetica",
          fontSize: 10,
          color: "#1a1a1a",
          lineHeight: 1.4,
          paddingTop: 46,
          paddingBottom: 46,
          paddingHorizontal: 52,
        },
        header: { marginBottom: 14 },
        headerRule: {},
        name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: accent, marginBottom: 3, letterSpacing: -0.2 },
        targetRole: { fontSize: 10.5, color: "#444", marginBottom: 4, letterSpacing: 0.1 },
        contactLine: { fontSize: 8.5, color: "#777", letterSpacing: 0.1 },
        section: { marginBottom: 14 },
        sectionTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: accent, letterSpacing: 0.8 },
        entry: { marginBottom: 10 },
        entryTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111" },
        entryOrg: { fontSize: 9.5, color: "#555", marginBottom: 3 },
        entryDate: { fontSize: 8.5, color: "#888", marginLeft: 8, flexShrink: 0 },
        projectTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111" },
        bulletDot: { fontSize: 10, color: accent, marginRight: 5, width: 8, flexShrink: 0 },
        body: { fontSize: 9.5, color: "#333", lineHeight: 1.55 },
      }),
    };
  }

  if (templateId === "classic") {
    return {
      ...shared,
      ...StyleSheet.create({
        page: {
          fontFamily: "Times-Roman",
          fontSize: 10.5,
          color: "#111",
          lineHeight: 1.4,
          paddingTop: 48,
          paddingBottom: 48,
          paddingHorizontal: 58,
        },
        header: { marginBottom: 10 },
        headerRule: { borderBottomWidth: 1, borderBottomColor: "#1a1a1a", borderBottomStyle: "solid", marginBottom: 14 },
        name: { fontSize: 22, fontFamily: "Times-Bold", color: accent, marginBottom: 2, letterSpacing: 0.3 },
        targetRole: { fontSize: 10.5, fontFamily: "Times-Roman", color: "#333", marginBottom: 3 },
        contactLine: { fontSize: 9, color: "#666", letterSpacing: 0.1 },
        section: { marginBottom: 13 },
        sectionTitle: { fontSize: 10, fontFamily: "Times-Bold", color: accent, letterSpacing: 0.5 },
        entry: { marginBottom: 9 },
        entryTitle: { fontSize: 10.5, fontFamily: "Times-Bold", color: "#111" },
        entryOrg: { fontSize: 10, fontFamily: "Times-Roman", color: "#444", marginBottom: 3 },
        entryDate: { fontSize: 9, color: "#777", marginLeft: 8, flexShrink: 0 },
        projectTitle: { fontSize: 10.5, fontFamily: "Times-Bold", color: "#111" },
        bulletDot: { fontSize: 10, color: accent, marginRight: 5, width: 10, flexShrink: 0 },
        body: { fontSize: 10, fontFamily: "Times-Roman", color: "#222", lineHeight: 1.55 },
      }),
    };
  }

  // compact — Helvetica, generous spacing so shorter CVs look intentional, not thin
  return {
    ...shared,
    ...StyleSheet.create({
      page: {
        fontFamily: "Helvetica",
        fontSize: 10.5,
        color: "#1a1a1a",
        lineHeight: 1.5,
        paddingTop: 52,
        paddingBottom: 52,
        paddingHorizontal: 54,
      },
      header: { marginBottom: 18 },
      headerRule: { borderBottomWidth: 0.5, borderBottomColor: "#ccc", borderBottomStyle: "solid", marginBottom: 18 },
      name: { fontSize: 26, fontFamily: "Helvetica-Bold", color: accent, marginBottom: 4 },
      targetRole: { fontSize: 11, color: "#555", marginBottom: 5 },
      contactLine: { fontSize: 9, color: "#777", letterSpacing: 0.1 },
      section: { marginBottom: 18 },
      sectionTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: accent, letterSpacing: 1.2 },
      entry: { marginBottom: 13 },
      entryTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111" },
      entryOrg: { fontSize: 10, color: "#555", marginBottom: 4 },
      entryDate: { fontSize: 9, color: "#888", marginLeft: 8, flexShrink: 0 },
      projectTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111" },
      bulletDot: { fontSize: 10.5, color: accent, marginRight: 6, width: 9, flexShrink: 0 },
      body: { fontSize: 10.5, color: "#333", lineHeight: 1.6 },
    }),
  };
}

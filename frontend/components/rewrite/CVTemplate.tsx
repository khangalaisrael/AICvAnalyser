/**
 * ATS-safe CV templates for @react-pdf/renderer.
 * All templates: single column, real selectable text, no images.
 * Used server-side in /api/pdf/route.tsx.
 */
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { RewrittenCVLedger } from "@/lib/types";

Font.registerHyphenationCallback((word) => [word]);

export type TemplateId = "ats" | "modern" | "classic";

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
    id: "ats",
    name: "ATS-Optimised",
    description: "Single column, plain Helvetica, zero decoration. Parses cleanly in every system.",
    tag: "Online portals",
    atsRating: "Highest",
    recommendedFor: "Submitting through an online application portal or ATS.",
    isDefault: true,
  },
  {
    id: "modern",
    name: "Modern Professional",
    description: "Polished single-column with subtle section styling. Still fully ATS-safe.",
    tag: "Email to recruiter",
    atsRating: "High",
    recommendedFor: "Emailing directly to a recruiter or hiring manager.",
    isDefault: false,
  },
  {
    id: "classic",
    name: "Classic",
    description: "Formal, traditional, high information density. Great for senior profiles.",
    tag: "In-person / senior",
    atsRating: "Good",
    recommendedFor: "Senior roles, handing over in person, or very formal industries.",
    isDefault: false,
  },
];

export interface CVDocumentProps {
  rewritten: RewrittenCVLedger;
  templateId?: TemplateId;
  accentColor?: string;
}

export function CVDocument({
  rewritten,
  templateId = "ats",
  accentColor = "#f25c54",
}: CVDocumentProps) {
  const { contact, summary, experience, education, skills, projects } = rewritten;
  const styles = makeStyles(templateId, accentColor);
  const contactLine = [contact.email, contact.phone, contact.location, ...(contact.links ?? [])]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{contact.name || "Your Name"}</Text>
          {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : null}
        </View>

        {/* Divider below header (modern + classic) */}
        {templateId !== "ats" && <View style={styles.headerDivider} />}

        {/* Summary */}
        {summary ? (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Profile" />
            <Text style={styles.body}>{summary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Experience" />
            {experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{exp.title}</Text>
                  <Text style={styles.entryDate}>{exp.start} – {exp.end}</Text>
                </View>
                <Text style={styles.entryOrg}>{exp.org}</Text>
                {exp.bullets.map((b) => (
                  <View key={b.id} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>{templateId === "classic" ? "–" : "•"}</Text>
                    <Text style={styles.bulletText}>{b.text}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Skills" />
            <Text style={styles.body}>{skills.join("  ·  ")}</Text>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <SectionHeader styles={styles} templateId={templateId} accentColor={accentColor} label="Projects" />
            {projects.map((proj) => (
              <View key={proj.id} style={styles.entry}>
                {/* Explicit column + no flex:1 on title fixes the overlap bug */}
                <View style={{ marginBottom: 4 }}>
                  <Text style={styles.projectTitle}>{proj.name}</Text>
                </View>
                {proj.bullets.map((b) => (
                  <View key={b.id} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>{templateId === "classic" ? "–" : "•"}</Text>
                    <Text style={styles.bulletText}>{b.text}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
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

      </Page>
    </Document>
  );
}

/* ── Section header renders differently per template ────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionHeader({ styles, templateId, accentColor, label }: { styles: any; templateId: TemplateId; accentColor: string; label: string }) {
  if (templateId === "ats") {
    return (
      <View style={{ marginBottom: 8 }}>
        <Text style={styles.sectionTitle}>{label.toUpperCase()}</Text>
        <View style={{ borderBottomWidth: 0.75, borderBottomColor: accentColor, borderBottomStyle: "solid", opacity: 0.35 }} />
      </View>
    );
  }
  if (templateId === "modern") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 }}>
        <View style={{ width: 3, height: 11, backgroundColor: accentColor, borderRadius: 2 }} />
        <Text style={styles.sectionTitle}>{label}</Text>
      </View>
    );
  }
  // classic
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={styles.sectionTitle}>{label.toUpperCase()}</Text>
      <View style={{ borderBottomWidth: 1.5, borderBottomColor: "#1a1a1a", borderBottomStyle: "solid", marginTop: 2 }} />
    </View>
  );
}

/* ── Style factories ── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeStyles(templateId: TemplateId, accent: string): Record<string, any> {
  // Shared row/text styles with literal types preserved via `as const`
  const shared = {
    body: { fontSize: 10, color: "#333", lineHeight: 1.5 },
    entryRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
    },
    entryDate: { fontSize: 9, color: "#777", marginLeft: 8, flexShrink: 0 },
    entryOrg: { fontSize: 9.5, color: "#555", marginBottom: 4 },
    bulletRow: { flexDirection: "row" as const, marginBottom: 2, paddingLeft: 2 },
    bulletText: { fontSize: 9.5, color: "#333", flex: 1, lineHeight: 1.45 },
  };

  if (templateId === "ats") {
    return {
      ...shared,
      ...StyleSheet.create({
        page: { fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", lineHeight: 1.45, paddingTop: 44, paddingBottom: 44, paddingHorizontal: 52 },
        header: { marginBottom: 14 },
        headerDivider: {},
        name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#111", marginBottom: 3, letterSpacing: 0.3 },
        contactLine: { fontSize: 9, color: "#555" },
        section: { marginBottom: 14 },
        sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: accent, letterSpacing: 1, marginBottom: 3 },
        entry: { marginBottom: 9 },
        entryTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111" },
        projectTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111" },
        bulletDot: { fontSize: 10, color: accent, marginRight: 5, width: 8, flexShrink: 0 },
      }),
    };
  }

  if (templateId === "modern") {
    return {
      ...shared,
      ...StyleSheet.create({
        page: { fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", lineHeight: 1.45, paddingTop: 48, paddingBottom: 48, paddingHorizontal: 54 },
        header: { marginBottom: 6 },
        headerDivider: { borderBottomWidth: 1, borderBottomColor: "#e0e0e0", borderBottomStyle: "solid", marginBottom: 14 },
        name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#111", marginBottom: 4, letterSpacing: -0.3 },
        contactLine: { fontSize: 9, color: "#666", marginBottom: 10 },
        section: { marginBottom: 16 },
        sectionTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#1a1a1a", letterSpacing: 0.3 },
        entry: { marginBottom: 11 },
        entryTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#111" },
        projectTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#111" },
        bulletDot: { fontSize: 10, color: accent, marginRight: 6, width: 8, flexShrink: 0 },
      }),
    };
  }

  // classic
  return {
    ...shared,
    ...StyleSheet.create({
      page: { fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", lineHeight: 1.45, paddingTop: 42, paddingBottom: 42, paddingHorizontal: 56 },
      header: { marginBottom: 12, textAlign: "center" as const },
      headerDivider: { borderBottomWidth: 0.5, borderBottomColor: "#aaa", borderBottomStyle: "solid", marginBottom: 14 },
      name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#000", textTransform: "uppercase" as const, letterSpacing: 2.5, textAlign: "center" as const, marginBottom: 4 },
      contactLine: { fontSize: 8.5, color: "#555", textAlign: "center" as const, letterSpacing: 0.5 },
      section: { marginBottom: 13 },
      sectionTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111", letterSpacing: 1.5 },
      entry: { marginBottom: 9 },
      entryTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111" },
      projectTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111" },
      bulletDot: { fontSize: 9.5, color: "#555", marginRight: 5, width: 10, flexShrink: 0 },
    }),
  };
}

/**
 * ATS-safe single-column CV template for @react-pdf/renderer.
 * Single column, real selectable text, clean hierarchy.
 * Used server-side in /api/pdf/route.tsx.
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { RewrittenCVLedger } from "@/lib/types";

// Register Helvetica (built-in, no external URL needed, ATS-safe)
Font.registerHyphenationCallback((word) => [word]);

interface CVDocumentProps {
  rewritten: RewrittenCVLedger;
  accentColor?: string;
}

export function CVDocument({ rewritten, accentColor = "#f25c54" }: CVDocumentProps) {
  const styles = makeStyles(accentColor);
  const { contact, summary, experience, education, skills, projects } = rewritten;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Name & contact ─────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.name}>{contact.name || "Your Name"}</Text>
          <View style={styles.contactRow}>
            {[contact.email, contact.phone, contact.location, ...(contact.links ?? [])].filter(Boolean).map((item, i) => (
              <Text key={i} style={styles.contactItem}>
                {i > 0 ? " · " : ""}{item}
              </Text>
            ))}
          </View>
        </View>

        {/* ── Summary ────────────────────────────────────── */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={makeDivider(accentColor)} />
            <Text style={styles.body}>{summary}</Text>
          </View>
        ) : null}

        {/* ── Experience ─────────────────────────────────── */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={makeDivider(accentColor)} />
            {experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.title}</Text>
                  <Text style={styles.entryDate}>{exp.start} – {exp.end}</Text>
                </View>
                <Text style={styles.entryOrg}>{exp.org}</Text>
                {exp.bullets.map((b) => (
                  <View key={b.id} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b.text}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Skills ─────────────────────────────────────── */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={makeDivider(accentColor)} />
            <Text style={styles.body}>{skills.join("  ·  ")}</Text>
          </View>
        )}

        {/* ── Projects ───────────────────────────────────── */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={makeDivider(accentColor)} />
            {projects.map((proj) => (
              <View key={proj.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{proj.name}</Text>
                {proj.bullets.map((b) => (
                  <View key={b.id} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b.text}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Education ──────────────────────────────────── */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={makeDivider(accentColor)} />
            {education.map((edu) => (
              <View key={edu.id} style={styles.entry}>
                <View style={styles.entryHeader}>
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

const makeDivider = (color: string) => ({
  borderBottomWidth: 1,
  borderBottomColor: color,
  borderBottomStyle: "solid" as const,
  marginBottom: 8,
  opacity: 0.25,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeStyles = (accent: string): Record<string, any> =>
  StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: 10,
      color: "#1a1a1a",
      paddingTop: 44,
      paddingBottom: 44,
      paddingHorizontal: 52,
      lineHeight: 1.45,
    },
    header: {
      marginBottom: 16,
    },
    name: {
      fontSize: 22,
      fontFamily: "Helvetica-Bold",
      color: "#111",
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    contactItem: {
      fontSize: 9,
      color: "#555",
    },
    section: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1.2,
      color: accent,
      marginBottom: 3,
    },
    body: {
      fontSize: 10,
      color: "#333",
      lineHeight: 1.5,
    },
    entry: {
      marginBottom: 10,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    entryTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: "#111",
      flex: 1,
    },
    entryDate: {
      fontSize: 9,
      color: "#777",
      marginLeft: 8,
    },
    entryOrg: {
      fontSize: 9.5,
      color: "#555",
      marginBottom: 4,
    },
    bulletRow: {
      flexDirection: "row",
      marginBottom: 2,
      paddingLeft: 2,
    },
    bulletDot: {
      fontSize: 10,
      color: accent,
      marginRight: 5,
      marginTop: 0.5,
    },
    bulletText: {
      fontSize: 9.5,
      color: "#333",
      flex: 1,
      lineHeight: 1.45,
    },
  });

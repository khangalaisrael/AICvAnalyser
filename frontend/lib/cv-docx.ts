/**
 * Generates an editable .docx from a rewritten CV ledger.
 * Uses the `docx` package — pure JS, no headless browser needed.
 * Output opens in Word, Google Docs, LibreOffice.
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  LevelFormat,
  NumberFormat,
} from "docx";
import type { RewrittenCVLedger } from "@/lib/types";

function bold(text: string, size = 22): TextRun {
  return new TextRun({ text, bold: true, size });
}
function normal(text: string, size = 20): TextRun {
  return new TextRun({ text, size });
}
function muted(text: string, size = 18): TextRun {
  return new TextRun({ text, size, color: "666666" });
}

function sectionHeading(label: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: label.toUpperCase(),
        bold: true,
        size: 20,
        color: "1a1a1a",
        characterSpacing: 80,
      }),
    ],
    spacing: { before: 200, after: 60 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "cccccc", space: 4 },
    },
  });
}

function bulletParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [normal(text, 19)],
    bullet: { level: 0 },
    spacing: { after: 40 },
  });
}

export async function buildDocx(rewritten: RewrittenCVLedger): Promise<Buffer> {
  const { contact, summary, experience, education, skills, projects } = rewritten;
  const children: Paragraph[] = [];

  // ── Name ─────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [bold(contact.name || "Your Name", 36)],
      alignment: AlignmentType.LEFT,
      spacing: { after: 80 },
    })
  );

  // ── Contact line ──────────────────────────────────────
  const contactParts = [
    contact.email,
    contact.phone,
    contact.location,
    ...(contact.links ?? []),
  ].filter(Boolean);

  if (contactParts.length) {
    children.push(
      new Paragraph({
        children: [muted(contactParts.join("  ·  "), 18)],
        spacing: { after: 160 },
      })
    );
  }

  // ── Summary ───────────────────────────────────────────
  if (summary) {
    children.push(sectionHeading("Profile"));
    children.push(
      new Paragraph({
        children: [normal(summary, 19)],
        spacing: { after: 120 },
      })
    );
  }

  // ── Experience ────────────────────────────────────────
  if (experience.length) {
    children.push(sectionHeading("Experience"));
    for (const exp of experience) {
      // Title + date on same line (right-aligned date via tab)
      children.push(
        new Paragraph({
          children: [
            bold(`${exp.title}`, 21),
            new TextRun({ text: `\t${exp.start} – ${exp.end}`, size: 18, color: "777777" }),
          ],
          spacing: { before: 100, after: 20 },
          tabStops: [{ type: "right", position: convertInchesToTwip(6.5) }],
        })
      );
      children.push(
        new Paragraph({
          children: [muted(exp.org, 19)],
          spacing: { after: 40 },
        })
      );
      for (const b of exp.bullets) {
        children.push(bulletParagraph(b.text));
      }
    }
  }

  // ── Skills ────────────────────────────────────────────
  if (skills.length) {
    children.push(sectionHeading("Skills"));
    children.push(
      new Paragraph({
        children: [normal(skills.join("  ·  "), 19)],
        spacing: { after: 120 },
      })
    );
  }

  // ── Projects ─────────────────────────────────────────
  if (projects.length) {
    children.push(sectionHeading("Projects"));
    for (const proj of projects) {
      children.push(
        new Paragraph({
          children: [bold(proj.name, 20)],
          spacing: { before: 80, after: 30 },
        })
      );
      for (const b of proj.bullets) {
        children.push(bulletParagraph(b.text));
      }
    }
  }

  // ── Education ────────────────────────────────────────
  if (education.length) {
    children.push(sectionHeading("Education"));
    for (const edu of education) {
      children.push(
        new Paragraph({
          children: [
            bold(edu.qualification, 21),
            new TextRun({ text: `\t${edu.year}`, size: 18, color: "777777" }),
          ],
          spacing: { before: 80, after: 20 },
          tabStops: [{ type: "right", position: convertInchesToTwip(6.5) }],
        })
      );
      children.push(
        new Paragraph({
          children: [muted(edu.institution, 19)],
          spacing: { after: 80 },
        })
      );
    }
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "bullet-list",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.25),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.9),
              right: convertInchesToTwip(0.9),
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  file: File | null;
  onFile: (f: File | null) => void;
}

export function PdfDropzone({ file, onFile }: Props) {
  const [dropError, setDropError] = useState<string | null>(null);

  const onDropAccepted = useCallback(
    (files: File[]) => { setDropError(null); onFile(files[0]); },
    [onFile]
  );

  const onDropRejected = useCallback(() => {
    setDropError("Please upload a PDF file under 10 MB.");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropAccepted,
    onDropRejected,
  });

  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#7c818b", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 10px" }}>
        CV / Résumé
      </p>

      <div
        {...getRootProps()}
        style={{
          border: isDragActive ? "2px dashed #f25c54" : file ? "1.5px solid #d9d8d0" : "2px dashed #d9d8d0",
          borderRadius: 12,
          padding: "20px 16px",
          background: isDragActive ? "rgba(242,92,84,0.04)" : file ? "rgba(0,0,0,0.015)" : "#fff",
          cursor: "pointer",
          textAlign: "center",
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        <input {...getInputProps()} />

        {file ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "rgba(242,92,84,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f25c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div style={{ textAlign: "left", minWidth: 0 }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "#22272f", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                {file.name}
              </p>
              <p style={{ fontSize: 12, color: "#7c818b", margin: "2px 0 0" }}>
                {(file.size / 1024).toFixed(0)} KB · Click to replace
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c818b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p style={{ fontSize: 13.5, color: "#22272f", fontWeight: 500, margin: "0 0 3px" }}>
              {isDragActive ? "Drop it here" : "Drop PDF here"}
            </p>
            <p style={{ fontSize: 12.5, color: "#7c818b", margin: 0 }}>
              or <span style={{ color: "#f25c54", fontWeight: 600 }}>browse files</span> · max 10 MB
            </p>
          </>
        )}
      </div>

      {dropError && (
        <p style={{ fontSize: 12.5, color: "#e84a45", margin: "6px 0 0" }}>{dropError}</p>
      )}
    </div>
  );
}

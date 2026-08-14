import { useEffect, useState } from "react";
import "./Documents.css";

import {
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
} from "react-icons/fa";

import api from "../../services/api";

const iconFor = (mimeType = "") => {
  if (mimeType.includes("pdf")) return { icon: <FaFilePdf />, color: "pdf" };
  if (mimeType.includes("word") || mimeType.includes("doc")) return { icon: <FaFileWord />, color: "doc" };
  return { icon: <FaFileAlt />, color: "invoice" };
};

const formatSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    let cancelled = false;

    api
      .get("/documents", { params: { limit: 4 } })
      .then((res) => {
        if (cancelled) return;
        setDocuments(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="documents">

      <div className="documents-header">

        <div>

          <h2>Documents & Reports</h2>

          <p>
            Documents and reports shared with you by our team.
          </p>

        </div>

      </div>

      {status === "loading" && <p className="documents-status">Loading documents...</p>}

      {status === "error" && (
        <p className="documents-status">
          We couldn't load your documents right now. Please try again shortly.
        </p>
      )}

      {status === "success" && documents.length === 0 && (
        <p className="documents-status">No documents have been shared with you yet.</p>
      )}

      {status === "success" && documents.length > 0 && (
        <div className="documents-grid">

          {documents.map((doc) => {
            const { icon, color } = iconFor(doc.file?.mimeType);

            return (
              <div
                className="document-card"
                key={doc._id}
              >

                <div className={`document-icon ${color}`}>

                  {icon}

                </div>

                <div className="document-content">

                  <h4>{doc.name}</h4>

                  <p>
                    {doc.category || "Document"}
                    {doc.file?.size ? ` • ${formatSize(doc.file.size)}` : ""}
                  </p>

                </div>

                <span className="document-unavailable">Not available</span>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
};

export default Documents;

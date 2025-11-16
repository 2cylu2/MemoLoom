import React from "react";
import { revertVersion } from "../api/ideas";

export default function VersionTimeline({ idea, refreshIdea }) {
  if (!idea) return <div>Select an idea to see versions.</div>;
  if (!idea.versions || idea.versions.length === 0) return <div>No versions yet.</div>;

  return (
    <div>
      <h3>Version History</h3>
      <ul>
        {idea.versions.map((v, i) => (
          <li key={v.id || i} style={{ marginBottom: "8px" }}>
            <div>
              <strong>Version {i + 1}</strong> - {new Date(v.timestamp).toLocaleString()}
            </div>
            <div style={{ fontStyle: "italic" }}>
              {v.content.slice(0, 50)}...
            </div>
            <button
              onClick={async () => {
                await revertVersion(idea.id, i); 
                refreshIdea(); // refresh the idea after reverting
              }}
            >
              Revert to this
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

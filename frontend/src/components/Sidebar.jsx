import React from "react";
import { createIdea, deleteIdea } from "../api/ideas";

export default function Sidebar({ ideas, setIdeas, activeId, setActiveId }) {
  
  async function addIdea() {
    const newIdea = await createIdea();
    setIdeas([newIdea, ...ideas]);
    setActiveId(newIdea.id);
  }

  async function removeIdea(id) {
    await deleteIdea(id);
    const remaining = ideas.filter(i => i.id !== id);
    setIdeas(remaining);
    if (remaining.length > 0) setActiveId(remaining[0].id);
    else setActiveId(null);
  }

  return (
    <div className="sidebar">
      <button onClick={addIdea} style={{ marginBottom: "12px" }}>
        + New Idea
      </button>

      {ideas.map((idea) => (
        <div
          key={idea.id}
          className={`idea-item ${idea.id === activeId ? "active" : ""}`}
          onClick={() => setActiveId(idea.id)}
        >
          {idea.title || "Untitled"}

          <button
            style={{
              float: "right",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "red",
            }}
            onClick={(e) => {
              e.stopPropagation();
              removeIdea(idea.id);
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

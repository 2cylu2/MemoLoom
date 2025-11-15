import React, { useState } from "react";

export default function SuggestionsPanel({ activeId, ideas }) {
  const [output, setOutput] = useState("");

  const getActiveText = () => {
    const idea = ideas.find(i => i.id === activeId);
    return idea ? idea.text : "";
  };

  async function callAI(endpoint, bodyObj) {
    try {
      const res = await fetch(`http://localhost:5050/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
      });

      const data = await res.json();

      // Extract result key automatically
      const key = Object.keys(data)[0];
      setOutput(data[key] || "No response");
    } catch (err) {
      console.error("AI Request Failed:", err);
      setOutput("Error contacting AI server.");
    }
  }

  return (
    <div className="suggestions-panel">

      <h3>AI Assistant</h3>

      <button
        onClick={() =>
          callAI("suggest", { text: getActiveText() })
        }
      >
        Improve Writing
      </button>

      <button
        onClick={() =>
          callAI("expand", { text: getActiveText() })
        }
      >
        Expand Idea
      </button>

      <button
        onClick={() => {
          const a = prompt("Enter idea A text:");
          const b = prompt("Enter idea B text:");
          callAI("compare", { ideaA: a, ideaB: b });
        }}
      >
        Compare Two Ideas
      </button>

      <button
        onClick={() => {
          const a = prompt("Enter idea A text:");
          const b = prompt("Enter idea B text:");
          callAI("merge", { ideaA: a, ideaB: b });
        }}
      >
        Merge Two Ideas
      </button>

      <textarea
        value={output}
        readOnly
        placeholder="AI Suggestions will appear here..."
        style={{
          width: "100%",
          height: "200px",
          marginTop: "10px",
        }}
      />

    </div>
  );
}

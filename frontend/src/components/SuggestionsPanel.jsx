export default function SuggestionsPanel({ activeId, ideas }) {
  const idea = ideas.find(i => i.id === activeId);

  return (
    <div className="suggestions">
      <h3>AI Suggestions</h3>

      {!idea && <p>Select an idea to get suggestions.</p>}

      {idea && (
        <div>
          <p>Suggestions will appear here (Gemini integration later).</p>
        </div>
      )}
    </div>
  );
}

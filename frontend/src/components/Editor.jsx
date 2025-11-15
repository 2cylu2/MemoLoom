import { updateIdea } from "../api/ideas";

export default function Editor({ activeId, ideas, setIdeas }) {
  const activeIdea = ideas.find((i) => i.id === activeId);

  async function updateContent(e) {
    const newContent = e.target.value;

    // update UI immediately
    const updated = ideas.map((i) =>
      i.id === activeId ? { ...i, content: newContent } : i
    );
    setIdeas(updated);

    // sync with backend
    await updateIdea(activeId, { content: newContent });
  }

  if (!activeIdea)
    return <div className="editor">Select or create an idea.</div>;

  return (
    <div className="editor">
      <textarea
        value={activeIdea.content}
        onChange={updateContent}
        placeholder="Start writing your idea..."
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";

export default function IdeaNode({ idea }) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  const [title, setTitle] = useState(idea.title);
  const [content, setContent] = useState(idea.content);

  // Load children on expand
  useEffect(() => {
    if (expanded) {
      axios.get(`http://localhost:3000/api/ideas/${idea._id}/children`)
        .then(res => setChildren(res.data));
    }
  }, [expanded, idea._id]);

  const saveField = async (field, value) => {
    await axios.put(`http://localhost:3000/api/ideas/${idea._id}`, {
      [field]: value
    });
  };

  const createChild = async () => {
    const res = await axios.post("http://localhost:3000/api/ideas", {
      parentId: idea._id,
      title: "Untitled",
      content: ""
    });
    setChildren([...children, res.data]);
    setExpanded(true);
  };

  const deleteIdea = async () => {
    await axios.delete(`http://localhost:3000/api/ideas/${idea._id}`);
    window.location.reload();
  };

  return (
    <div className="ml-4 border-l pl-4 mt-2">
      {/* Title row */}
      <div className="flex items-center gap-2">
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? "▼" : "▶"}
        </button>

        <input
          className="font-bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => saveField("title", title)}
        />

        <button onClick={createChild}>+</button>
        <button onClick={deleteIdea}>🗑</button>
      </div>

      {/* Editable content */}
      <textarea
        className="w-full mt-2 p-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => saveField("content", content)}
      />

      {/* Children */}
      {expanded && (
        <div className="mt-2">
          {children.map(child => (
            <IdeaNode key={child._id} idea={child} />
          ))}
        </div>
      )}
    </div>
  );
}

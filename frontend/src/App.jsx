import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import SuggestionsPanel from "./components/SuggestionsPanel";
import TopBar from "./components/TopBar";

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const [ideas, setIdeas] = useState([]);

  return (
    <div className="app-container">
      <TopBar />

      <div className="content">
        <Sidebar
          ideas={ideas}
          setIdeas={setIdeas}
          activeId={activeId}
          setActiveId={setActiveId}
        />

        <Editor
          activeId={activeId}
          ideas={ideas}
          setIdeas={setIdeas}
        />

        <SuggestionsPanel
          activeId={activeId}
          ideas={ideas}
        />
      </div>
    </div>
  );
}

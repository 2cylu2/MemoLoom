import React, { useState, useCallback, useMemo, useEffect } from "react";
import Editor from "./components/Editor";
import { loadIdeas, createIdea, updateIdea } from "./api/ideas";

// ---------------------------------------------
// ICONS (clean, centralized)
// ---------------------------------------------
const Icons = {
  Save: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  ),
  History: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6l3 3m7 1c0 5.5-4.5 10-10 10S2 17.5 2 12c0-2.3 0.8-4.5 2.2-6.2"></path>
    </svg>
  ),
  Plus: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Archive: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="4" rx="1"></rect>
      <path d="M21 9v11a2 2 0 0 1-2 2H5a 2 2 0 0 1-2-2V9"></path>
      <line x1="7" y1="13" x2="17" y2="13"></line>
    </svg>
  ),
  ChevronLeft: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  Bot: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"></path>
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="M6 12h4"></path>
      <path d="M14 12h4"></path>
      <path d="M10 16h4"></path>
    </svg>
  )
};

// ---------------------------------------------
// MAIN APP COMPONENT
// ---------------------------------------------
const API_BASE_URL = "http://localhost:5050";

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);

  const [isNavigatorOpen, setIsNavigatorOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const [aiOutput, setAiOutput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const selectedIdea = useMemo(
    () => ideas.find((i) => i.id === selectedIdeaId),
    [ideas, selectedIdeaId]
  );

  // LOAD IDEAS
  const fetchIdeas = useCallback(async () => {
    try {
      const data = await loadIdeas();
      setIdeas(data);

      if (!selectedIdeaId && data.length > 0) {
        setSelectedIdeaId(data[0].id);
      }
    } catch (err) {
      console.error("Error loading ideas:", err);
      setIdeas([
        {
          id: "error",
          title: "Backend Connection Error",
          content:
            "Could not connect to the API. Make sure your server is running.",
          versions: []
        }
      ]);
    }
  }, [selectedIdeaId]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // UPDATE TITLE
  const handleTitleChange = useCallback(
    async (e) => {
      const newTitle = e.target.value;
      const id = selectedIdeaId;
      if (!id) return;

      setIdeas((prev) =>
        prev.map((i) => (i.id === id ? { ...i, title: newTitle } : i))
      );

      await updateIdea(id, { title: newTitle });
    },
    [selectedIdeaId]
  );

  const selectIdea = useCallback((id) => {
    setSelectedIdeaId(id);
    setAiOutput("");
  }, []);

  // MANUAL SAVE
  const saveChanges = useCallback(() => {
    if (!selectedIdea) return;
    updateIdea(selectedIdea.id, {
      title: selectedIdea.title,
      content: selectedIdea.content
    });
  }, [selectedIdea]);

  // AI
  const callAI = useCallback(
    async (endpoint, bodyObj) => {
      if (!selectedIdea) return;
      setIsAiLoading(true);
      setAiOutput("Processing...");

      try {
        const res = await fetch(`${API_BASE_URL}/ai/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj)
        });

        const data = await res.json();
        const map = {
          suggest: "suggestion",
          compare: "analysis",
          merge: "merged"
        };

        setAiOutput(data[map[endpoint]] || data.error || "Invalid response");
      } catch (err) {
        console.error(err);
        setAiOutput("AI server error.");
      } finally {
        setIsAiLoading(false);
      }
    },
    [selectedIdea]
  );

  const createNewIdeaHandler = useCallback(async () => {
    const newIdea = await createIdea();
    await fetchIdeas();
    selectIdea(newIdea.id);
  }, [fetchIdeas, selectIdea]);

  return (
    <div className="relative flex h-screen w-screen bg-gray-100 font-sans">

      {/* --- NAVIGATOR --- */}
      <Navigator
        ideas={ideas}
        selectedIdeaId={selectedIdeaId}
        isNavigatorOpen={isNavigatorOpen}
        setIsNavigatorOpen={setIsNavigatorOpen}
        selectIdea={selectIdea}
        createNewIdea={createNewIdeaHandler}
      />

      <div className="flex flex-grow h-full overflow-hidden relative">
        
        {/* --- EDITOR AREA --- */}
        <EditorCanvas
          selectedIdea={selectedIdea}
          selectedIdeaId={selectedIdeaId}
          ideas={ideas}
          setIdeas={setIdeas}
          handleTitleChange={handleTitleChange}
          isNavigatorOpen={isNavigatorOpen}
          setIsNavigatorOpen={setIsNavigatorOpen}
          isHistoryOpen={isHistoryOpen}
          setIsHistoryOpen={setIsHistoryOpen}
        />

        {/* --- EVOLUTION PANEL --- */}
        <EvolutionPanel
          selectedIdea={selectedIdea}
          isHistoryOpen={isHistoryOpen}
          setIsHistoryOpen={setIsHistoryOpen}
          aiOutput={aiOutput}
          isAiLoading={isAiLoading}
          callAI={callAI}
          saveChanges={saveChanges}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------
// SEPARATE COMPONENTS (moved OUTSIDE main App to prevent
// re-mount flicker and focus-loss in Editor)
// ----------------------------------------------------------

function Navigator({
  ideas,
  selectedIdeaId,
  isNavigatorOpen,
  setIsNavigatorOpen,
  selectIdea,
  createNewIdea
}) {
  const { ChevronLeft, Plus, Archive, Bot } = Icons;

  return (
    <div
      className={`flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-hidden transition-all duration-300 relative 
      ${isNavigatorOpen ? "w-72 p-4" : "w-12"} hidden lg:flex`}
    >
      <button
        onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
        className="absolute top-4 -right-3 z-10 p-1 bg-white border border-gray-300 rounded-full shadow-md"
      >
        <ChevronLeft
          className={`w-4 h-4 transition-transform ${
            !isNavigatorOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isNavigatorOpen ? (
        <div className="flex flex-col h-full">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4">MemoLoom</h1>

          <button
            onClick={createNewIdea}
            className="w-full flex items-center justify-center px-4 py-2 mb-4 text-sm font-medium rounded-lg text-white bg-indigo-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Idea
          </button>

          <div className="flex-grow overflow-y-auto space-y-1">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => selectIdea(idea.id)}
                className={`cursor-pointer p-2 rounded-lg truncate ${
                  idea.id === selectedIdeaId
                    ? "bg-indigo-100 text-indigo-800 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {idea.title}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 text-sm flex items-center">
            <Archive className="w-5 h-5 mr-2" />
            Archive System
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <Bot className="w-5 h-5 text-indigo-600 mb-4" />
          <span className="text-sm transform rotate-90">IDEAS</span>
        </div>
      )}
    </div>
  );
}

function EditorCanvas({
  selectedIdea,
  selectedIdeaId,
  ideas,
  setIdeas,
  handleTitleChange,
  isNavigatorOpen,
  setIsNavigatorOpen,
  isHistoryOpen,
  setIsHistoryOpen
}) {
  const { ChevronLeft, History } = Icons;

  return (
    <div className="flex-grow flex flex-col bg-white h-full overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button
            onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
            className="lg:hidden p-2 mr-2 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={selectedIdea?.title || ""}
            onChange={handleTitleChange}
            className="text-3xl font-bold border-none p-1 truncate w-full"
            placeholder="Idea Title"
          />
        </div>

        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="lg:hidden p-2 rounded-full"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-grow p-6 overflow-y-auto">
        <Editor activeId={selectedIdeaId} ideas={ideas} setIdeas={setIdeas} />
      </div>
    </div>
  );
}

function EvolutionPanel({
  selectedIdea,
  isHistoryOpen,
  setIsHistoryOpen,
  aiOutput,
  isAiLoading,
  callAI,
  saveChanges
}) {
  const { ChevronLeft, Bot, History, Save } = Icons;

  return (
    <div
      className={`flex flex-col flex-shrink-0 bg-white border-l h-full overflow-y-auto transition-all duration-300 
        ${isHistoryOpen ? "w-80" : "w-12"} hidden lg:block relative`}
    >
      <button
        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        className="absolute top-4 -left-3 p-1 bg-white border rounded-full"
      >
        <ChevronLeft
          className={`w-4 h-4 ${isHistoryOpen ? "" : "rotate-180"}`}
        />
      </button>

      {isHistoryOpen ? (
        <div className="p-4 flex flex-col h-full">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">
            Evolution Panel
          </h2>

          {/* AI */}
          <div className="mb-6 pb-4 border-b">
            <h3 className="text-lg font-medium flex items-center mb-3">
              <Bot className="w-5 h-5 mr-2 text-indigo-500" /> AI Assistant
            </h3>

            <button
              onClick={() =>
                callAI("suggest", { text: selectedIdea?.content || "" })
              }
              className="w-full text-sm text-white bg-blue-500 rounded-lg p-2 mb-2"
            >
              {isAiLoading ? "Analyzing..." : "Suggest Improvements"}
            </button>

            <textarea
              value={aiOutput}
              readOnly
              className="w-full h-32 mt-2 p-2 text-sm rounded-lg border bg-gray-50"
            />
          </div>

          {/* SAVE */}
          <h3 className="text-lg font-medium mb-3 border-t pt-4">
            Data Control
          </h3>

          <button
            onClick={saveChanges}
            className="w-full flex items-center justify-center p-2 text-sm text-white bg-green-500 rounded-lg mb-4"
          >
            <Save className="w-4 h-4 mr-2" />
            Manually Sync/Save
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <History className="w-5 h-5 mb-4" />
          <span className="text-sm rotate-90">EVOLUTION</span>
        </div>
      )}
    </div>
  );
}

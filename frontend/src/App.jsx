import React, { useState, useCallback, useMemo, useEffect } from "react";

// ---------------------------------------------
// API Integration (Mocked in-file with localStorage)
// ---------------------------------------------
const API_BASE_URL = "http://localhost:5050";

// Mock database (using localStorage for persistence in this single file)
const DB_KEY = 'mock_ideas_db';
const getDb = () => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};
const setDb = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

// Mock API implementations for Ideas
const loadIdeas = async () => {
    await new Promise(r => setTimeout(r, 100)); // Simulate delay
    return getDb();
};

const getIdeaById = async (id) => {
    await new Promise(r => setTimeout(r, 50)); // Simulate delay
    const db = getDb();
    return db.find(i => i.id === id);
};

const createIdea = async () => {
    await new Promise(r => setTimeout(r, 100));
    const newIdea = {
        id: crypto.randomUUID(),
        title: "Untitled Idea",
        content: "",
        versions: [],
    };
    let db = getDb();
    db.unshift(newIdea);
    setDb(db);
    return newIdea;
};

/**
 * MOCK: Updates an idea and creates a new version if the content has changed.
 */
const updateIdea = async (id, updates) => {
    await new Promise(r => setTimeout(r, 100));
    let db = getDb();
    const ideaIndex = db.findIndex(i => i.id === id);

    if (ideaIndex !== -1) {
        const currentIdea = db[ideaIndex];
        // Use existing content if not provided in updates (e.g., when updating title only)
        const newContent = updates.content !== undefined ? updates.content : currentIdea.content;
        const oldContent = currentIdea.content;
        
        // CORE VERSIONING LOGIC: Check for content change
        if (newContent !== oldContent && updates.content !== undefined) { 
             const newVersion = {
                id: crypto.randomUUID(),
                content: oldContent, // Save the OLD content as the new version
                created_at: new Date().toISOString(),
                // Versions array holds old snapshots, so the version number should reflect the state *before* this save
                version_number: (currentIdea.versions.length + 1)
            };
            currentIdea.versions.push(newVersion);
        }

        // Apply new updates (including the new content if provided)
        db[ideaIndex] = { ...currentIdea, ...updates, content: newContent };
        setDb(db);
    }
    // Return the updated idea structure after saving
    return db[ideaIndex];
};

/**
 * MOCK: Deletes an idea by ID.
 */
const deleteIdea = async (id) => {
    await new Promise(r => setTimeout(r, 100));
    let db = getDb();
    const initialLength = db.length;
    db = db.filter(i => i.id !== id);
    setDb(db);
    return db.length < initialLength; // Return true if deleted
};


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
  ),
  Restore: (props) => ( // Restore Icon
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.76 2.76L3 7"/><path d="M3 3v4h4"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.76-2.76L21 17"/><path d="M21 21v-4h-4"/></svg>
  ),
  Trash: (props) => ( // Trash Icon
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"></path></svg>
  ),
  Compare: (props) => ( // Compare Icon
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10l5 5 5-5M12 2v20"/></svg>
  )
};

// ----------------------------------------------------------
// INLINE COMPONENTS
// ----------------------------------------------------------

function Editor({ activeId, ideas, setIdeas }) {
  const selectedIdea = useMemo(
    () => ideas.find((i) => i.id === activeId),
    [ideas, activeId]
  );
  
  const handleContentUpdate = useCallback((e) => {
    const newContent = e.target.value;
    if (!activeId) return;

    // Update local state immediately on change
    // This ensures the current, most recent text is always available in the 'ideas' state array for saving.
    setIdeas((prev) =>
      prev.map((i) => (i.id === activeId ? { ...i, content: newContent } : i))
    );
  }, [activeId, setIdeas]);

  return (
    <textarea
        className="w-full h-full min-h-[500px] p-4 text-lg rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-100 resize-none transition-shadow"
        value={selectedIdea?.content || ""}
        onChange={handleContentUpdate}
        placeholder="Start writing your idea here..."
    />
  );
}

function VersionTimeline({ versions, onSelectVersion, selectedVersion }) {
    const { Compare } = Icons;
    
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + 
               ', ' + date.toLocaleDateString('en-US');
    };

    const sortedVersions = useMemo(() => {
        if (!versions) return [];
        // Sort descending by creation date/version number
        return [...versions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [versions]);

    return (
        <div className="space-y-3">
            {sortedVersions.length === 0 && (
                <p className="text-gray-500 text-sm">No versions saved yet. Click the save button to start your history!</p>
            )}

            {sortedVersions.map((version) => (
                <div
                    key={version.id}
                    className={`p-3 border rounded-lg shadow-sm cursor-pointer transition duration-150 ease-in-out 
                    ${version.id === selectedVersion?.id 
                        ? "bg-indigo-100 border-indigo-500 shadow-md" 
                        : "bg-white border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => onSelectVersion(version)} // New selection handler
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className={`font-semibold text-sm ${version.id === selectedVersion?.id ? 'text-indigo-800' : 'text-gray-700'}`}>
                            Version {version.version_number || 'Historical'}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatTimestamp(version.created_at)}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate max-w-full italic">
                        {version.content.substring(0, 70)}{version.content.length > 70 ? '...' : ''}
                    </p>
                    
                    {version.id === selectedVersion?.id && (
                        <div className="flex items-center mt-2 pt-2 border-t border-indigo-200">
                            <Compare className="mr-1 w-4 h-4 text-indigo-600" /> 
                            <span className="text-xs font-medium text-indigo-600">
                                Selected for Compare/Restore
                             </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ---------------------------------------------
// MAIN APP COMPONENT
// ---------------------------------------------

export default function App() {
  const [ideas, setIdeas] = useState([]); 
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null); // New state for selected historical version

  const [isNavigatorOpen, setIsNavigatorOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const [aiOutput, setAiOutput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', 'saving'


  const selectedIdea = useMemo(
    () => ideas.find((i) => i.id === selectedIdeaId),
    [ideas, selectedIdeaId]
  );
  
  // Helper to change selected idea, resets AI and Version state
  const selectIdea = useCallback((id) => {
    setSelectedIdeaId(id);
    setSelectedVersion(null); // Reset selected version
    setAiOutput("");
  }, []);

  // Handler for creating a new idea
  const createNewIdeaHandler = useCallback(async () => {
    try {
        const newIdea = await createIdea();
        // Update local state immediately
        setIdeas(prev => [newIdea, ...prev]);
        selectIdea(newIdea.id);
    } catch (err) {
        console.error("Failed to create new idea:", err);
    }
  }, [selectIdea]);


  // LOAD IDEAS (Modified for Initial Idea Creation)
  const fetchIdeas = useCallback(async (initialLoad = false) => {
    try {
      const data = await loadIdeas();
      setIdeas(data);

      if (data.length > 0) {
        // Determine the idea to select (maintain current selection or default to first)
        const ideaToSelect = selectedIdeaId && data.find(i => i.id === selectedIdeaId) 
            ? selectedIdeaId 
            : data[0].id;
        setSelectedIdeaId(ideaToSelect);

      } else if (initialLoad && data.length === 0) {
        // REQUEST: Create one untitled idea ONLY ON INITIAL LOAD if the list is empty
        await createNewIdeaHandler();
      }
    } catch (err) {
      console.error("Error loading ideas:", err);
      // Fallback for API error
      setIdeas([
        {
          id: "error",
          title: "Backend Connection Error",
          content: `Could not connect to the API at ${API_BASE_URL}. Please ensure your Express server is running.`,
          versions: []
        }
      ]);
    }
  }, [selectedIdeaId, createNewIdeaHandler]);

  useEffect(() => {
    // Initial fetch, pass true to trigger initial idea creation if no data exists
    fetchIdeas(true); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // CONTENT UPDATE FUNCTION (Used by Editor and Restore)
  const handleContentChange = useCallback((newContent) => {
    const id = selectedIdeaId;
    if (!id) return;

    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, content: newContent } : i))
    );
  }, [selectedIdeaId]);

  // UPDATE TITLE (Commits immediately via mock API)
  const handleTitleChange = useCallback(
    async (e) => {
      const newTitle = e.target.value;
      const id = selectedIdeaId;
      if (!id) return;

      // Update local state immediately for responsiveness
      setIdeas((prev) =>
        prev.map((i) => (i.id === id ? { ...i, title: newTitle } : i))
      );
      
      try {
        // Update title without triggering a version snapshot
        await updateIdea(id, { title: newTitle }); 
      } catch (err) {
        console.error("Title update failed:", err);
      }
    },
    [selectedIdeaId]
  );

  // DELETE HANDLER
  const deleteIdeaHandler = useCallback(async (id) => {
    // Using console.log instead of alert/confirm due to iframe limitations
    console.log(`Attempting to delete idea ID: ${id}`);
    
    try {
        const success = await deleteIdea(id);
        if (success) {
            // Get the latest list after deletion
            const updatedIdeas = getDb(); 
            setIdeas(updatedIdeas);

            // Logic to handle selection after deletion
            if (selectedIdeaId === id) {
                if (updatedIdeas.length > 0) {
                    setSelectedIdeaId(updatedIdeas[0].id);
                } else {
                    setSelectedIdeaId(null);
                }
            }
            console.log("Idea deleted successfully.");
        } else {
            console.error("Deletion failed (idea not found).");
        }
    } catch (err) {
        console.error("Error deleting idea:", err);
    }
  }, [selectedIdeaId]);


  // MANUAL SAVE (Commits current state and creates version if content changed)
  const saveChanges = useCallback(async () => {
    if (!selectedIdea) return;
    setSaveStatus('saving');

    try {
      // 1. Commit the current state (title + content) to the backend/mock DB.
      await updateIdea(selectedIdea.id, {
        title: selectedIdea.title,
        content: selectedIdea.content
      });

      // 2. Refresh the idea to get the newly generated version from the mock API
      const updated = await getIdeaById(selectedIdea.id);
      
      setIdeas((prev) =>
        prev.map((i) => (i.id === selectedIdea.id ? updated : i))
      );

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000); // Clear status after 3s
      console.log("Saved and version updated!");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 5000); // Clear error after 5s
    }
  }, [selectedIdea]);

  // RESTORE HANDLER (Pulls content from version and puts it in the editor)
  const handleRestore = useCallback((historicalContent) => {
    handleContentChange(historicalContent);
    // Remove the selection to prompt the user to save the restored content.
    setSelectedVersion(null); 
    // Clear AI output to indicate a new action is required
    setAiOutput(`Restored content from historical version.
    
REMINDER: This content is only in the editor. Click 'Save Draft' below to permanently commit this historical version as your new current draft.`);
    
    console.log("Content restored to the editor! Click 'Save Draft' to commit.");
  }, [handleContentChange]);


  // AI FUNCTION (Connects to backend)
  const callAI = useCallback(
    async (endpoint, bodyObj) => {
      if (!selectedIdea) return;
      setIsAiLoading(true);
      setAiOutput("Processing request... Please wait.");

      try {
        const res = await fetch(`${API_BASE_URL}/ai/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj)
        });

        const data = await res.json();
        
        // Check for backend error message
        if (data.error) {
             setAiOutput(`AI server error: ${data.error}`);
             return;
        }

        // Map the backend's response key to the frontend's expected key
        const map = {
          suggest: "suggestion",
          'compare': 'analysis' 
        };
        const resultKey = map[endpoint] || 'text'; 

        setAiOutput(data[resultKey] || "Invalid response from AI server.");
      } catch (err) {
        console.error(err);
        setAiOutput("AI server communication failed. Check if the backend is running and the API key is set.");
      } finally {
        setIsAiLoading(false);
      }
    },
    [selectedIdea]
  );
  
  // AI Version Comparison Specific Handler (Called when a version is selected)
  const analyzeVersion = useCallback(() => {
    if (!selectedVersion || !selectedIdea) {
        setAiOutput("Error: Historical version or current draft missing.");
        return;
    }
    
    // Call the correct compare endpoint with the required payload
    callAI('compare', {
        currentContent: selectedIdea.content,
        versionContent: selectedVersion.content
    });
  }, [selectedVersion, selectedIdea, callAI]);


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
        deleteIdea={deleteIdeaHandler}
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
          selectedIdeaId={selectedIdeaId} 
          isHistoryOpen={isHistoryOpen}
          setIsHistoryOpen={setIsHistoryOpen}
          aiOutput={aiOutput}
          isAiLoading={isAiLoading}
          callAI={callAI}
          saveChanges={saveChanges}
          saveStatus={saveStatus}
          // New props for version comparison
          selectedVersion={selectedVersion}
          onSelectVersion={setSelectedVersion}
          analyzeVersion={analyzeVersion}
          handleRestore={handleRestore}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------
// SEPARATE COMPONENTS (Inline Definitions)
// ----------------------------------------------------------

function Navigator({
  ideas,
  selectedIdeaId,
  isNavigatorOpen,
  setIsNavigatorOpen,
  selectIdea,
  createNewIdea,
  deleteIdea 
}) {
  const { ChevronLeft, Plus, Archive, Bot, Trash } = Icons; 

  return (
    <div
      className={`flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-hidden transition-all duration-300 relative 
      ${isNavigatorOpen ? "w-72 p-4" : "w-12"} hidden lg:flex`}
    >
      <button
        onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
        className="absolute top-4 -right-3 z-10 p-1 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition"
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
            className="w-full flex items-center justify-center px-4 py-2 mb-4 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Idea
          </button>

          <div className="flex-grow overflow-y-auto space-y-1">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer truncate ${
                  idea.id === selectedIdeaId ? "bg-indigo-100 font-medium text-indigo-800" : "hover:bg-gray-100"
                }`}
                onClick={() => selectIdea(idea.id)}
              >
                <span className="truncate flex-grow">{idea.title}</span>
                
                {/* DELETE BUTTON */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents selecting the idea when clicking delete
                        deleteIdea(idea.id);
                    }}
                    className="flex-shrink-0 p-1 ml-2 text-gray-400 rounded-full hover:bg-red-200 hover:text-red-600 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={`Delete idea: ${idea.title}`}
                >
                    <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 text-sm flex items-center text-gray-500">
            <Archive className="w-5 h-5 mr-2" />
            Archive
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <Bot className="w-5 h-5 text-indigo-600 mb-4" />
          <span className="text-sm transform rotate-90 text-gray-500">IDEAS</span>
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
            className="lg:hidden p-2 mr-2 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={selectedIdea?.title || ""}
            onChange={handleTitleChange}
            className="text-3xl font-bold border-none p-1 truncate w-full focus:ring-0 focus:outline-none"
            placeholder="Idea Title"
            onBlur={handleTitleChange} // Trigger API update on blur for title
          />
        </div>

        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition"
        >
          <History className="w-5 h-5 text-indigo-600" />
        </button>
      </div>

      <div className="flex-grow p-6 overflow-y-auto">
        {selectedIdeaId ? (
            <Editor 
                activeId={selectedIdeaId} 
                ideas={ideas} 
                setIdeas={setIdeas} 
            />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xl">
                Create a new idea to start writing!
            </div>
        )}
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
  saveChanges,
  saveStatus,
  selectedVersion,
  onSelectVersion,
  analyzeVersion,
  handleRestore
}) {
  const { ChevronLeft, Bot, Save, Compare, History, Restore } = Icons; 

  const aiActionDisabled = isAiLoading || !selectedIdea;
  
  // Conditionally set the current action button text
  let aiButtonText = "Suggest Improvements";
  if (selectedVersion) {
      aiButtonText = isAiLoading ? "Analyzing Version..." : `Compare Version ${selectedVersion.version_number}`;
  } else if (isAiLoading) {
      aiButtonText = "Analyzing Current Idea...";
  }

  return (
    <div
      className={`flex flex-col flex-shrink-0 bg-gray-50 border-l h-full overflow-hidden transition-all duration-300 
        ${isHistoryOpen ? "w-80" : "w-12"} hidden lg:block relative`}
    >
      <button
        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        className="absolute top-4 -left-3 p-1 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <ChevronLeft
          className={`w-4 h-4 transition-transform ${isHistoryOpen ? "" : "rotate-180"}`}
        />
      </button>

      {isHistoryOpen ? (
        <div className="p-4 flex flex-col h-full"> 
          
          {/* AI Section (Fixed Height Content) */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-medium flex items-center mb-3 text-indigo-600">
              <Bot className="w-5 h-5 mr-2 text-indigo-500" /> AI Assistant
            </h3>

            {/* AI Action Button: Changes based on selection */}
            <button
              onClick={selectedVersion ? analyzeVersion : () => callAI("suggest", { text: selectedIdea?.content || "" })}
              disabled={aiActionDisabled}
              className={`w-full text-sm text-white rounded-lg p-2 mb-4 transition flex items-center justify-center ${
                aiActionDisabled ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
                {selectedVersion && <Compare className="mr-2 w-4 h-4" />}
                {aiButtonText}
            </button>
            
            {/* AI Output Area */}
            <textarea
              value={aiOutput}
              readOnly
              className="w-full h-32 mt-2 p-2 text-sm rounded-lg border bg-white focus:outline-none resize-none"
              placeholder={selectedVersion ? `Click "Compare Version ${selectedVersion.version_number}" to see a detailed comparison.` : "AI suggestions will appear here."}
            />
          </div>


          {/* --- VERSION TIMELINE (FLEXIBLE HEIGHT CONTENT) --- */}
          <h3 className="text-lg font-medium border-t pt-4 mt-4 mb-3 text-gray-700">
            Version History
          </h3>
          <div className="flex-grow overflow-y-auto pr-2">
            <VersionTimeline 
              versions={selectedIdea?.versions || []} 
              onSelectVersion={onSelectVersion}
              selectedVersion={selectedVersion}
            />
          </div>


          {/* --- SAVE / Data Control (Fixed Height Footer) --- */}
          <div className="flex-shrink-0 border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-3 text-gray-700">
              Data Control
            </h3>
            
            {/* Restore button only shows if a version is selected */}
            {selectedVersion && (
                <button
                    onClick={() => handleRestore(selectedVersion.content)}
                    className="w-full mb-2 flex items-center justify-center text-sm font-medium text-green-700 bg-green-100 rounded-lg p-2 hover:bg-green-200 transition"
                    title="This loads historical content into the editor. Click 'Save Draft' below to commit it permanently."
                >
                    <Restore className="mr-2 w-5 h-5" /> Restore Version {selectedVersion.version_number} to Editor
                </button>
            )}

            <button
              onClick={saveChanges}
              disabled={saveStatus === 'saving' || !selectedIdea}
              className={`w-full flex items-center justify-center p-2 text-sm text-white rounded-lg transition ${
                saveStatus === 'saving' 
                ? 'bg-yellow-500 cursor-wait' 
                : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Draft'}
            </button>
            
            {/* Status Message */}
            {saveStatus && saveStatus !== 'saving' && (
              <p className={`mt-2 text-sm text-center font-medium ${
                saveStatus === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveStatus === 'success' 
                  ? 'Changes saved successfully and new version created!' 
                  : 'Save failed. Check console for details.'}
              </p>
            )}
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <History className="w-5 h-5 mb-4" />
          <span className="text-sm rotate-90">EVOLUTION</span>
        </div>
      )}
    </div>
  );
}
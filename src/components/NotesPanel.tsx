import React, { useState, useEffect } from "react";
import { getIdeas, createIdea, deleteIdea } from "../lib/api-client";

export default function NotesPanel({ notes, setNotes }: any) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getIdeas()
      .then((data) => setNotes(data))
      .finally(() => setLoading(false));
  }, [setNotes]);

  const addNote = async () => {
    if (!text.trim()) return;
    setNotes((prev: any) => [...prev, { text: text.trim(), id: `tmp-${Date.now()}` }]);
    try {
      const created = await createIdea({ text: text.trim() });
      setNotes((prev: any) => prev.map((n: any) => n.id.startsWith("tmp-") ? created : n));
    } catch {
      setNotes((prev: any) => prev.filter((n: any) => !n.id.startsWith("tmp-")));
    }
    setText("");
  };

  const removeNote = async (id: string) => {
    const prev = notes;
    setNotes(notes.filter((n: any) => n.id !== id));
    try {
      await deleteIdea(id);
    } catch {
      setNotes(prev);
    }
  };

  return (
    <div className="glass panel-shadow overflow-hidden panel-mount">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="upper tracking-[0.2em] text-cyan-500/80">Thought_Vault</span>
        </div>
        <div className="text-[9px] mono text-gray-400 uppercase tracking-widest bg-slate-900/80 px-2 py-0.5 rounded-sm border border-gray-800/50 font-black">
          {notes?.length || 0} Active_Nodes
        </div>
      </div>

      {/* Notes List */}
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        {loading && (
          <div className="flex items-center gap-3 py-4 scale-in">
            <div className="w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <span className="text-[10px] mono text-cyan-500/60 uppercase tracking-widest font-black">Synchronizing...</span>
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-600 opacity-50 scale-in">
            <div className="text-2xl mb-2">▧</div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] font-black">Memory_Buffer_Null</p>
          </div>
        )}

        {notes.map((n: any) => (
          <div
            key={n.id}
            className="p-3 rounded-lg bg-slate-800/10 border border-gray-700/50 hover:border-cyan-500/30 transition-all group relative hover-lift"
          >
            <span className="text-xs text-gray-300 leading-relaxed block pr-6 font-medium font-inter">{n.text}</span>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 hover-press"
              onClick={() => removeNote(n.id)}
              title="Purge"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="glass-heavy border-t border-gray-800/50 p-4 bg-slate-950/40">
        <textarea
          className="w-full bg-slate-950/60 border border-gray-700/30 rounded px-3 py-2 text-xs text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/50 transition-all mb-3 font-medium font-inter"
          rows={2}
          placeholder="Capture transient variable..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              addNote();
            }
          }}
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-cyan-500 pulse" />
            <span className="text-[8px] mono text-gray-500 uppercase tracking-widest font-black">Stream_Ready</span>
          </div>
          <button
            className="btn btn-primary text-[10px] px-4 py-1.5 font-black uppercase tracking-[0.1em] hover-press"
            onClick={addNote}
          >
            COMMIT_MEMLOG
          </button>
        </div>
      </div>
    </div>
  );
}

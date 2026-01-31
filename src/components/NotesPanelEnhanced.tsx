"use client";

import React, { useState } from "react";

interface Note {
    id: string;
    content: string;
    timestamp: Date;
}

export function NotesPanelEnhanced() {
    const [notes, setNotes] = useState<Note[]>([
        {
            id: "1",
            content: "Anchor: Ops Home + Dojo CLI are the base. No new surfaces until this is stable and trusted.",
            timestamp: new Date()
        }
    ]);
    const [newNote, setNewNote] = useState("");

    const addNote = () => {
        if (!newNote.trim()) return;
        setNotes([
            {
                id: Date.now().toString(),
                content: newNote,
                timestamp: new Date()
            },
            ...notes
        ]);
        setNewNote("");
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="upper">Notes</span>
            </div>

            {/* Input */}
            <div className="p-4 border-b border-gray-800/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addNote()}
                        placeholder="Quick note..."
                        className="flex-1 bg-slate-900/50 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                    />
                    <button
                        onClick={addNote}
                        className="btn btn-primary text-xs font-black uppercase tracking-widest hover-press px-4"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Notes List */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                <div className="space-y-3 scale-in">
                    {notes.map((note) => (
                        <div key={note.id} className="p-3 rounded-lg bg-slate-800/20 border border-gray-700/30 hover:border-cyan-500/30 transition-all hover-lift group">
                            <div className="text-sm text-gray-200 mb-2 leading-relaxed group-hover:text-white transition-colors">{note.content}</div>
                            <div className="text-[10px] mono text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                <span>{note.timestamp.toLocaleDateString()}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500/60 font-black">EDIT_DOC</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 text-[10px] mono text-gray-500 uppercase tracking-widest flex justify-between items-center font-black">
                <span className="opacity-50">{notes.length} total captures</span>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 pulse" />
                    <span className="text-emerald-400">Capturing</span>
                </div>
            </div>
        </div>
    );
}

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
        <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
            {/* Header */}
            <div className="panel-header flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                    <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Nexus_Notes</span>
                </div>
                <div className="flex items-center gap-4 opacity-40">
                    <span className="text-[9px] mono text-gray-400 font-bold uppercase tracking-widest leading-none">
                        V_01.2
                    </span>
                </div>
            </div>

            {/* Tactical Input */}
            <div className="p-4 border-b border-white/5 bg-slate-900/10 shrink-0">
                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNote(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && addNote()}
                        placeholder="CAPTURE_OBSERVATION..."
                        className="flex-1 bg-slate-950/80 border border-white/5 rounded-sm px-4 py-2 text-[11px] text-white mono placeholder-gray-800 focus:outline-none focus:border-cyan-500/30 transition-all font-bold uppercase tracking-widest"
                    />
                    <button
                        onClick={addNote}
                        className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-sm text-[9px] mono font-black uppercase tracking-widest hover:bg-cyan-500/20 hover-press transition-all"
                    >
                        PUSH
                    </button>
                    {/* Input accent */}
                    <div className="absolute left-0 bottom-0 w-8 h-[1px] bg-cyan-500/40" />
                </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar bg-slate-950/20">
                <div className="space-y-2 scale-in">
                    {notes.map((note, idx) => (
                        <div
                            key={note.id}
                            className="p-3 rounded border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all group scale-in relative overflow-hidden"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="text-[11px] text-gray-300 mb-3 leading-relaxed group-hover:text-white transition-colors">
                                <span className="text-cyan-500/40 mr-2 opacity-40">{"\u003E\u003E"}</span>
                                {note.content}
                            </div>

                            <div className="flex items-center justify-between border-t border-white/[0.02] pt-2">
                                <div className="text-[8px] mono text-gray-600 font-black uppercase tracking-widest">
                                    TS_{note.timestamp.getTime().toString().slice(-6)} // {note.timestamp.toLocaleDateString()}
                                </div>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="text-[8px] mono text-cyan-500/40 hover:text-cyan-500 font-black uppercase tracking-widest">BRANCH</button>
                                    <button className="text-[8px] mono text-rose-500/40 hover:text-rose-500 font-black uppercase tracking-widest">PURGE</button>
                                </div>
                            </div>

                            {/* Card accent */}
                            <div className="absolute top-0 right-0 w-8 h-[1px] bg-gradient-to-l from-cyan-500/20 to-transparent" />
                        </div>
                    ))}

                    {notes.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-800 opacity-40">
                            <p className="mono text-[9px] uppercase tracking-[0.4em] font-black italic">Buffer_Void_Null</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-white/5 px-6 py-3 flex justify-between items-center shrink-0 bg-slate-950/60">
                <div className="flex items-center gap-3">
                    <span className="text-[9px] mono text-gray-600 font-black uppercase tracking-widest">NODAT_SYNC_ACTIVE</span>
                    <div className="w-1 h-1 rounded-full bg-emerald-500/60 pulse" />
                </div>
                <div className="text-[9px] mono text-gray-800 font-black uppercase tracking-widest font-black">
                    COUNT: 0{notes.length}
                </div>
            </div>
        </div>
    );
}


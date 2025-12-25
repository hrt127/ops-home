import React, { useState } from "react";

export default function NotesPanel({ notes, setNotes }: any) {
  const [text, setText] = useState("");

  const addNote = () => {
    if (!text.trim()) return;
    const n: any = {
      id: `note-${Date.now()}`,
      label: text.trim(),
    };
    setNotes([...notes, n]);
    setText("");
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((n: any) => n.id !== id));
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Notes</h2>
      </div>
      <ul className="space-y-1 text-xs">
        {notes.map((n: any) => (
          <li
            key={n.id}
            className="rounded bg-zinc-900/80 px-2 py-1 flex items-center justify-between gap-2"
          >
            <span className="text-zinc-100">{n.label}</span>
            <button
              className="text-[10px] text-rose-400 hover:text-rose-300"
              onClick={() => removeNote(n.id)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 border-t border-zinc-800 pt-2">
        <textarea
          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 resize-none focus:outline-none focus:border-sky-500"
          rows={2}
          placeholder="New note"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="mt-1 rounded bg-sky-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-sky-500"
          onClick={addNote}
        >
          add
        </button>
      </div>
    </div>
  );
}

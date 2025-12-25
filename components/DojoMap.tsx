import React from "react";

export default function DojoMap({ projects }: any) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Dojo map</h2>
      </div>
      <ul className="space-y-1 text-xs">
        {projects.map((p: any) => (
          <li
            key={p.id}
            className="rounded bg-zinc-900/80 px-2 py-1 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-100">{p.label}</span>
              <span className="text-[10px] uppercase text-zinc-400">{p.status}</span>
            </div>
            <div className="text-[10px] text-zinc-500">{p.path}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

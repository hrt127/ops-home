"use client";

import React from "react";

interface Project {
    id: string;
    name: string;
    status: "live" | "paused" | "idea";
    path: string;
}

interface ProjectManagerProps {
    projects?: Project[];
}

export function ProjectManager({ projects = [] }: ProjectManagerProps) {
    const defaultProjects: Project[] = [
        {
            id: "ops-home",
            name: "Ops Home",
            status: "live",
            path: "~/dojo/projects/ops-home"
        },
        {
            id: "elfa-tools",
            name: "Elfa Tools",
            status: "live",
            path: "~/dojo/projects/elfa-tools"
        }
    ];

    const displayProjects = projects.length > 0 ? projects : defaultProjects;

    const getStatusStyles = (status: Project["status"]) => {
        switch (status) {
            case "live":
                return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
            case "paused":
                return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
            case "idea":
                return { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
            {/* Header */}
            <div className="panel-header flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                    <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Workspace_Registry</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] mono text-gray-500 font-bold uppercase tracking-widest leading-none">FS_SYNC: OK</span>
                    <button className="text-[9px] mono text-cyan-400 hover:text-cyan-300 transition-colors hover-press font-black uppercase tracking-widest">ADD_WS</button>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 p-4 grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar bg-slate-950/20">
                {displayProjects.map((project, idx) => {
                    const styles = getStatusStyles(project.status);
                    return (
                        <div
                            key={project.id}
                            className="p-3 rounded border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all cursor-pointer group scale-in hover-lift flex flex-col justify-between"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-3 bg-cyan-500/20" />
                                        <h3 className="text-[12px] font-black text-white italic uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                                            {project.name}
                                        </h3>
                                    </div>
                                    <div className="text-[8px] mono text-gray-700 font-bold uppercase tracking-widest truncate max-w-[120px]">
                                        {project.path}
                                    </div>
                                </div>
                                <div className={`text-[7px] mono font-black px-1.5 py-0.5 rounded-sm border uppercase tracking-widest leading-none ${styles.bg} ${styles.color} ${styles.border}`}>
                                    {project.status}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                                <div className="flex -space-x-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-3 h-3 rounded-full border border-slate-950 bg-gray-800" />
                                    ))}
                                </div>
                                <span className="text-[7px] mono text-gray-800 font-black uppercase tracking-widest italic group-hover:text-gray-600 transition-colors">
                                    INDEX_v.2.4
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-white/5 px-6 py-3 flex items-center justify-between shrink-0 bg-slate-950/60 font-black">
                <div className="flex items-center gap-3">
                    <span className="text-[9px] mono text-gray-600 uppercase tracking-widest">{displayProjects.length} VOLUMES_MOUNTED</span>
                    <div className="w-1 h-3 bg-gray-800 rotate-12" />
                    <span className="text-[9px] mono text-gray-700 uppercase tracking-widest">ACTIVE_CTX: ROOT</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse" />
                    <span className="text-[9px] mono text-gray-300 uppercase tracking-widest">LIVE_SYNC</span>
                </div>
            </div>
        </div>
    );
}

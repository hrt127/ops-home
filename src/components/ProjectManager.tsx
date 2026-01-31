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

    const getStatusColor = (status: Project["status"]) => {
        switch (status) {
            case "live":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "paused":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            case "idea":
                return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
        }
    };

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="upper">Project Manager</span>
                </div>
                <button className="text-[10px] mono text-cyan-400 hover:text-cyan-300 font-black uppercase tracking-widest hover-press">View_System</button>
            </div>

            {/* Projects Grid */}
            <div className="p-4 grid grid-cols-2 gap-3 scale-in">
                {displayProjects.map((project) => (
                    <div
                        key={project.id}
                        className="p-4 rounded-lg bg-slate-800/20 border border-gray-700/30 hover:border-cyan-500/30 transition-all cursor-pointer hover-lift group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{project.name}</h3>
                            <span className={`px-2 py-0.5 rounded text-[9px] mono font-black uppercase tracking-widest border transition-all group-hover:scale-105 ${getStatusColor(project.status)}`}>
                                {project.status}
                            </span>
                        </div>
                        <div className="text-[10px] mono text-gray-500 truncate font-medium group-hover:text-gray-400 transition-colors">{project.path}</div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 text-[10px] mono text-gray-500 uppercase tracking-widest flex justify-between items-center font-black">
                <span className="opacity-50">{displayProjects.length} projects linked</span>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 pulse" />
                    <span className="text-emerald-400">FS_WATCHER</span>
                </div>
            </div>
        </div>
    );
}

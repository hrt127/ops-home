"use client";

import React, { useState } from "react";

interface Task {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high" | "critical";
    dueDate?: string;
    project?: string;
}

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Complete Phase 3 wallet integration",
            status: "in-progress",
            priority: "high",
            project: "ops-home"
        },
        {
            id: "2",
            title: "Review market data API implementation",
            status: "todo",
            priority: "medium",
            dueDate: "2026-02-01"
        },
        {
            id: "3",
            title: "Update documentation for Phase 4",
            status: "todo",
            priority: "medium",
            project: "ops-home"
        }
    ]);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");

    const addTask = () => {
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            status: "todo",
            priority: "medium"
        };

        setTasks([newTask, ...tasks]);
        setNewTaskTitle("");
    };

    const toggleTaskStatus = (id: string) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const statusOrder: Task["status"][] = ["todo", "in-progress", "done"];
                const currentIndex = statusOrder.indexOf(task.status);
                const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                return { ...task, status: nextStatus };
            }
            return task;
        }));
    };

    const getPriorityColor = (priority: Task["priority"]) => {
        switch (priority) {
            case "critical":
                return "text-rose-400 border-rose-500/30";
            case "high":
                return "text-amber-400 border-amber-500/30";
            case "medium":
                return "text-cyan-400 border-cyan-500/30";
            case "low":
                return "text-gray-400 border-gray-500/30";
        }
    };

    const getStatusIcon = (status: Task["status"]) => {
        switch (status) {
            case "done":
                return "✓";
            case "in-progress":
                return "⟳";
            case "todo":
                return "○";
        }
    };

    const getStatusColor = (status: Task["status"]) => {
        switch (status) {
            case "done":
                return "text-emerald-400";
            case "in-progress":
                return "text-amber-400";
            case "todo":
                return "text-gray-400";
        }
    };

    const filteredTasks = filter === "all"
        ? tasks
        : tasks.filter(task => task.status === filter);

    return (
        <div className="glass panel-shadow overflow-hidden panel-mount">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="upper">Task Manager</span>
                </div>
                <div className="flex items-center gap-2">
                    {(["all", "todo", "in-progress", "done"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`text-[10px] mono uppercase tracking-widest px-2 py-1 rounded transition-colors hover-press ${filter === f
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add Task */}
            <div className="p-4 border-b border-gray-800/50 bg-slate-950/20">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                        placeholder="New task..."
                        className="flex-1 bg-slate-900/50 border border-gray-700/50 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all font-medium hover-press"
                    />
                    <button
                        onClick={addTask}
                        className="px-4 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs mono font-black uppercase tracking-widest border border-cyan-500/20 transition-all hover-press active:scale-95"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Task List */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                <div key={filter} className="space-y-3 scale-in">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-3 rounded-lg bg-slate-800/30 border border-gray-700/50 hover:border-cyan-500/30 transition-all group hover-lift"
                        >
                            <div className="flex items-start gap-4">
                                <button
                                    onClick={() => toggleTaskStatus(task.id)}
                                    className={`text-lg ${getStatusColor(task.status)} group-hover:scale-110 transition-all hover-press flex-shrink-0 mt-0.5`}
                                >
                                    {getStatusIcon(task.status)}
                                </button>
                                <div className="flex-1">
                                    <div className={`text-sm tracking-wide leading-relaxed ${task.status === "done" ? "line-through text-gray-500" : "text-gray-200"}`}>
                                        {task.title}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-[10px] mono uppercase tracking-widest px-2 py-0.5 rounded border ${getPriorityColor(task.priority)} flex items-center gap-1.5`}>
                                            {task.priority === "critical" && <span className="w-1 h-1 rounded-full bg-rose-500 pulse" />}
                                            {task.priority}
                                        </span>
                                        {task.project && (
                                            <span className="text-[10px] mono uppercase tracking-widest text-gray-500 bg-gray-800/50 px-1.5 rounded border border-gray-700/30">
                                                {task.project}
                                            </span>
                                        )}
                                        {task.dueDate && (
                                            <span className="text-[10px] mono uppercase tracking-widest text-gray-500 flex items-center gap-1">
                                                <span className="opacity-50">DUE:</span> {task.dueDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-600 opacity-50 scale-in">
                        <div className="text-3xl mb-3">✓</div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em]">Queue Clean</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="glass-heavy border-t border-gray-800/50 px-4 py-2 flex items-center justify-between text-[10px] mono text-gray-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-500 pulse" />
                    <span className="font-bold">{filteredTasks.length} active tasks</span>
                </div>
                <span className="opacity-50">
                    {tasks.filter(t => t.status === "done").length} / {tasks.length} complete
                </span>
            </div>
        </div>
    );
}

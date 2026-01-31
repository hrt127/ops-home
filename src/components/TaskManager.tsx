"use client";

import React from "react";

interface Task {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high" | "critical";
    dueDate?: string;
    project?: string;
}

export function TaskManager() {
    const [tasks, setTasks] = React.useState<Task[]>([
        {
            id: "1",
            title: "Wallet_Registry_Audit: Syncing balances + risk assessment",
            status: "in-progress",
            priority: "high",
            project: "ops-home"
        },
        {
            id: "2",
            title: "Market_Data_API: Review funding rate integration",
            status: "todo",
            priority: "medium",
            dueDate: "02.01"
        },
        {
            id: "3",
            title: "Phase_4_Docs: Update architectural alignment",
            status: "todo",
            priority: "medium",
            project: "ops-home"
        }
    ]);

    const [newTaskTitle, setNewTaskTitle] = React.useState("");
    const [filter, setFilter] = React.useState<"all" | "todo" | "in-progress" | "done">("all");

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
        setTasks(tasks.map((task: Task) => {
            if (task.id === id) {
                const statusOrder: Task["status"][] = ["todo", "in-progress", "done"];
                const currentIndex = statusOrder.indexOf(task.status);
                const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                return { ...task, status: nextStatus };
            }
            return task;
        }));
    };

    const getPriorityStyles = (priority: Task["priority"]) => {
        switch (priority) {
            case "critical": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
            case "high": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
            case "medium": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
            case "low": return "text-gray-500 bg-gray-500/10 border-gray-500/20";
        }
    };

    const filteredTasks = filter === "all"
        ? tasks
        : tasks.filter((task: Task) => task.status === filter);

    return (
        <React.Fragment>
            <div className="glass panel-shadow overflow-hidden panel-mount flex flex-col h-full">
                {/* Header */}
                <div className="panel-header flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse" />
                        <span className="text-[11px] mono font-black uppercase tracking-[0.25em]">Task_Queue_v2</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {(["all", "todo", "in", "done"] as const).map((f: string) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f === 'in' ? 'in-progress' : f as any)}
                                className={`text-[8px] mono uppercase tracking-widest px-2 py-0.5 rounded border transition-all hover-press font-black ${(f === 'in' ? filter === 'in-progress' : filter === f)
                                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                    : "text-gray-600 border-transparent hover:text-gray-400"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tactical Input Area */}
                <div className="p-4 border-b border-gray-800/40 bg-slate-900/10 shrink-0">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addTask()}
                                placeholder="OPERATIONAL_INPUT_REQUIRED..."
                                className="w-full bg-slate-950/40 border border-gray-800/60 rounded-sm px-3 py-2 text-[11px] mono text-white placeholder-gray-700 focus:outline-none focus:border-cyan-500/40 transition-all font-black uppercase tracking-wider"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                <div className="w-1 h-3 bg-gray-800 rotate-12" />
                                <div className="w-1 h-3 bg-gray-800 rotate-12" />
                            </div>
                        </div>
                        <button
                            onClick={addTask}
                            className="px-4 py-2 rounded-sm bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] mono font-black uppercase tracking-[0.2em] border border-cyan-500/20 transition-all hover-press shadow-lg shadow-cyan-500/5"
                        >
                            PUSH
                        </button>
                    </div>
                </div>

                {/* Queue List */}
                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar bg-slate-900/5 p-4">
                    <div key={filter} className="space-y-3 scale-in">
                        {filteredTasks.map((task: Task, idx: number) => (
                            <div
                                key={task.id}
                                className={`p-3 rounded-lg border transition-all duration-300 group hover-lift relative overflow-hidden ${task.status === 'done' ? 'bg-slate-900/10 border-gray-800/30 opacity-60' : 'bg-slate-900/30 border-gray-800/60 hover:border-cyan-500/30'
                                    }`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                {/* Priority Indicator */}
                                <div className={`absolute top-0 right-0 w-12 h-[2px] ${getPriorityStyles(task.priority).split(' ')[0].replace('text-', 'bg-')}`} />

                                <div className="flex items-start gap-4">
                                    <button
                                        onClick={() => toggleTaskStatus(task.id)}
                                        className={`w-5 h-5 rounded-sm border flex items-center justify-center text-[10px] mono font-black transition-all hover-press mt-0.5 ${task.status === "done" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-slate-950 border-gray-700 text-gray-700 hover:border-cyan-500/50"
                                            }`}
                                    >
                                        {task.status === "done" ? "✓" : "○"}
                                    </button>

                                    <div className="flex-1">
                                        <div className={`text-[12px] font-bold tracking-tight leading-snug transition-all ${task.status === "done" ? "line-through text-gray-600" : "text-gray-200 group-hover:text-white"
                                            }`}>
                                            {task.title}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2.5">
                                            <span className={`text-[8px] mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${getPriorityStyles(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            {task.project && (
                                                <span className="text-[8px] mono font-black uppercase tracking-widest text-cyan-500/40">
                                                    {"\u003E\u003E"} {task.project}
                                                </span>
                                            )}
                                            {task.dueDate && (
                                                <div className="flex items-center gap-1 text-[8px] mono font-black uppercase tracking-widest text-gray-600">
                                                    <span className="opacity-40">T-MINUS:</span>
                                                    <span>{task.dueDate}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredTasks.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-700 opacity-40 scale-in">
                                <div className="w-12 h-[1px] bg-gray-800 mb-4" />
                                <p className="mono text-[9px] uppercase tracking-[0.4em] font-black italic">Queue_Sync_Complete</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="glass-heavy border-t border-gray-800/50 px-6 py-3 flex items-center justify-between shrink-0 text-[10px] mono text-gray-500 uppercase tracking-widest font-black">
                    <div className="flex items-center gap-3">
                        <span className="opacity-40">QUEUE: {tasks.length}</span>
                        <div className="w-1 h-3 bg-gray-800 rotate-12" />
                        <span className="text-emerald-500/60 font-black">DONE: {tasks.filter(t => t.status === "done").length}</span>
                    </div>
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 pulse" />
                        <span className="group-hover:text-cyan-400 transition-colors uppercase">SYNC_AUTO</span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


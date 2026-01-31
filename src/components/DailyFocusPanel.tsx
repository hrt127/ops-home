import React, { useEffect, useState } from "react";
import { getDailyFocus, addDailyTask, toggleDailyTask, DailyTask } from "../lib/api-client";
import { clsx } from "clsx";

export default function DailyFocusPanel() {
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(false);

    // Poll for updates (e.g. every 10s or just on mount) - User said "Poll system-pulse every 10s", 
    // didn't strictly say poll daily focus, but it's good practice for "no silos".
    // Let's just load on mount for now.

    const load = async () => {
        try {
            const data = await getDailyFocus();
            if (data && data.tasks) {
                setTasks(data.tasks);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const tempId = crypto.randomUUID();
        const tempTask = { id: tempId, text: newTask, done: false };

        setTasks([...tasks, tempTask]);
        setNewTask("");

        try {
            await addDailyTask(newTask);
            await load(); // Reload to get real ID if needed, though UUID is generated on backend too? 
            // Actually backend generates ID. 
        } catch (e) {
            console.error(e);
            // rollback
        }
    };

    const handleToggle = async (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
        try {
            await toggleDailyTask(id);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="glass panel-shadow h-full flex flex-col panel-mount overflow-hidden">
            {/* Header */}
            <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="upper text-emerald-400/90 tracking-[0.2em]">Daily Focus</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse" />
                    <div className="text-[10px] mono text-gray-500 font-bold uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-gray-800/50">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {tasks.map((t) => (
                    <div
                        key={t.id}
                        className={clsx(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group hover-lift",
                            t.done
                                ? "bg-slate-900/30 border-gray-800/30 opacity-40"
                                : "bg-slate-800/20 border-gray-700/50 hover:border-emerald-500/30 hover:bg-slate-800/40"
                        )}
                        onClick={() => handleToggle(t.id)}
                    >
                        <div className={clsx(
                            "w-4 h-4 rounded-sm border flex items-center justify-center transition-all hover-press",
                            t.done
                                ? "border-emerald-500 bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                : "border-gray-600 group-hover:border-emerald-500/50"
                        )}>
                            {t.done && (
                                <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span className={clsx(
                            "text-sm font-medium transition-all flex-1",
                            t.done ? "line-through text-gray-500" : "text-gray-200 group-hover:text-white"
                        )}>
                            {t.text}
                        </span>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-gray-600 opacity-50 scale-in">
                        <div className="text-3xl mb-3">◈</div>
                        <p className="mono text-[10px] uppercase tracking-[0.2em]">No Focal Points</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="glass-heavy border-t border-gray-800/50 p-4">
                <form onSubmit={handleAdd} className="relative">
                    <input
                        className="w-full bg-slate-900/50 border border-gray-700/50 rounded-md pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium hover-press"
                        placeholder="Define next objective..."
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold mono pointer-events-none">
                        {">"}
                    </div>
                </form>
            </div>
        </div>
    );
}

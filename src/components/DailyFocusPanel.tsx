
import React, { useEffect, useState } from "react";
import { getDailyFocus, addDailyTask, toggleDailyTask } from "../lib/api-client";
import { clsx } from "clsx";

export default function DailyFocusPanel() {
    const [tasks, setTasks] = useState<any[]>([]);
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
        <div className="rounded-md border border-emerald-900/30 bg-zinc-900/40 p-3 h-full flex flex-col">
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-emerald-400">Daily Focus</h2>
                <span className="text-[10px] text-zinc-500">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {tasks.map((t) => (
                    <div
                        key={t.id}
                        className={clsx(
                            "flex items-center gap-2 p-1.5 rounded hover:bg-zinc-800/50 cursor-pointer group",
                            t.done ? "opacity-50" : ""
                        )}
                        onClick={() => handleToggle(t.id)}
                    >
                        <div className={clsx(
                            "w-3 h-3 rounded-full border flex items-center justify-center",
                            t.done ? "border-emerald-500 bg-emerald-500/20" : "border-zinc-600"
                        )}>
                            {t.done && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </div>
                        <span className={clsx("text-xs flex-1", t.done && "line-through text-zinc-500")}>
                            {t.text}
                        </span>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-xs text-zinc-600 italic py-2 text-center">No tasks for today</div>
                )}
            </div>

            <form onSubmit={handleAdd} className="mt-2 pt-2 border-t border-zinc-800">
                <input
                    className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
                    placeholder="+ Add task..."
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                />
            </form>
        </div>
    );
}

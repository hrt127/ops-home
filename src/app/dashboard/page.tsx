"use client";

import React, { useState, useEffect } from "react";
import { MarketStripEnhanced } from "@/components/MarketStripEnhanced";
import { WalletManager } from "@/components/WalletManager";
import { ActiveSession } from "@/components/ActiveSession";
import { SystemLog } from "@/components/SystemLog";
import { CalendarPanel } from "@/components/CalendarPanel";
import { NotesPanelEnhanced } from "@/components/NotesPanelEnhanced";
import { IdeasPanelEnhanced } from "@/components/IdeasPanelEnhanced";
import { ProjectManager } from "@/components/ProjectManager";
import { TaskManager } from "@/components/TaskManager";
import { LearningLab } from "@/components/LearningLab";
import { SocialFeed } from "@/components/SocialFeed";
import { TradingDashboard } from "@/components/TradingDashboard";
import { PokerLab } from "@/components/PokerLab";
import type { Wallet } from "@/lib/wallets";

export default function DashboardPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load wallets from API
        fetch("/api/wallets")
            .then((res) => res.json())
            .then((data) => {
                setWallets(data.wallets || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load wallets:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading Ops-Home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Panel 1: Market Strip (Top Bar) */}
            <MarketStripEnhanced />

            {/* Main Dashboard Grid */}
            <div className="max-w-[1920px] mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column: Wallet Manager (Panel 2) */}
                    <div className="col-span-3 space-y-6">
                        <WalletManager
                            wallets={wallets}
                            selectedWallet={selectedWallet}
                            onSelectWallet={setSelectedWallet}
                        />
                        {/* Panel 7: Trading Dashboard */}
                        <TradingDashboard />
                    </div>

                    {/* Center Column: Calendar, Notes, Tasks, System Log */}
                    <div className="col-span-5 space-y-6">
                        {/* Panel 3: Calendar */}
                        <CalendarPanel />

                        {/* Panel 4: Notes */}
                        <NotesPanelEnhanced />

                        {/* Panel 8: Task Manager */}
                        <TaskManager />

                        {/* Panel 6: System Log */}
                        <SystemLog />
                    </div>

                    {/* Right Column: Active Session, Ideas, Social, Learning, Projects, Poker */}
                    <div className="col-span-4 space-y-6">
                        {/* Panel 2b: Active Session */}
                        <ActiveSession wallet={selectedWallet} />

                        {/* Panel 5: Ideas */}
                        <IdeasPanelEnhanced />

                        {/* Panel 9: Social Feed */}
                        <SocialFeed />

                        {/* Panel 11: Learning Lab */}
                        <LearningLab />

                        {/* Panel 12: Project Manager */}
                        <ProjectManager />

                        {/* Panel 10: Poker Lab */}
                        <PokerLab />
                    </div>
                </div>
            </div>
        </div>
    );
}

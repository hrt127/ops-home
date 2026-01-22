import { useMemo } from "react";
import { Wallet, WalletActionEnum, WalletDappEnum } from "../lib/wallets";

export type GatedActionType = typeof WalletActionEnum._type;
export type GatedDapp = typeof WalletDappEnum._type;

export type GatingDecision =
    | { allowed: true; reason: string; severity: "info" | "soft" }
    | { allowed: false; reason: string; severity: "hard" | "soft" };

type Args = {
    wallet: Wallet | null;
    todayMissionWalletIds?: string[];
};

export function useWalletGating({ wallet, todayMissionWalletIds = [] }: Args) {
    const isTodayMission = useMemo(
        () => (id: string) => todayMissionWalletIds.includes(id),
        [todayMissionWalletIds]
    );

    const gateAction = (action: string): GatingDecision => {
        if (!wallet) {
            return { allowed: false, reason: "No wallet selected.", severity: "hard" };
        }

        if (wallet.status !== "active") {
            return {
                allowed: false,
                reason: `Wallet is ${wallet.status} and cannot perform actions.`,
                severity: "hard",
            };
        }

        if (wallet.forbidden_actions.includes(action as any)) {
            return {
                allowed: false,
                reason: `Action "${action}" is explicitly forbidden for this wallet.`,
                severity: "hard",
            };
        }

        if (
            wallet.allowed_actions.length > 0 &&
            !wallet.allowed_actions.includes(action as any)
        ) {
            return {
                allowed: false,
                reason: `Action "${action}" is not in the allowed set for this wallet.`,
                severity: "soft",
            };
        }

        if (
            wallet.lane === "identity" &&
            ["trade", "lp_provide", "lp_remove", "mint_nft", "mint_token"].includes(
                action
            )
        ) {
            return {
                allowed: false,
                reason: "Identity wallet cannot be used for trading, LP, or mints.",
                severity: "hard",
            };
        }

        return {
            allowed: true,
            reason: "Action allowed by wallet policy.",
            severity: isTodayMission(wallet.id) ? "info" : "soft",
        };
    };

    const gateDapp = (dapp: string): GatingDecision => {
        if (!wallet) {
            return { allowed: false, reason: "No wallet selected.", severity: "hard" };
        }

        if (wallet.status !== "active") {
            return {
                allowed: false,
                reason: `Wallet is ${wallet.status} and cannot connect to dapps.`,
                severity: "hard",
            };
        }

        if (wallet.forbidden_dapps.includes(dapp as any)) {
            return {
                allowed: false,
                reason: `Dapp "${dapp}" is explicitly forbidden for this wallet.`,
                severity: "hard",
            };
        }

        if (
            wallet.allowed_dapps.length > 0 &&
            !wallet.allowed_dapps.includes(dapp as any)
        ) {
            return {
                allowed: false,
                reason: `Dapp "${dapp}" is not in the allowed set for this wallet.`,
                severity: "soft",
            };
        }

        if (wallet.lane === "identity" && dapp === "unknown") {
            return {
                allowed: false,
                reason: "Identity wallet cannot connect to unknown dapps.",
                severity: "hard",
            };
        }

        return {
            allowed: true,
            reason: "Dapp connection allowed by wallet policy.",
            severity: isTodayMission(wallet.id) ? "info" : "soft",
        };
    };

    return { gateAction, gateDapp, isTodayMission };
}

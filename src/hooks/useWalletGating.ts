import { Wallet, WalletAction } from '@/lib/wallets';
import { useCallback } from 'react';

export type GatingResult = {
    allowed: boolean;
    reason?: string;
};

export function useWalletGating(wallet: Wallet) {
    const canPerformAction = useCallback(
        (action: WalletAction): GatingResult => {
            // 1. Check forbidden actions (explicit deny)
            if (wallet.forbidden_actions.includes(action)) {
                return {
                    allowed: false,
                    reason: `Action '${action}' is explicitly forbidden for this wallet (Lane: ${wallet.lane}).`
                };
            }

            // 2. Check allowed actions (explicit allow)
            if (wallet.allowed_actions.includes(action)) {
                return { allowed: true };
            }

            // 3. Default deny if not explicitly allowed? 
            // The context says: "Rules: each lane has explicit allowed/forbidden actions".
            // Usually, if it's not allowed, it's forbidden.
            return {
                allowed: false,
                reason: `Action '${action}' is not in the allowed list for this wallet.`
            };
        },
        [wallet]
    );

    const canInteractWithDapp = useCallback(
        (dappName: string): GatingResult => {
            // Normalize dapp name for comparison if needed
            const target = dappName.toLowerCase();

            // 1. Check forbidden dapps
            if (wallet.forbidden_dapps.some(d => d.toLowerCase() === target)) {
                return {
                    allowed: false,
                    reason: `Dapp '${dappName}' is explicitly forbidden for this wallet.`
                };
            }

            // 2. Check allowed dapps
            if (wallet.allowed_dapps.some(d => d.toLowerCase() === target)) {
                return { allowed: true };
            }

            return {
                allowed: false,
                reason: `Dapp '${dappName}' is not in the allowed list for this wallet.`
            };
        },
        [wallet]
    );

    return {
        canPerformAction,
        canInteractWithDapp
    };
}

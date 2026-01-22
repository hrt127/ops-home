import { z } from "zod";

export const WalletTypeEnum = z.enum(["EOA", "SAFE", "SMART_ACCOUNT"]);
export const WalletLaneEnum = z.enum([
    "identity",
    "trading",
    "deployer",
    "treasury",
    "lp",
    "mint",
    "test",
    "other",
]);
export const RiskBandEnum = z.enum([
    "high_sensitivity",
    "medium",
    "low",
    "experimental",
]);
export const WalletStatusEnum = z.enum(["active", "archived", "rotated"]);

export const WalletActionEnum = z.enum([
    "trade",
    "lp_provide",
    "lp_remove",
    "mint_nft",
    "mint_token",
    "deploy_contract",
    "admin_action",
    "treasury_move",
    "test_tx",
    "social_connect",
    "sign_message",
    "unknown_dapp_interaction",
]);

export const WalletDappEnum = z.enum([
    "base_swap",
    "uniswap",
    "aerodrome",
    "friend_tech",
    "warpcast",
    "opensea",
    "blur",
    "safe_app",
    "etherscan",
    "basescan",
    "unknown",
]);

export const WalletSchema = z.object({
    id: z.string(),
    address: z.string(),
    type: WalletTypeEnum,
    lane: WalletLaneEnum,
    chains: z.array(z.string()),
    ens_name: z.string().optional(),
    farcaster_handle: z.string().optional(),
    browser_profile: z.string().optional(),
    preferred_wallet_extension: z
        .enum(["rabby", "metamask", "coinbase", "none"])
        .optional(),
    risk_band: RiskBandEnum,
    purpose: z.string(),
    allowed_actions: z.array(WalletActionEnum).default([]),
    forbidden_actions: z.array(WalletActionEnum).default([]),
    allowed_dapps: z.array(WalletDappEnum).default([]),
    forbidden_dapps: z.array(WalletDappEnum).default([]),
    linked_projects: z.array(z.string()).default([]),
    status: WalletStatusEnum.default("active"),
});

export const WalletRegistrySchema = z.object({
    version: z.string(),
    wallets: z.array(WalletSchema),
});

export type Wallet = z.infer<typeof WalletSchema>;
export type WalletRegistry = z.infer<typeof WalletRegistrySchema>;

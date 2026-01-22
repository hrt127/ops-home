import { z } from "zod";

export const ProjectChainEnum = z.enum([
    "base",
    "ethereum",
    "optimism",
    "arbitrum",
]);

export const ContractTypeEnum = z.enum([
    "erc20",
    "erc721",
    "erc1155",
    "core_protocol",
    "factory",
    "other",
]);

export const LiquidityVenueEnum = z.enum([
    "aerodrome",
    "uniswap_v3",
    "uniswap_v2",
    "baseswap",
    "other",
]);

export const ProjectContractSchema = z.object({
    id: z.string(),
    type: ContractTypeEnum,
    address: z.string(),
    deployer_wallet_id: z.string(),
    admin_wallet_id: z.string().optional(),
});

export const ProjectLiquiditySchema = z.object({
    id: z.string(),
    venue: LiquidityVenueEnum,
    pair: z.string(),
    lp_wallet_id: z.string(),
});

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    chain: ProjectChainEnum,
    farcaster_identity_wallet_id: z.string(),
    treasury_wallet_id: z.string(),
    contracts: z.array(ProjectContractSchema),
    liquidity: z.array(ProjectLiquiditySchema),
});

export const ProjectRegistrySchema = z.object({
    version: z.string(),
    projects: z.array(ProjectSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectRegistry = z.infer<typeof ProjectRegistrySchema>;

import { z } from 'zod';

export const ContractTypeSchema = z.enum(['erc20', 'core_protocol', 'other']);

export const ProjectContractSchema = z.object({
    id: z.string(),
    type: ContractTypeSchema,
    address: z.string(),
    deployer_wallet_id: z.string(),
    admin_wallet_id: z.string().optional()
});

export const ProjectLiquiditySchema = z.object({
    id: z.string(),
    venue: z.string(),
    pair: z.string(),
    lp_wallet_id: z.string()
});

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    chain: z.string(),
    farcaster_identity_wallet_id: z.string().optional(),
    treasury_wallet_id: z.string().optional(),
    contracts: z.array(ProjectContractSchema),
    liquidity: z.array(ProjectLiquiditySchema)
});

export const ProjectRegistrySchema = z.object({
    version: z.string(),
    projects: z.array(ProjectSchema)
});

// Types inferred from Zod schemas
export type ContractType = z.infer<typeof ContractTypeSchema>;
export type ProjectContract = z.infer<typeof ProjectContractSchema>;
export type ProjectLiquidity = z.infer<typeof ProjectLiquiditySchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectRegistry = z.infer<typeof ProjectRegistrySchema>;

import { z } from 'zod';

export const WalletLaneSchema = z.enum([
  'identity',
  'trading',
  'deployer',
  'treasury',
  'lp',
  'mint',
  'test',
  'other'
]);

export const RiskBandSchema = z.enum([
  'high_sensitivity',
  'medium',
  'low',
  'test'
]);

export const WalletTypeSchema = z.enum(['EOA', 'SAFE', 'SMART_ACCOUNT']);

export const WalletStatusSchema = z.enum(['active', 'archived', 'rotated']);

export const WalletActionSchema = z.enum([
  'social_connect',
  'sign_message',
  'trade',
  'lp_provide',
  'lp_remove',
  'mint_nft',
  'mint_token',
  'deploy_contract',
  'treasury_move',
  'admin_action',
  'unknown_dapp_interaction'
]);

// Note: This list allows strings but we could enforce specific dapps if we had a comprehensive list.
// For now, we allow any string as a dapp identifier.
export const DappSchema = z.string();

export const WalletSchema = z.object({
  id: z.string(),
  address: z.string(), // We could add .regex(/^0x[a-fA-F0-9]{40}$/) but keeping it simple for now
  type: WalletTypeSchema,
  lane: WalletLaneSchema,
  chains: z.array(z.string()),
  ens_name: z.string().optional(),
  farcaster_handle: z.string().optional(),
  browser_profile: z.string().optional(),
  preferred_wallet_extension: z.string().optional(),
  risk_band: RiskBandSchema,
  purpose: z.string(),
  allowed_actions: z.array(WalletActionSchema),
  forbidden_actions: z.array(WalletActionSchema),
  allowed_dapps: z.array(DappSchema),
  forbidden_dapps: z.array(DappSchema),
  linked_projects: z.array(z.string()),
  status: WalletStatusSchema
});

export const WalletRegistrySchema = z.object({
  version: z.string(),
  wallets: z.array(WalletSchema)
});

// Types inferred from Zod schemas
export type WalletLane = z.infer<typeof WalletLaneSchema>;
export type RiskBand = z.infer<typeof RiskBandSchema>;
export type WalletType = z.infer<typeof WalletTypeSchema>;
export type WalletStatus = z.infer<typeof WalletStatusSchema>;
export type WalletAction = z.infer<typeof WalletActionSchema>;
export type Wallet = z.infer<typeof WalletSchema>;
export type WalletRegistry = z.infer<typeof WalletRegistrySchema>;

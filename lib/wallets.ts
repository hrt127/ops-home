export type WalletLayer = "identity" | "vault" | "ops" | "tracking" | "project";

export type WalletRole =
  | "identity"
  | "vault_tokens"
  | "vault_nft"
  | "ops_user"
  | "ops_sandbox"
  | "portfolio_tracker"
  | "project_admin"
  | "project_treasury";

export type Wallet = {
  layer: WalletLayer;
  name: string;
  address: string | null;
  profile: string;
  role: WalletRole;
  notes?: string;
};

export const wallets: Wallet[] = [
  {
    layer: "identity",
    name: "ID_MAIN",
    address: null,
    profile: "Comet – profcgrandma",
    role: "identity",
    notes: "Main identity"
  },
  {
    layer: "vault",
    name: "VAULT_TOKENS",
    address: "0xcaf7a657AE496Bea23AFcAbB89ee744a755de99a",
    profile: "Comet – profcgrandma",
    role: "vault_tokens",
    notes: "Token cold vault"
  },
  {
    layer: "vault",
    name: "VAULT_NFT",
    address: "0x45DA50F7d6d4B0eeEb66D693dC71d62545c563E7",
    profile: "Comet – profcgrandma",
    role: "vault_nft",
    notes: "NFT vault"
  },
  {
    layer: "ops",
    name: "OPS_USER2",
    address: "0xf2773C0213E8001c8c1b9C955aC414D0Fc79a696",
    profile: "Comet – profb769ops",
    role: "ops_user",
    notes: "Main ops wallet"
  },
  {
    layer: "ops",
    name: "OPS_SB1",
    address: "0xba5E19c98b84400B1fA1E845206EFd70D6634689",
    profile: "Comet – profb769ops",
    role: "ops_sandbox",
    notes: "Degen / experiments"
  },
  {
    layer: "tracking",
    name: "TRACKER_ZERION",
    address: "0xa8ef89128f00fd9bd4159e2aa7c2aab567e28bb3",
    profile: "Comet – profcgrandma",
    role: "portfolio_tracker",
    notes: "Zerion tracker"
  }
];

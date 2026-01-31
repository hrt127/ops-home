import fs from 'fs';
import path from 'path';
import { WalletRegistrySchema, Wallet } from './wallets';
import { ProjectRegistrySchema, Project } from './projects';

const DATA_DIR = process.cwd();

export async function loadWallets(): Promise<Wallet[]> {
    const filePath = path.join(DATA_DIR, 'wallets.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const parsed = WalletRegistrySchema.parse(data);
    return parsed.wallets;
}

export async function loadProjects(): Promise<Project[]> {
    const filePath = path.join(DATA_DIR, 'projects.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const parsed = ProjectRegistrySchema.parse(data);
    return parsed.projects;
}

export async function loadWalletWithProjects(walletId: string): Promise<{ wallet: Wallet | undefined, projects: Project[] }> {
    const wallets = await loadWallets();
    const allProjects = await loadProjects();

    const wallet = wallets.find(w => w.id === walletId);

    // Find projects where this wallet plays a role
    // This could be direct linkage (linked_projects) 
    // OR implicit linkage (being listed as deployer/admin/lp/treasury in the project)

    // Method 1: Use explicit linked_projects from wallet
    const explicitProjectIds = wallet?.linked_projects || [];

    // Method 2: Search usage in projects
    const implicitProjects = allProjects.filter(p => {
        if (!wallet) return false;

        const isIdentity = p.farcaster_identity_wallet_id === wallet.id;
        const isTreasury = p.treasury_wallet_id === wallet.id;
        const isDeployer = p.contracts.some(c => c.deployer_wallet_id === wallet.id);
        const isAdmin = p.contracts.some(c => c.admin_wallet_id === wallet.id);
        const isLp = p.liquidity.some(l => l.lp_wallet_id === wallet.id);

        return isIdentity || isTreasury || isDeployer || isAdmin || isLp;
    });

    // Merge and dedupe
    const combinedProjects = Array.from(new Set([
        ...explicitProjectIds.map(id => allProjects.find(p => p.id === id)).filter((p): p is Project => !!p),
        ...implicitProjects
    ]));

    return {
        wallet,
        projects: combinedProjects
    };
}

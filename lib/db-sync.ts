import { PrismaClient } from '@prisma/client';
import type { Wallet, EventRecord, NoteRecord, IdeaRecord, ChangeLog } from './db-types';

const prisma = new PrismaClient();

export async function createWallet(data: Partial<Wallet>) {
  const payload = {
    name: data.name ?? 'wallet',
    address: data.address ?? null,
    metadata: data.metadata ?? null,
  } as any;

  return prisma.wallet.create({ data: payload });
}

export async function listWallets() {
  return prisma.wallet.findMany({ where: { deletedAt: null } });
}

export async function createChangeLog(entry: Partial<ChangeLog> & { entity: string; entityId: string; op: 'CREATE' | 'UPDATE' | 'DELETE'; payload: any; version: number }) {
  return prisma.changeLog.create({ data: entry as any });
}

export async function close() {
  await prisma.$disconnect();
}

export { prisma };

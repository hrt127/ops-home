import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ExportData {
  version: number;
  exportedAt: string;
  data: {
    wallets: any[];
    events: any[];
    notes: any[];
    ideas: any[];
    changeLog: any[];
  };
}

async function importFromJSON(filePath: string, dryRun: boolean = true): Promise<void> {
  try {
    console.log(`📖 Reading export file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const exportData: ExportData = JSON.parse(fileContent);

    console.log(`\n📊 Export summary:`);
    console.log(`  Wallets: ${exportData.data.wallets.length}`);
    console.log(`  Events: ${exportData.data.events.length}`);
    console.log(`  Notes: ${exportData.data.notes.length}`);
    console.log(`  Ideas: ${exportData.data.ideas.length}`);
    console.log(`  Changes: ${exportData.data.changeLog.length}`);

    if (dryRun) {
      console.log('\n🔍 DRY RUN MODE - No changes will be written.');
      console.log('   Run with --no-dry-run to actually import.\n');
      return;
    }

    console.log('\n⚙️  Importing records...');

    // Import wallets
    for (const wallet of exportData.data.wallets) {
      await prisma.wallet.upsert({
        where: { id: wallet.id },
        update: { ...wallet, updatedAt: new Date() },
        create: { ...wallet, createdAt: new Date(wallet.createdAt) },
      });
    }
    console.log(`  ✓ Imported ${exportData.data.wallets.length} wallets`);

    // Import events
    for (const event of exportData.data.events) {
      await prisma.event.upsert({
        where: { id: event.id },
        update: { ...event, updatedAt: new Date() },
        create: { ...event, createdAt: new Date(event.createdAt) },
      });
    }
    console.log(`  ✓ Imported ${exportData.data.events.length} events`);

    // Import notes
    for (const note of exportData.data.notes) {
      await prisma.note.upsert({
        where: { id: note.id },
        update: { ...note, updatedAt: new Date() },
        create: { ...note, createdAt: new Date(note.createdAt) },
      });
    }
    console.log(`  ✓ Imported ${exportData.data.notes.length} notes`);

    // Import ideas
    for (const idea of exportData.data.ideas) {
      await prisma.idea.upsert({
        where: { id: idea.id },
        update: { ...idea, updatedAt: new Date() },
        create: { ...idea, createdAt: new Date(idea.createdAt) },
      });
    }
    console.log(`  ✓ Imported ${exportData.data.ideas.length} ideas`);

    // Import change log (append-only, preserve original timestamps)
    for (const change of exportData.data.changeLog) {
      await prisma.changeLog.create({
        data: {
          ...change,
          createdAt: new Date(change.createdAt),
        },
      });
    }
    console.log(`  ✓ Imported ${exportData.data.changeLog.length} change log entries`);

    console.log('\n✅ Import completed successfully!');
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// CLI entry point
const args = process.argv.slice(2);
const filePath = args[0] || './ops-home-export.json';
const dryRun = !args.includes('--no-dry-run');

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

importFromJSON(filePath, dryRun);

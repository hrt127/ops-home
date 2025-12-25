export type UUID = string;

export interface BaseRecord {
  id: UUID;
  version: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  deletedAt?: string | null;
  metadata?: any;
}

export interface Wallet extends BaseRecord {
  name: string;
  address?: string | null;
}

export interface EventRecord extends BaseRecord {
  title: string;
  when_ts: string; // ISO
  importance?: number;
}

export interface NoteRecord extends BaseRecord {
  title: string;
  body: string;
}

export interface IdeaRecord extends BaseRecord {
  title: string;
  body: string;
  status?: string;
}

export type ChangeOp = "CREATE" | "UPDATE" | "DELETE";

export interface ChangeLog {
  id: UUID;
  op: ChangeOp;
  entity: string;
  entityId: UUID;
  payload: any;
  version: number;
  actorId?: string | null;
  createdAt: string;
}

import Dexie, { type Table } from "dexie";

export interface LocalDocument {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

class SyncSpaceDB extends Dexie {
  documents!: Table<LocalDocument, string>;

  constructor() {
    super("SyncSpaceDB");

    this.version(1).stores({
      documents: "id, updatedAt"
    });
  }
}

const db = new SyncSpaceDB();

export async function getLocalDocument(id: string): Promise<LocalDocument | null> {
  const document = await db.documents.get(id);

  return document ?? null;
}

export async function putLocalDocument(document: LocalDocument): Promise<void> {
  await db.documents.put(document);
}

import { openDB } from 'idb';

const DATABASE_NAME = 'JobTrackerDB';
const STORE_NAME = 'jobs';
const VERSION = 1;

export async function initDB() {
  return openDB(DATABASE_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('status', 'status');
        store.createIndex('company', 'company');
      }
    },
  });
}

export async function getJobs() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function addJob(job) {
  const db = await initDB();
  const id = await db.add(STORE_NAME, {
    ...job,
    dateApplied: job.dateApplied || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  });
  return id;
}

export async function updateJob(job) {
  const db = await initDB();
  return db.put(STORE_NAME, job);
}

export async function deleteJob(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

export async function clearAllJobs() {
  const db = await initDB();
  return db.clear(STORE_NAME);
}

export async function importJobs(jobs) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const job of jobs) {
    // Delete id to let store auto-increment if needed, or keep if importing from export
    await tx.store.put(job);
  }
  await tx.done;
}

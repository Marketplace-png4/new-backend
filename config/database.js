export async function connectDatabase() {
  console.log('Mock connectDatabase: no real database required in FAKE_DB_MODE');
  return Promise.resolve();
}

export async function closeDatabase() {
  console.log('Mock closeDatabase');
  return Promise.resolve();
}

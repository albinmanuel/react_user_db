import { openDB } from 'idb';

export const initDB = async () => {
  return openDB('UserDatabase', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        const store = db.createObjectStore('users', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('email', 'email', { unique: true });
      }
    },
  });
};

export const addUser = async (user) => {
  const db = await initDB();
  return db.add('users', user);
};

export const getUserByEmail = async (email) => {
  const db = await initDB();
  const index = db.transaction('users').store.index('email');
  return index.get(email);
};

export const getAllUsers = async () => {
  const db = await initDB();
  return db.getAll('users');
};

export const updateUser = async (user) => {
  const db = await initDB();
  return db.put('users', user);
};

export const deleteUser = async (id) => {
  const db = await initDB();
  return db.delete('users', id);
};

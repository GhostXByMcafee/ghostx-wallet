const memoryStorage: Record<string, string> = {};

export default {
  setItem: async (key: string, value: string): Promise<void> => {
    console.log('[EncryptedStorage mock] setItem', key);
    memoryStorage[key] = value;
    return Promise.resolve();
  },
  
  getItem: async (key: string): Promise<string | null> => {
    console.log('[EncryptedStorage mock] getItem', key);
    return Promise.resolve(memoryStorage[key] || null);
  },
  
  removeItem: async (key: string): Promise<void> => {
    console.log('[EncryptedStorage mock] removeItem', key);
    delete memoryStorage[key];
    return Promise.resolve();
  },
  
  clear: async (): Promise<void> => {
    console.log('[EncryptedStorage mock] clear');
    Object.keys(memoryStorage).forEach(key => {
      delete memoryStorage[key];
    });
    return Promise.resolve();
  }
}; 
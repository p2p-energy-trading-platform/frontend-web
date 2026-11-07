import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

const storage = new Map<string, string>();

const localStorageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, String(value));
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
  clear: () => {
    storage.clear();
  },
};

vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
  storage.clear();
});

afterEach(() => {
  cleanup();
});

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    value: vi.fn()
  });
});

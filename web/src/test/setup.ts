import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// jsdom não implementa scrollTo; o Layout rola para o topo a cada troca de rota.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

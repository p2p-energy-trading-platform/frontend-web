// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { readChartColors } from './theme';

describe('readChartColors', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('reads chart colours from the design tokens', () => {
    const root = document.documentElement.style;
    root.setProperty('--action-accent', '#0ea592');
    root.setProperty('--text-tertiary', '#6b7a99');
    root.setProperty('--chart-4', '#3b82f6');
    root.setProperty('--chart-3', '#f59e0b');
    root.setProperty('--chart-5', '#8b5cf6');
    root.setProperty('--border-subtle', '#eeeeee');

    expect(readChartColors()).toEqual({
      generated: '#0ea592',
      consumed: '#6b7a99',
      exported: '#3b82f6',
      imported: '#f59e0b',
      grid: '#eeeeee',
      text: '#6b7a99',
      palette: ['#0ea592', '#3b82f6', '#f59e0b', '#8b5cf6', '#6b7a99'],
    });
  });
});

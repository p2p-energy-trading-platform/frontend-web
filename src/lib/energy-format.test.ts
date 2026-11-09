import { describe, expect, it } from 'vitest';

import {
  formatKw,
  formatKwh,
  formatPercent,
  formatRelativeTime,
} from './energy-format';

describe('energy formatting', () => {
  it('formats power with one decimal and an optional sign', () => {
    expect(formatKw(3.84)).toBe('3.8');
    expect(formatKw(0)).toBe('0.0');
    expect(formatKw(-1.25)).toBe('-1.3');
    expect(formatKw(1.2, 'always')).toBe('+1.2');
    expect(formatKw(0, 'always')).toBe('0.0');
  });

  it('formats energy with one decimal and thousands separators', () => {
    expect(formatKwh(28.44)).toBe('28.4');
    expect(formatKwh(1234.5)).toBe('1,234.5');
  });

  it('formats percentages with one decimal', () => {
    expect(formatPercent(81.66)).toBe('81.7');
    expect(formatPercent(100)).toBe('100.0');
  });

  it('describes how long ago a reading was taken', () => {
    const now = new Date('2026-11-01T10:00:00Z');
    expect(formatRelativeTime('2026-11-01T09:59:40Z', now)).toBe('Just now');
    expect(formatRelativeTime('2026-11-01T09:58:00Z', now)).toBe('2 min ago');
    expect(formatRelativeTime('2026-11-01T07:00:00Z', now)).toBe('3 h ago');
    expect(formatRelativeTime('2026-10-29T10:00:00Z', now)).toBe('3 d ago');
  });
});

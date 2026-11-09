import { describe, expect, it } from 'vitest';

import {
  canShiftForward,
  customRangeSchema,
  lastWeeksRange,
  previousRange,
  rangeFor,
  shiftAnchor,
  todayRange,
} from './time-range';

const DUBAI = 'Asia/Dubai';
// 2026-11-01 13:00 in Dubai
const anchor = new Date('2026-11-01T09:00:00Z');

describe('rangeFor', () => {
  it('covers the local day in 30-minute buckets', () => {
    expect(rangeFor('Day', anchor, DUBAI)).toMatchObject({
      from: '2026-10-31T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
      bucket: '30m',
      label: 'Sunday, 1 Nov 2026',
    });
  });

  it('covers the 7 days ending today in hourly buckets', () => {
    expect(rangeFor('Week', anchor, DUBAI)).toMatchObject({
      from: '2026-10-25T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
      bucket: '1h',
      label: '26 Oct – 1 Nov 2026',
    });
  });

  it('covers the 30 days ending today in daily buckets', () => {
    expect(rangeFor('Month', anchor, DUBAI)).toMatchObject({
      from: '2026-10-02T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
      bucket: '1d',
    });
  });

  it('includes both custom dates and picks the bucket from the length', () => {
    expect(
      rangeFor('Custom', anchor, DUBAI, {
        start: '2026-10-20',
        end: '2026-10-22',
      }),
    ).toMatchObject({
      from: '2026-10-19T20:00:00.000Z',
      to: '2026-10-22T20:00:00.000Z',
      bucket: '1h',
    });
    expect(
      rangeFor('Custom', anchor, DUBAI, {
        start: '2026-10-01',
        end: '2026-10-20',
      }),
    ).toMatchObject({ bucket: '1d' });
  });

  it('follows local midnight across a daylight-saving change', () => {
    const londonClockChange = new Date('2026-10-25T12:00:00Z');
    expect(rangeFor('Day', londonClockChange, 'Europe/London')).toMatchObject({
      from: '2026-10-24T23:00:00.000Z',
      to: '2026-10-26T00:00:00.000Z',
    });
  });
});

describe('period navigation', () => {
  it('moves the anchor by one period', () => {
    expect(shiftAnchor('Day', anchor, -1).toISOString()).toBe(
      '2026-10-31T09:00:00.000Z',
    );
    expect(shiftAnchor('Week', anchor, -1).toISOString()).toBe(
      '2026-10-25T09:00:00.000Z',
    );
    expect(shiftAnchor('Month', anchor, 1).toISOString()).toBe(
      '2026-12-01T09:00:00.000Z',
    );
  });

  it('does not move forward past today', () => {
    const now = new Date('2026-11-01T12:00:00Z');
    expect(canShiftForward('Day', anchor, now, DUBAI)).toBe(false);
    expect(
      canShiftForward('Day', shiftAnchor('Day', anchor, -1), now, DUBAI),
    ).toBe(true);
    expect(canShiftForward('Custom', anchor, now, DUBAI)).toBe(false);
  });

  it('gives the same-length range right before', () => {
    expect(
      previousRange({
        from: '2026-10-31T20:00:00.000Z',
        to: '2026-11-01T20:00:00.000Z',
      }),
    ).toEqual({
      from: '2026-10-30T20:00:00.000Z',
      to: '2026-10-31T20:00:00.000Z',
    });
  });

  it('builds today and the last weeks', () => {
    expect(todayRange(anchor, DUBAI)).toEqual({
      from: '2026-10-31T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
    });
    expect(lastWeeksRange(4, anchor, DUBAI)).toEqual({
      from: '2026-10-04T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
      bucket: '1h',
      timeZone: DUBAI,
    });
  });
});

describe('customRangeSchema', () => {
  const today = new Date('2026-11-01T09:00:00Z');
  const parse = (start: string, end: string) =>
    customRangeSchema(today, DUBAI).safeParse({ start, end }).success;

  it('accepts a range of up to 31 days ending today or earlier', () => {
    expect(parse('2026-10-02', '2026-11-01')).toBe(true);
    expect(parse('2026-10-20', '2026-10-20')).toBe(true);
  });

  it('rejects reversed, too long, future or malformed ranges', () => {
    expect(parse('2026-10-22', '2026-10-20')).toBe(false);
    expect(parse('2026-09-30', '2026-11-01')).toBe(false);
    expect(parse('2026-10-30', '2026-11-02')).toBe(false);
    expect(parse('20/10/2026', '2026-10-22')).toBe(false);
  });
});

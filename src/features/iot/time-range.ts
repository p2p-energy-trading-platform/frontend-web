import { z } from 'zod';

import type { EnergyBucketSize, EnergyRange, EnergySeriesRange } from './api';

export type EnergyPeriod = 'Day' | 'Week' | 'Month' | 'Custom';

export interface CustomDates {
  /** YYYY-MM-DD, inclusive */
  start: string;
  /** YYYY-MM-DD, inclusive */
  end: string;
}

export interface ResolvedRange extends EnergyRange {
  bucket: EnergyBucketSize;
  label: string;
}

const DAY_MS = 86_400_000;
/** Longest range the IoT service serves. */
export const MAX_RANGE_DAYS = 31;

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

function zonedParts(instant: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(instant);
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  };
}

function offsetMs(instant: number, timeZone: string) {
  const p = zonedParts(instant, timeZone);
  return (
    Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) -
    Math.floor(instant / 1000) * 1000
  );
}

function localDate(instant: Date, timeZone: string): CalendarDate {
  const { year, month, day } = zonedParts(instant.getTime(), timeZone);
  return { year, month, day };
}

function addDays(date: CalendarDate, days: number): CalendarDate {
  const shifted = new Date(
    Date.UTC(date.year, date.month - 1, date.day + days),
  );
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function parseDate(value: string): CalendarDate {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
}

function dayNumber(date: CalendarDate) {
  return Date.UTC(date.year, date.month - 1, date.day) / DAY_MS;
}

/** The instant local midnight starts on the given calendar date. */
function midnight(date: CalendarDate, timeZone: string): Date {
  const guess = Date.UTC(date.year, date.month - 1, date.day);
  let instant = guess - offsetMs(guess, timeZone);
  const corrected = guess - offsetMs(instant, timeZone);
  if (corrected !== instant) instant = corrected;
  return new Date(instant);
}

function span(
  first: CalendarDate,
  last: CalendarDate,
  timeZone: string,
): EnergyRange {
  return {
    from: midnight(first, timeZone).toISOString(),
    to: midnight(addDays(last, 1), timeZone).toISOString(),
  };
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function dayLabel(date: CalendarDate) {
  const weekday =
    WEEKDAYS[
      new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()
    ];
  return `${weekday}, ${date.day} ${MONTHS[date.month - 1]} ${date.year}`;
}

function spanLabel(first: CalendarDate, last: CalendarDate) {
  const firstYear = first.year === last.year ? '' : ` ${first.year}`;
  return `${first.day} ${MONTHS[first.month - 1]}${firstYear} – ${last.day} ${MONTHS[last.month - 1]} ${last.year}`;
}

/** Turns the period picker into the range and bucket size the IoT API expects. */
export function rangeFor(
  period: EnergyPeriod,
  anchor: Date,
  timeZone: string,
  custom?: CustomDates,
): ResolvedRange {
  const today = localDate(anchor, timeZone);

  if (period === 'Custom' && custom) {
    const first = parseDate(custom.start);
    const last = parseDate(custom.end);
    const days = dayNumber(last) - dayNumber(first) + 1;
    return {
      ...span(first, last, timeZone),
      bucket: days <= 7 ? '1h' : '1d',
      label: spanLabel(first, last),
    };
  }

  if (period === 'Week' || period === 'Month') {
    const first = addDays(today, period === 'Week' ? -6 : -29);
    return {
      ...span(first, today, timeZone),
      bucket: period === 'Week' ? '1h' : '1d',
      label: spanLabel(first, today),
    };
  }

  return {
    ...span(today, today, timeZone),
    bucket: '30m',
    label: dayLabel(today),
  };
}

export function shiftAnchor(
  period: EnergyPeriod,
  anchor: Date,
  direction: 1 | -1,
): Date {
  const next = new Date(anchor);
  if (period === 'Month') {
    next.setUTCMonth(next.getUTCMonth() + direction);
  } else {
    next.setTime(
      next.getTime() + direction * (period === 'Week' ? 7 : 1) * DAY_MS,
    );
  }
  return next;
}

export function canShiftForward(
  period: EnergyPeriod,
  anchor: Date,
  now: Date,
  timeZone: string,
) {
  if (period === 'Custom') return false;
  return (
    dayNumber(localDate(anchor, timeZone)) < dayNumber(localDate(now, timeZone))
  );
}

/** The same-length range immediately before, for "vs previous" trends. */
export function previousRange(range: EnergyRange): EnergyRange {
  const from = new Date(range.from).getTime();
  const length = new Date(range.to).getTime() - from;
  return {
    from: new Date(from - length).toISOString(),
    to: new Date(from).toISOString(),
  };
}

export function todayRange(now: Date, timeZone: string): EnergyRange {
  const today = localDate(now, timeZone);
  return span(today, today, timeZone);
}

/** Hourly buckets over the last `weeks` weeks, ending today. */
export function lastWeeksRange(
  weeks: number,
  now: Date,
  timeZone: string,
): EnergySeriesRange {
  const today = localDate(now, timeZone);
  return {
    ...span(addDays(today, -(weeks * 7 - 1)), today, timeZone),
    bucket: '1h',
    timeZone,
  };
}

export function customRangeSchema(now: Date, timeZone: string) {
  const today = dayNumber(localDate(now, timeZone));
  return z
    .object({ start: z.iso.date(), end: z.iso.date() })
    .refine(({ start, end }) => start <= end, {
      message: 'The end date must be on or after the start date',
      path: ['end'],
    })
    .refine(
      ({ start, end }) =>
        dayNumber(parseDate(end)) - dayNumber(parseDate(start)) <
        MAX_RANGE_DAYS,
      {
        message: `Choose a range of ${MAX_RANGE_DAYS} days or fewer`,
        path: ['end'],
      },
    )
    .refine(({ end }) => dayNumber(parseDate(end)) <= today, {
      message: 'The range cannot end in the future',
      path: ['end'],
    });
}

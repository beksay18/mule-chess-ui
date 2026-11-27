import type { Tournament, AudienceTag, TimeControl } from './types';

import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export const AUDIENCE_FILTERS: { id: AudienceTag; label: string }[] = [
  { id: 'scholastic', label: 'Scholastic' },
  { id: 'adults', label: 'Adults' },
  { id: 'senior', label: 'Senior' },
  { id: 'team', label: 'Team' },
  { id: 'fide', label: 'FIDE rated' },
];

export const TIME_CONTROLS: { id: TimeControl | ''; label: string }[] = [
  { id: '', label: 'Any time control' },
  { id: 'regular', label: 'Regular (classical)' },
  { id: 'quick', label: 'Quick / rapid' },
  { id: 'blitz', label: 'Blitz' },
];

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN',
  'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ',
  'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA',
  'WI', 'WV', 'WY',
];

const TIME_LABEL: Record<TimeControl, string> = {
  regular: 'Regular (classical)',
  quick: 'Quick / rapid',
  blitz: 'Blitz',
};

export function timeControlLabel(value: TimeControl) {
  return TIME_LABEL[value];
}

export function audienceLabel(value: AudienceTag) {
  return AUDIENCE_FILTERS.find((item) => item.id === value)?.label ?? value;
}

export function todayISO() {
  return dayjs().format('YYYY-MM-DD');
}

export function money(amount: number) {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function feeRange(tournament: Tournament) {
  const fees = (tournament.sections ?? []).map((section) => section.fee);
  if (!fees.length) return '';
  const min = Math.min(...fees);
  const max = Math.max(...fees);
  return min === max ? money(min) : `${money(min)}–${money(max)}`;
}

export function locationLabel(tournament: Tournament) {
  return [tournament.city, tournament.state].filter(Boolean).join(', ');
}

export function formatRange(tournament: Tournament) {
  const start = dayjs(tournament.startDate);
  const end = dayjs(tournament.endDate);
  if (start.isSame(end, 'day')) return start.format('dddd, MMMM D, YYYY');
  return `${start.format('ddd, MMM D')} – ${end.format('ddd, MMM D, YYYY')}`;
}

export function formatShortRange(tournament: Tournament) {
  const start = dayjs(tournament.startDate);
  const end = dayjs(tournament.endDate);
  if (start.isSame(end, 'day')) return start.format('ddd, MMM D');
  return `${start.format('ddd, MMM D')} – ${end.format('ddd, MMM D')}`;
}

export function registrationNote(tournament: Tournament) {
  const days = dayjs(tournament.registrationCloses).startOf('day').diff(dayjs().startOf('day'), 'day');
  if (days < 0) return 'Registration closed';
  if (days === 0) return 'Registration closes today';
  if (days === 1) return 'Registration closes tomorrow';
  return '';
}

export function isRegistrationOpen(tournament: Tournament) {
  return tournament.registrationCloses >= todayISO();
}

export function isHappening(tournament: Tournament) {
  const today = todayISO();
  return tournament.startDate <= today && tournament.endDate >= today;
}

export function isPast(tournament: Tournament) {
  return tournament.endDate < todayISO();
}

function weekendRange() {
  const today = dayjs().startOf('day');
  const dow = today.day();
  if (dow === 0) return { start: today.subtract(1, 'day'), end: today };
  if (dow === 6) return { start: today, end: today.add(1, 'day') };
  const saturday = today.add(6 - dow, 'day');
  return { start: saturday, end: saturday.add(1, 'day') };
}

function overlaps(tournament: Tournament, start: dayjs.Dayjs, end: dayjs.Dayjs) {
  const eventStart = dayjs(tournament.startDate);
  const eventEnd = dayjs(tournament.endDate);
  return !eventEnd.isBefore(start, 'day') && !eventStart.isAfter(end, 'day');
}

export function matchesWhen(tournament: Tournament, when: string) {
  if (!when || when === 'any') return true;
  const start = dayjs(tournament.startDate);
  const end = dayjs(tournament.endDate);
  const today = dayjs().startOf('day');

  if (when === 'weekend') {
    const range = weekendRange();
    return overlaps(tournament, range.start, range.end);
  }
  if (when === '7' || when === '30') {
    return overlaps(tournament, today, today.add(Number(when), 'day'));
  }
  return start.format('YYYY-MM') === when || end.format('YYYY-MM') === when;
}

export function monthKey(iso: string) {
  return dayjs(iso).format('YYYY-MM');
}

export function monthLabel(key: string) {
  return dayjs(`${key}-01`).format('MMMM YYYY');
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

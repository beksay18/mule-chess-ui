import type { Tournament, TimeControl, TournamentStatus, TournamentSection } from './types';

import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export const TOURNAMENT_STATUSES: { id: TournamentStatus; label: string }[] = [
  { id: 'NEW', label: 'New' },
  { id: 'PUBLISHED', label: 'Published' },
  { id: 'IN_PROGRESS', label: 'In progress' },
  { id: 'COMPLETED', label: 'Completed' },
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

export function isSwissFormat(format?: string) {
  return Boolean(format?.startsWith('swiss'));
}

export function todayISO() {
  return dayjs().format('YYYY-MM-DD');
}

export function money(amount: number) {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export const ENTRY_FEES = [
  { key: 'early', label: 'Early Entry', fee: 'earlyFee', deadline: 'earlyDeadline', time: 'earlyDeadlineTime', enabled: 'earlyEnabled' },
  { key: 'regular', label: 'Regular Entry', fee: 'regularFee', deadline: 'regularDeadline', time: 'regularDeadlineTime', enabled: 'regularEnabled' },
  { key: 'late', label: 'Late Entry', fee: 'lateFee', deadline: 'lateDeadline', time: 'lateDeadlineTime', enabled: 'lateEnabled' },
  { key: 'onsite', label: 'Onsite Entry', fee: 'onsiteFee', deadline: 'onsiteDeadline', time: 'onsiteDeadlineTime', enabled: 'onsiteEnabled' },
] as const;

export const ENTRY_FEE_FORM = [
  ENTRY_FEES[1],
  ENTRY_FEES[0],
  ENTRY_FEES[2],
  ENTRY_FEES[3],
];

function dateOnly(value?: string) {
  if (!value) return '';
  return value.slice(0, 10);
}

function clockOnly(value?: string) {
  if (!value) return '';
  return value.slice(0, 5);
}

function deadlineMoment(date?: string, time?: string) {
  if (!date) return null;
  if (!time) return dayjs(date).endOf('day');
  const parsed = dayjs(`${date}T${time}`);
  return parsed.isValid() ? parsed : dayjs(date).endOf('day');
}

function keepFee(value: number | null | undefined, fallback: number | null) {
  return value === undefined ? fallback : value;
}

export function withEntryFees(section: TournamentSection): TournamentSection {
  const base = keepFee(section.fee, null);
  const regularFee = keepFee(section.regularFee, base);
  const earlyDeadline = dateOnly(section.earlyDeadline);
  const regularDeadline = dateOnly(section.regularDeadline);
  const lateDeadline = dateOnly(section.lateDeadline);
  const onsiteDeadline = dateOnly(section.onsiteDeadline);
  const otherDeadlines = Boolean(earlyDeadline || lateDeadline || onsiteDeadline);
  return {
    ...section,
    rounds: section.rounds || 0,
    earlyFee: keepFee(section.earlyFee, base),
    earlyDeadline,
    earlyDeadlineTime: clockOnly(section.earlyDeadlineTime),
    regularFee,
    regularDeadline,
    regularDeadlineTime: clockOnly(section.regularDeadlineTime),
    lateFee: keepFee(section.lateFee, base),
    lateDeadline,
    lateDeadlineTime: clockOnly(section.lateDeadlineTime),
    onsiteFee: keepFee(section.onsiteFee, base),
    onsiteDeadline,
    onsiteDeadlineTime: clockOnly(section.onsiteDeadlineTime),
    earlyEnabled: section.earlyEnabled ?? Boolean(earlyDeadline),
    regularEnabled: section.regularEnabled ?? (Boolean(regularDeadline) || !otherDeadlines),
    lateEnabled: section.lateEnabled ?? Boolean(lateDeadline),
    onsiteEnabled: section.onsiteEnabled ?? Boolean(onsiteDeadline),
    fee: regularFee,
  };
}

export function activeFee(section: TournamentSection, now = dayjs()) {
  const priced = withEntryFees(section);
  const open = ENTRY_FEES.filter((item) => priced[item.enabled]);
  for (const item of open) {
    const moment = deadlineMoment(priced[item.deadline], priced[item.time]);
    const amount = priced[item.fee];
    if (amount !== null && (!moment || !moment.isBefore(now))) return amount;
  }
  const last = open[open.length - 1];
  return (last ? priced[last.fee] : priced.fee) ?? 0;
}

export function entryPayload(section: TournamentSection): TournamentSection {
  const priced = withEntryFees(section);
  const next = { ...priced };
  ENTRY_FEES.forEach((item) => {
    if (priced[item.enabled]) {
      next[item.fee] = priced[item.fee] ?? 0;
      return;
    }
    next[item.fee] = 0;
    next[item.deadline] = null as unknown as string;
    next[item.time] = null as unknown as string;
  });
  const primary = ENTRY_FEE_FORM.find((item) => priced[item.enabled]);
  next.fee = primary ? (next[primary.fee] ?? 0) : 0;
  return next;
}

export function entryDeadlineLabel(value?: string, time?: string) {
  if (!value) return '';
  const parsed = time ? dayjs(`${value}T${time}`) : dayjs(value);
  if (!parsed.isValid()) return value;
  return time ? parsed.format('MMM D, YYYY h:mm A') : parsed.format('MMM D, YYYY');
}

export function feeRange(tournament: Tournament) {
  const fees = (tournament.sections ?? []).flatMap((section) => {
    const priced = withEntryFees(section);
    return ENTRY_FEES.filter((item) => priced[item.enabled]).flatMap((item) => {
      const amount = priced[item.fee];
      return amount === null ? [] : [amount];
    });
  });
  if (!fees.length) return '';
  const min = Math.min(...fees);
  const max = Math.max(...fees);
  return min === max ? money(min) : `${money(min)}–${money(max)}`;
}

export function locationLabel(tournament: Tournament) {
  const place = [tournament.city, tournament.state].filter(Boolean).join(', ');
  return [tournament.street, place].filter(Boolean).join(', ');
}

function clockLabel(value?: string) {
  if (!value) return '';
  const parsed = dayjs(`2000-01-01T${value}`);
  return parsed.isValid() ? parsed.format('h:mm A') : '';
}

export function formatRange(tournament: Tournament) {
  const start = dayjs(tournament.startDate);
  const end = dayjs(tournament.endDate);
  const range = start.isSame(end, 'day')
    ? start.format('dddd, MMMM D, YYYY')
    : `${start.format('ddd, MMM D')} – ${end.format('ddd, MMM D, YYYY')}`;
  const time = clockLabel(tournament.startTime);
  return time ? `${range} at ${time}` : range;
}

export function formatShortRange(tournament: Tournament) {
  const start = dayjs(tournament.startDate);
  const end = dayjs(tournament.endDate);
  const range = start.isSame(end, 'day') ? start.format('ddd, MMM D') : `${start.format('ddd, MMM D')} – ${end.format('ddd, MMM D')}`;
  const time = clockLabel(tournament.startTime);
  return time ? `${range} · ${time}` : range;
}

export function registrationNote(tournament: Tournament) {
  const days = dayjs(tournament.registrationCloses).startOf('day').diff(dayjs().startOf('day'), 'day');
  const at = clockLabel(tournament.registrationClosesTime);
  const suffix = at ? ` at ${at}` : '';
  if (days < 0) return 'Registration closed';
  if (days === 0) return `Registration closes today${suffix}`;
  if (days === 1) return `Registration closes tomorrow${suffix}`;
  return at ? `Registration closes ${dayjs(tournament.registrationCloses).format('MMM D')}${suffix}` : '';
}

export function statusLabel(status: TournamentStatus) {
  return TOURNAMENT_STATUSES.find((item) => item.id === status)?.label ?? status;
}

export function tournamentStatus(tournament: Pick<Tournament, 'status' | 'startDate' | 'endDate'>): TournamentStatus {
  if (tournament.status === 'NEW') return 'NEW';
  const today = todayISO();
  if (tournament.endDate && tournament.endDate < today) return 'COMPLETED';
  if (tournament.status === 'COMPLETED') return 'COMPLETED';
  if (tournament.startDate && tournament.endDate && tournament.startDate <= today && tournament.endDate >= today) {
    return 'IN_PROGRESS';
  }
  if (tournament.status === 'IN_PROGRESS') return 'IN_PROGRESS';
  return 'PUBLISHED';
}

export function isPublic(tournament: Tournament) {
  const status = tournamentStatus(tournament);
  return status === 'PUBLISHED' || status === 'IN_PROGRESS';
}

export function isRegistrationOpen(tournament: Tournament) {
  if (!isPublic(tournament)) return false;
  if (!tournament.registrationCloses) return false;
  if (!tournament.registrationClosesTime) return tournament.registrationCloses >= todayISO();
  return !dayjs(`${tournament.registrationCloses}T${tournament.registrationClosesTime}`).isBefore(dayjs());
}

export function isHappening(tournament: Tournament) {
  return tournamentStatus(tournament) === 'IN_PROGRESS';
}

export function isPast(tournament: Tournament) {
  return tournamentStatus(tournament) === 'COMPLETED';
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

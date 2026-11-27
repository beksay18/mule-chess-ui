import type { Tournament, AudienceTag, TimeControl, TournamentSection } from './types';

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

export const ENTRY_FEES = [
  { key: 'early', label: 'Early Entry', fee: 'earlyFee', deadline: 'earlyDeadline', enabled: 'earlyEnabled' },
  { key: 'regular', label: 'Regular Entry', fee: 'regularFee', deadline: 'regularDeadline', enabled: 'regularEnabled' },
  { key: 'late', label: 'Late Entry', fee: 'lateFee', deadline: 'lateDeadline', enabled: 'lateEnabled' },
  { key: 'onsite', label: 'Onsite Entry', fee: 'onsiteFee', deadline: 'onsiteDeadline', enabled: 'onsiteEnabled' },
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

export function withEntryFees(section: TournamentSection): TournamentSection {
  const base = Number(section.fee) || 0;
  const regularFee = section.regularFee ?? base;
  const earlyDeadline = dateOnly(section.earlyDeadline);
  const regularDeadline = dateOnly(section.regularDeadline);
  const lateDeadline = dateOnly(section.lateDeadline);
  const onsiteDeadline = dateOnly(section.onsiteDeadline);
  const otherDeadlines = Boolean(earlyDeadline || lateDeadline || onsiteDeadline);
  return {
    ...section,
    earlyFee: section.earlyFee ?? base,
    earlyDeadline,
    regularFee,
    regularDeadline,
    lateFee: section.lateFee ?? base,
    lateDeadline,
    onsiteFee: section.onsiteFee ?? base,
    onsiteDeadline,
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
    const deadline = priced[item.deadline];
    if (!deadline || !dayjs(deadline).endOf('day').isBefore(now)) return priced[item.fee];
  }
  const last = open[open.length - 1];
  return last ? priced[last.fee] : priced.fee;
}

export function entryPayload(section: TournamentSection): TournamentSection {
  const priced = withEntryFees(section);
  const next = { ...priced };
  ENTRY_FEES.forEach((item) => {
    if (priced[item.enabled]) return;
    next[item.fee] = 0;
    next[item.deadline] = null as unknown as string;
  });
  const primary = ENTRY_FEE_FORM.find((item) => priced[item.enabled]);
  next.fee = primary ? next[primary.fee] : 0;
  return next;
}

export function entryDeadlineLabel(value?: string) {
  if (!value) return '';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('MMM D, YYYY') : value;
}

export function feeRange(tournament: Tournament) {
  const fees = (tournament.sections ?? []).flatMap((section) => {
    const priced = withEntryFees(section);
    return ENTRY_FEES.filter((item) => priced[item.enabled]).map((item) => priced[item.fee]);
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

export function isRegistrationOpen(tournament: Tournament) {
  if (!tournament.registrationCloses) return false;
  if (!tournament.registrationClosesTime) return tournament.registrationCloses >= todayISO();
  return !dayjs(`${tournament.registrationCloses}T${tournament.registrationClosesTime}`).isBefore(dayjs());
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

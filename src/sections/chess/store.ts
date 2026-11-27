import type {
  CartItem,
  ChessState,
  Tournament,
  Registration,
  ContactMessage,
  TournamentDraft,
} from './types';

import { useSyncExternalStore } from 'react';

import { listTournaments } from 'src/api/tournament/tournament.api';

import { isEmail, todayISO } from './format';
import { sampleState } from './seed';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'mule-chess.registration.v1';

let state: ChessState = readStorage() ?? sampleState();
const listeners = new Set<() => void>();

function readStorage(): ChessState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ChessState>;
    if (!Array.isArray(parsed.tournaments)) return null;
    return {
      tournaments: parsed.tournaments,
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      results: Array.isArray(parsed.results) ? parsed.results : sampleState().results,
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    };
  } catch {
    return null;
  }
}

function persist(next: ChessState) {
  state = next;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return state;
}

export function useChessState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function takenSeats(current: ChessState, tournamentId: string, sectionId: string) {
  const registered = current.registrations.filter(
    (item) => item.tournamentId === tournamentId && item.sectionId === sectionId
  ).length;
  const held = current.cart.filter(
    (item) => item.tournamentId === tournamentId && item.sectionId === sectionId
  ).length;
  return registered + held;
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || 'tournament';
}

function cleanDraft(input: TournamentDraft): TournamentDraft {
  return {
    ...input,
    name: input.name.trim(),
    organizer: input.organizer.trim(),
    city: input.city.trim(),
    state: input.state.trim().toUpperCase(),
    description: input.description.trim(),
    prizeSummary: input.prizeSummary.trim(),
    sections: input.sections.map((section) => ({
      ...section,
      name: section.name.trim(),
      fee: Number(section.fee) || 0,
      capacity: Math.max(1, Number(section.capacity) || 1),
    })),
  };
}

export function addToCart(input: Omit<CartItem, 'id'>): string | null {
  const tournament = state.tournaments.find((item) => item.id === input.tournamentId);
  if (!tournament) return 'That tournament is no longer listed.';
  if (tournament.registrationCloses < todayISO()) return 'Registration is closed.';
  const section = tournament.sections.find((item) => item.id === input.sectionId);
  if (!section) return 'Choose a section.';
  if (!input.firstName.trim() || !input.lastName.trim()) return "Enter the player's first and last name.";
  if (!isEmail(input.email)) return 'Enter a valid email address.';
  if (takenSeats(state, tournament.id, section.id) >= section.capacity) {
    return 'That section is full.';
  }
  const email = input.email.trim().toLowerCase();
  const already =
    state.registrations.some(
      (item) => item.tournamentId === tournament.id && item.email.toLowerCase() === email
    ) ||
    state.cart.some((item) => item.tournamentId === tournament.id && item.email.toLowerCase() === email);
  if (already) return 'This email is already entered for the tournament.';

  const item: CartItem = {
    ...input,
    id: crypto.randomUUID(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    rating: input.rating.trim(),
    federationId: input.federationId.trim(),
    sectionName: section.name,
    fee: section.fee,
  };
  persist({ ...state, cart: [...state.cart, item] });
  return null;
}

export function removeFromCart(id: string) {
  persist({ ...state, cart: state.cart.filter((item) => item.id !== id) });
}

export function confirmCart() {
  const confirmed: Registration[] = [];
  for (const item of state.cart) {
    const tournament = state.tournaments.find((entry) => entry.id === item.tournamentId);
    const section = tournament?.sections.find((entry) => entry.id === item.sectionId);
    if (!tournament || !section) continue;
    confirmed.push({ ...item, sectionName: section.name, fee: section.fee, createdAt: new Date().toISOString() });
  }
  persist({
    ...state,
    registrations: [...state.registrations, ...confirmed],
    cart: [],
  });
  return confirmed.length;
}

export function createTournament(input: TournamentDraft) {
  const draft = cleanDraft(input);
  let slug = slugify(draft.name);
  const taken = new Set(state.tournaments.map((item) => item.slug));
  if (taken.has(slug)) slug = `${slug}-${state.tournaments.length + 1}`;
  const tournament: Tournament = { ...draft, id: crypto.randomUUID(), slug };
  persist({ ...state, tournaments: [...state.tournaments, tournament] });
  return tournament;
}

export function updateTournament(id: string, input: TournamentDraft) {
  const draft = cleanDraft(input);
  const current = state.tournaments.find((item) => item.id === id);
  if (!current) return null;
  const tournament: Tournament = { ...current, ...draft, id: current.id, slug: current.slug };
  persist({
    ...state,
    tournaments: state.tournaments.map((item) => (item.id === id ? tournament : item)),
  });
  return tournament;
}

export function deleteTournament(id: string) {
  persist({
    ...state,
    tournaments: state.tournaments.filter((item) => item.id !== id),
    registrations: state.registrations.filter((item) => item.tournamentId !== id),
    cart: state.cart.filter((item) => item.tournamentId !== id),
    results: state.results.filter((item) => item.tournamentId !== id),
  });
}

export function removeRegistration(id: string) {
  persist({ ...state, registrations: state.registrations.filter((item) => item.id !== id) });
}

export function sendMessage(input: Omit<ContactMessage, 'id' | 'createdAt'>) {
  const message: ContactMessage = {
    ...input,
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  persist({ ...state, messages: [message, ...state.messages] });
}

export async function refreshTournamentsFromApi() {
  const tournaments = await listTournaments();
  persist({ ...state, tournaments });
  return tournaments;
}

if (typeof window !== 'undefined') {
  refreshTournamentsFromApi().catch(() => undefined);
}

export function restoreSampleEvents() {
  const sample = sampleState();
  persist({
    ...state,
    tournaments: sample.tournaments,
    registrations: sample.registrations,
    results: sample.results,
    cart: [],
  });
}

export type AudienceTag = 'scholastic' | 'adults' | 'senior' | 'team' | 'fide';

export type TimeControl = 'regular' | 'quick' | 'blitz';

export type TournamentFormat =
  | 'swiss'
  | 'swiss-team-tiebreak'
  | 'swiss-team'
  | 'round-robin'
  | 'round-robin-team'
  | 'knockout'
  | 'knockout-team';

export type TournamentSection = {
  id: string;
  name: string;
  fee: number;
  capacity: number;
};

export type Tournament = {
  id: string;
  slug: string;
  name: string;
  organizer: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  registrationCloses: string;
  description: string;
  timeControl: TimeControl;
  format: TournamentFormat;
  audiences: AudienceTag[];
  sections: TournamentSection[];
  prizeSummary: string;
};

export type TournamentDraft = Omit<Tournament, 'id' | 'slug'>;

export type CartItem = {
  id: string;
  tournamentId: string;
  sectionId: string;
  sectionName: string;
  fee: number;
  firstName: string;
  lastName: string;
  email: string;
  rating: string;
  federationId: string;
};

export type Registration = CartItem & {
  createdAt: string;
};

export type Standing = {
  place: number;
  player: string;
  score: string;
};

export type Pairing = {
  round: number;
  board: number;
  white: string;
  black: string;
  result: string;
};

export type TournamentResult = {
  tournamentId: string;
  standings: Standing[];
  pairings: Pairing[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type ChessState = {
  tournaments: Tournament[];
  registrations: Registration[];
  cart: CartItem[];
  results: TournamentResult[];
  messages: ContactMessage[];
};

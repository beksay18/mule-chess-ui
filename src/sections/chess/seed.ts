import type {
  ChessState,
  Tournament,
  Registration,
  TournamentResult,
} from './types';

// ----------------------------------------------------------------------

const holidayOpen = 'sec-holiday-open';
const holidayU1600 = 'sec-holiday-u1600';
const holidayPremier = 'sec-holiday-premier';
const octoberOpen = 'sec-october-open';

function entry(
  id: string,
  tournamentId: string,
  sectionId: string,
  sectionName: string,
  fee: number,
  firstName: string,
  lastName: string,
  rating: string,
  createdAt: string
): Registration {
  return {
    id,
    tournamentId,
    sectionId,
    sectionName,
    fee,
    firstName,
    lastName,
    email: `${firstName}.${lastName}@example.com`.toLowerCase(),
    rating,
    federationId: '',
    createdAt,
  };
}

const tournaments: Tournament[] = [
  {
    id: 't-holiday',
    slug: 'holiday-swiss',
    name: 'Mule Chess Holiday Swiss',
    organizer: 'Mule Chess Club',
    city: 'Kansas City',
    state: 'MO',
    startDate: '2026-11-14',
    endDate: '2026-12-13',
    registrationCloses: '2026-12-06',
    timeControl: 'regular',
    audiences: ['adults', 'fide'],
    prizeSummary: '$600 prize fund based on 40 paid entries, split by section.',
    description:
      'Five-round Swiss played on Saturday mornings at the club. Pairings go up the evening before each round. Bring a clock if you have one; boards and sets are provided.\n\nHalf-point byes are available in rounds 1–4 when requested before Friday at noon. The premier section is limited to eight players and is filled in rating order.',
    sections: [
      { id: holidayPremier, name: 'Premier', fee: 50, capacity: 2 },
      { id: holidayOpen, name: 'Open', fee: 45, capacity: 32 },
      { id: holidayU1600, name: 'Under 1600', fee: 35, capacity: 24 },
    ],
  },
  {
    id: 't-plaza',
    slug: 'plaza-friday-quick',
    name: 'Plaza Friday Night Quick',
    organizer: 'Mule Chess Club',
    city: 'Kansas City',
    state: 'MO',
    startDate: '2026-11-27',
    endDate: '2026-11-27',
    registrationCloses: '2026-11-27',
    timeControl: 'quick',
    audiences: ['adults'],
    prizeSummary: 'Trophies for first and top under 1600.',
    description:
      'One-night quick tournament. Game in 15 minutes with a 5-second delay. Round 1 starts at 6:30 p.m. Late entries are paired if they arrive before round 1 starts.\n\nRated and unrated players are welcome in the same section.',
    sections: [{ id: 'sec-plaza-open', name: 'Open', fee: 20, capacity: 36 }],
  },
  {
    id: 't-thanksgiving',
    slug: 'thanksgiving-weekend-rapid',
    name: 'Thanksgiving Weekend Rapid',
    organizer: 'Prairie Scholastic Chess',
    city: 'Lawrence',
    state: 'KS',
    startDate: '2026-11-28',
    endDate: '2026-11-29',
    registrationCloses: '2026-11-28',
    timeControl: 'blitz',
    audiences: ['adults'],
    prizeSummary: '$300 guaranteed, plus a class prize.',
    description:
      'Six-round rapid over two afternoons. Time control is game in 10 minutes with a 5-second delay. Players who need a bye should request it when they register.\n\nThe playing hall opens 30 minutes before round 1 each day.',
    sections: [{ id: 'sec-thanks-open', name: 'Open', fee: 25, capacity: 40 }],
  },
  {
    id: 't-dec-blitz',
    slug: 'december-club-blitz',
    name: 'December Club Blitz',
    organizer: 'Mule Chess Club',
    city: 'Kansas City',
    state: 'MO',
    startDate: '2026-12-12',
    endDate: '2026-12-12',
    registrationCloses: '2026-12-12',
    timeControl: 'blitz',
    audiences: ['adults'],
    prizeSummary: 'Club gift cards for the top two scores.',
    description:
      'Double round-robin blitz if the field is 8 or fewer, otherwise a seven-round Swiss. Game in 3 minutes with a 2-second increment.\n\nRegistration stays open until the first round is paired.',
    sections: [{ id: 'sec-blitz-open', name: 'Open', fee: 10, capacity: 24 }],
  },
  {
    id: 't-scholastic',
    slug: 'winter-scholastic',
    name: 'Winter Scholastic Championship',
    organizer: 'Prairie Scholastic Chess',
    city: 'Overland Park',
    state: 'KS',
    startDate: '2027-01-16',
    endDate: '2027-01-16',
    registrationCloses: '2027-01-14',
    timeControl: 'quick',
    audiences: ['scholastic'],
    prizeSummary: 'Trophies for the top three in each grade band.',
    description:
      'A one-day scholastic championship. Players compete only against others in their grade band. Five rounds, game in 25 minutes with a 5-second delay.\n\nA parent or coach may register a player. The player’s name on the entry is the name that appears on the wall chart.',
    sections: [
      { id: 'sec-k3', name: 'K–3', fee: 20, capacity: 40 },
      { id: 'sec-k6', name: 'K–6', fee: 25, capacity: 48 },
      { id: 'sec-k12', name: 'K–12', fee: 30, capacity: 48 },
    ],
  },
  {
    id: 't-senior',
    slug: 'senior-sunday',
    name: 'Senior Sunday Swiss',
    organizer: 'Mule Chess Club',
    city: 'Columbia',
    state: 'MO',
    startDate: '2027-02-07',
    endDate: '2027-02-07',
    registrationCloses: '2027-02-06',
    timeControl: 'regular',
    audiences: ['senior'],
    prizeSummary: 'Trophy and free entry to the next Senior Sunday.',
    description:
      'Four-round Swiss for players age 50 and over. Game in 60 minutes with a 10-second increment. Unrated players are welcome.\n\nCoffee is on the club. Please email the organizer if you need a ground-floor board.',
    sections: [{ id: 'sec-senior-open', name: 'Open', fee: 25, capacity: 28 }],
  },
  {
    id: 't-team',
    slug: 'river-city-team',
    name: 'River City Team Match',
    organizer: 'Mule Chess Club',
    city: 'St. Louis',
    state: 'MO',
    startDate: '2027-02-21',
    endDate: '2027-02-21',
    registrationCloses: '2027-02-18',
    timeControl: 'regular',
    audiences: ['team', 'adults'],
    prizeSummary: 'Traveling trophy for the winning team.',
    description:
      'Four-board team match. Enter the team name as the player’s last name and the captain as the first name, or register each board as its own player in the notes you send the organizer.\n\nBoards are ordered by rating. The entry fee covers the whole team.',
    sections: [{ id: 'sec-team', name: 'Team entry', fee: 100, capacity: 16 }],
  },
  {
    id: 't-spring',
    slug: 'spring-open',
    name: 'Mule Chess Spring Open',
    organizer: 'Mule Chess Club',
    city: 'Kansas City',
    state: 'MO',
    startDate: '2027-03-13',
    endDate: '2027-03-14',
    registrationCloses: '2027-03-12',
    timeControl: 'regular',
    audiences: ['adults', 'fide'],
    prizeSummary: '$1,200 based on 60 entries. First in the Open is $300.',
    description:
      'Two-day open with three sections. Five rounds, game in 90 minutes with a 30-second increment. One half-point bye is allowed if requested before round 1.\n\nFIDE rated in the Open. US Chess rated in every section. Sets are provided; please bring a clock.',
    sections: [
      { id: 'sec-spring-open', name: 'Open', fee: 55, capacity: 40 },
      { id: 'sec-spring-u1800', name: 'Under 1800', fee: 45, capacity: 40 },
      { id: 'sec-spring-u1400', name: 'Under 1400', fee: 35, capacity: 32 },
    ],
  },
  {
    id: 't-october',
    slug: 'october-rapid',
    name: 'October Rapid Championship',
    organizer: 'Mule Chess Club',
    city: 'Kansas City',
    state: 'MO',
    startDate: '2026-10-17',
    endDate: '2026-10-17',
    registrationCloses: '2026-10-16',
    timeControl: 'quick',
    audiences: ['adults'],
    prizeSummary: 'Paid out on site. Nora Hale won the title.',
    description:
      'A one-day rapid championship. Three rounds, game in 15 minutes with a 10-second increment. Final standings and pairings are posted under Results.',
    sections: [{ id: octoberOpen, name: 'Open', fee: 20, capacity: 24 }],
  },
  {
    id: 't-summer',
    slug: 'summer-open',
    name: 'Summer Open',
    organizer: 'Prairie Scholastic Chess',
    city: 'Lawrence',
    state: 'KS',
    startDate: '2026-08-08',
    endDate: '2026-08-09',
    registrationCloses: '2026-08-07',
    timeControl: 'regular',
    audiences: ['adults', 'fide'],
    prizeSummary: 'Prizes were paid at the event.',
    description:
      'A two-day open held in August. Pairings from this event were posted on the club wall and are not reprinted here.',
    sections: [{ id: 'sec-summer-open', name: 'Open', fee: 40, capacity: 32 }],
  },
];

const registrations: Registration[] = [
  entry('reg-1', 't-holiday', holidayPremier, 'Premier', 50, 'Priya', 'Shah', '2104', '2026-11-16T15:00:00.000Z'),
  entry('reg-2', 't-holiday', holidayPremier, 'Premier', 50, 'Owen', 'Blake', '2040', '2026-11-16T18:10:00.000Z'),
  entry('reg-3', 't-holiday', holidayOpen, 'Open', 45, 'Ada', 'Okonkwo', '1980', '2026-11-18T14:00:00.000Z'),
  entry('reg-4', 't-holiday', holidayOpen, 'Open', 45, 'Luis', 'Herrera', '1844', '2026-11-19T20:12:00.000Z'),
  entry('reg-5', 't-holiday', holidayOpen, 'Open', 45, 'Maya', 'Chen', '1710', '2026-11-21T13:40:00.000Z'),
  entry('reg-6', 't-holiday', holidayU1600, 'Under 1600', 35, 'Jonah', 'Briggs', '1512', '2026-11-22T16:05:00.000Z'),
  entry('reg-7', 't-october', octoberOpen, 'Open', 20, 'Nora', 'Hale', '2012', '2026-10-02T15:00:00.000Z'),
  entry('reg-8', 't-october', octoberOpen, 'Open', 20, 'Chris', 'Dalton', '1888', '2026-10-03T15:00:00.000Z'),
  entry('reg-9', 't-october', octoberOpen, 'Open', 20, 'Malik', 'Grant', '1830', '2026-10-04T15:00:00.000Z'),
  entry('reg-10', 't-october', octoberOpen, 'Open', 20, 'Elena', 'Voss', '1764', '2026-10-05T15:00:00.000Z'),
  entry('reg-11', 't-october', octoberOpen, 'Open', 20, 'June', 'Park', '1620', '2026-10-06T15:00:00.000Z'),
  entry('reg-12', 't-october', octoberOpen, 'Open', 20, 'Theo', 'Marin', '1495', '2026-10-07T15:00:00.000Z'),
];

const results: TournamentResult[] = [
  {
    tournamentId: 't-october',
    standings: [
      { place: 1, player: 'Nora Hale', score: '2.5' },
      { place: 2, player: 'Chris Dalton', score: '2' },
      { place: 3, player: 'Malik Grant', score: '2' },
      { place: 4, player: 'Elena Voss', score: '1.5' },
      { place: 5, player: 'June Park', score: '1' },
      { place: 6, player: 'Theo Marin', score: '0' },
    ],
    pairings: [
      { round: 1, board: 1, white: 'Nora Hale', black: 'Theo Marin', result: '1–0' },
      { round: 1, board: 2, white: 'Malik Grant', black: 'June Park', result: '1–0' },
      { round: 1, board: 3, white: 'Elena Voss', black: 'Chris Dalton', result: '½–½' },
      { round: 2, board: 1, white: 'Nora Hale', black: 'Malik Grant', result: '½–½' },
      { round: 2, board: 2, white: 'Chris Dalton', black: 'June Park', result: '1–0' },
      { round: 2, board: 3, white: 'Elena Voss', black: 'Theo Marin', result: '1–0' },
      { round: 3, board: 1, white: 'Nora Hale', black: 'Elena Voss', result: '1–0' },
      { round: 3, board: 2, white: 'Malik Grant', black: 'Chris Dalton', result: '½–½' },
      { round: 3, board: 3, white: 'June Park', black: 'Theo Marin', result: '1–0' },
    ],
  },
];

export function sampleState(): ChessState {
  return {
    tournaments,
    registrations,
    cart: [],
    results,
    messages: [],
  };
}

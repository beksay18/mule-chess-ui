import type { Tournament, TournamentDraft } from 'src/sections/chess/types';

import { axios } from '../http';
import { ENDPOINTS } from '../constant';

export type TournamentTypeOption = {
    code: string;
    label: string;
};

export const listTournamentTypes = (): Promise<TournamentTypeOption[]> =>
    axios.get<TournamentTypeOption[]>(ENDPOINTS.TOURNAMENT.TYPES).then(({ data }) => data);

export const listTournaments = (): Promise<Tournament[]> =>
    axios.get<Tournament[]>(ENDPOINTS.TOURNAMENT.LIST).then(({ data }) => data);

export const createTournamentRequest = (payload: TournamentDraft): Promise<Tournament> =>
    axios.post<Tournament>(ENDPOINTS.TOURNAMENT.CREATE, payload).then(({ data }) => data);

export const updateTournamentRequest = (id: string, payload: TournamentDraft): Promise<Tournament> =>
    axios.put<Tournament>(ENDPOINTS.TOURNAMENT.UPDATE(id), payload).then(({ data }) => data);

export const publishTournamentRequest = (id: string): Promise<Tournament> =>
    axios.post<Tournament>(ENDPOINTS.TOURNAMENT.PUBLISH(id)).then(({ data }) => data);

export const deleteTournamentRequest = (id: string): Promise<void> =>
    axios.delete(ENDPOINTS.TOURNAMENT.DELETE(id)).then(() => undefined);

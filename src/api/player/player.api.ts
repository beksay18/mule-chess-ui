import { axios } from '../http';
import { ENDPOINTS } from '../constant';

export type UsChessPlayer = {
    id: string;
    firstName: string;
    lastName: string;
    rating: string;
    state: string;
};

export const searchUsChessPlayers = (query: string): Promise<UsChessPlayer[]> => {
    // The dev server proxies US Chess. A production build calls the API.
    if (import.meta.env.DEV) {
        const url = `/mule-chess/api/players?q=${encodeURIComponent(query)}`;
        return fetch(url).then(async (response) => {
            if (!response.ok) {
                throw new Error('US Chess search is unavailable.');
            }
            return response.json();
        });
    }
    return axios.get<UsChessPlayer[]>(ENDPOINTS.PLAYER.SEARCH, { params: { q: query } }).then(({ data }) => data);
};

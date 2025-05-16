import {CurrentUser} from "./auth";

export const SessionStorage = {
    getJSONValue: (key: string): Record<string, unknown> =>
        JSON.parse(`${window.sessionStorage.getItem(key)}`),

    setJSONValue: (key: string, value: Record<string, unknown>): void =>
        window.sessionStorage.setItem(key, JSON.stringify(value)),

    removeItem: (key: string): void => window.sessionStorage.removeItem(key),

    clear: (): void => window.sessionStorage.clear()
};

export const getCurrentUser = (): CurrentUser | null => {
    const raw = SessionStorage.getJSONValue("current-user");
    return raw ? (raw as unknown as CurrentUser) : null;
};

export const logout = () => {
    SessionStorage.removeItem("access-token");
    SessionStorage.removeItem("current-user");
};
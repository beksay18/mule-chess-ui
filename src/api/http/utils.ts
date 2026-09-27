import jwtDecode from "jwt-decode";
import { isNil } from "lodash";
import {SessionStorage} from "../session-storage";

export const fetchAndValidateAccessToken = (): string | null => {
    const tokens = SessionStorage.getJSONValue("access-token");
    if (tokens && tokens["access-token"]) {
        const accessToken: string = tokens["access-token"] as string;
        if (!isTokenExpired(accessToken)) {
            return accessToken;
        }
    }
    return null;
};

export const isTokenExpired = (token?: string): boolean => {
    if (isNil(token)) {
        return true;
    }
    const decoded: { exp?: number } = jwtDecode(token);
    if (!decoded.exp) {
        return false;
    }
    return new Date() > new Date(decoded.exp * 1000 - 60000);
};
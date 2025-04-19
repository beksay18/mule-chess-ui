import { Navigate, useLocation } from 'react-router-dom';
import {SessionStorage} from "../api";

type Props = {
    children: React.ReactNode;
};

const isAuthenticated = (): boolean => {
    const token = SessionStorage.getJSONValue('access-token');
    return Boolean(token?.['access-token']);
};

export default function AuthGuard({ children }: Props) {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}

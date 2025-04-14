import { Navigate, useLocation } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

const isAuthenticated = (): boolean => Boolean(localStorage.getItem('accessToken'));


export default function AuthGuard({ children }: Props) {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}

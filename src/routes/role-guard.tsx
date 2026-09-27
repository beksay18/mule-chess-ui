import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import {CurrentUser} from "../api/auth";
import {getCurrentUser} from "../api";

type Props = {
    children: ReactNode;
    allowedRoles: string[];
};

export default function RoleGuard({ children, allowedRoles }: Props) {
    const user: CurrentUser | null = getCurrentUser();

    if (!user) {
        return <Navigate to="/sign-in" />;
    }

    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
        return <Navigate to={user.role === 'ROLE_MANAGER' ? '/user' : '/404'} />;
    }

    return <>{children}</>;
}

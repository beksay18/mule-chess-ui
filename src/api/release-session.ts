const RELEASE_KEY = 'app-release';

export function applyReleaseSession() {
    const current = import.meta.env.VITE_APP_RELEASE || 'dev';
    const saved = window.sessionStorage.getItem(RELEASE_KEY);
    if (saved === current) {
        return;
    }
    window.sessionStorage.removeItem('access-token');
    window.sessionStorage.removeItem('current-user');
    window.sessionStorage.setItem(RELEASE_KEY, current);
}

import { useEffect, useRef } from 'react';
import { getGoogleClientId, loginWithGoogle } from 'src/api/auth';
import { SessionStorage } from 'src/api';
import { useRouter } from 'src/routes/hooks';

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: Record<string, unknown>) => void;
                    renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
                };
            };
        };
    }
}

function waitForGoogleIdentity(): Promise<NonNullable<Window['google']>['accounts']['id']> {
    if (window.google?.accounts?.id) {
        return Promise.resolve(window.google.accounts.id);
    }

    return new Promise((resolve, reject) => {
        const started = Date.now();
        const timer = window.setInterval(() => {
            if (window.google?.accounts?.id) {
                window.clearInterval(timer);
                resolve(window.google.accounts.id);
                return;
            }
            if (Date.now() - started > 10000) {
                window.clearInterval(timer);
                reject(new Error('Google Sign-In failed to load. Please refresh and try again.'));
            }
        }, 80);
    });
}

type SocialLoginButtonProps = {
    onError?: (message: string) => void;
};

export function SocialLoginButton({ onError }: SocialLoginButtonProps) {
    const router = useRouter();
    const callbackRef = useRef<(response: { credential?: string }) => void>(() => undefined);

    callbackRef.current = async (response) => {
        if (!response?.credential) {
            onError?.('Google did not return a sign-in credential. Please try again.');
            return;
        }

        try {
            const res = await loginWithGoogle({ idToken: response.credential });

            SessionStorage.setJSONValue('access-token', { 'access-token': res.accessToken });
            SessionStorage.setJSONValue('current-user', {
                userId: res.id,
                username: res.username,
                role: res.role,
                person: res.person,
            });

            router.push(
                res.role === 'ROLE_ADMIN' || res.role === 'ROLE_MANAGER' ? '/dashboard' : '/'
            );
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'response' in error
                    ? (error as { response?: { data?: { message?: string } } }).response?.data
                          ?.message
                    : undefined;
            onError?.(message || 'Google sign-in failed. Please try again.');
        }
    };

    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        const button = buttonRef.current;
        if (!button) return undefined;

        Promise.all([getGoogleClientId(), waitForGoogleIdentity()])
            .then(([clientId, googleId]) => {
                if (cancelled) return;
                if (!clientId) {
                    throw new Error('Google Sign-In is not configured.');
                }
                const width = Math.min(400, Math.max(200, Math.floor(button.offsetWidth)));
                googleId.initialize({
                    client_id: clientId,
                    callback: (response: { credential?: string }) => callbackRef.current(response),
                    ux_mode: 'popup',
                    auto_select: false,
                });
                button.replaceChildren();
                googleId.renderButton(button, {
                    theme: 'outline',
                    size: 'large',
                    width,
                    text: 'signin_with',
                    shape: 'rectangular',
                });
            })
            .catch((error: Error) => {
                if (!cancelled) onError?.(error.message);
            });

        return () => {
            cancelled = true;
        };
    }, [onError]);

    return <div ref={buttonRef} style={{ width: '100%', minHeight: 44 }} />;
}

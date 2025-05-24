import { useEffect } from 'react';
import { loginWithGoogle } from 'src/api/auth';
import { SessionStorage } from 'src/api';
import { useRouter } from 'src/routes/hooks';

export {};

declare global {
    interface Window {
        google: any;
    }
}

export function SocialLoginButton() {
    const router = useRouter();

    const handleCredentialResponse = async (response: any) => {
        console.log("Google credential response:", response);

        if (!response?.credential) {
            console.error("Missing Google credential");
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

            router.push(res.role === 'ROLE_ADMIN' ? '/dashboard' : '/');
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    // Initialize Google Sign-In on mount
    useEffect(() => {
        if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
                client_id: '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',
                callback: handleCredentialResponse,
            });

            window.google.accounts.id.renderButton(
                document.getElementById('google-login-button'),
                { theme: 'outline', size: 'large', width: 300 }
            );
        }
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div id="google-login-button" />
        </div>
    );
}

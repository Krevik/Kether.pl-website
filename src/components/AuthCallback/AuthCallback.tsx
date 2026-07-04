import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { appStore } from '../../redux/store';
import { userDataActions } from '../../redux/slices/userDataSlice';
import { authService } from '../../services/authService';
import { pagePaths } from '../../utils/pagePaths';
import { notificationManager } from '../../utils/notificationManager';
import { hydrateSessionFromToken } from '../../utils/sessionFromToken';
import { getAccessToken } from '../../utils/authToken';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function applyParsedSession(parsed: NonNullable<ReturnType<typeof hydrateSessionFromToken>>): void {
    appStore.dispatch(userDataActions.setUserID(parsed.steamid));
    appStore.dispatch(userDataActions.setIsAdmin(parsed.isAdmin));
}

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const exchangeStartedRef = useRef(false);

    useEffect(() => {
        const code = searchParams.get('code')?.trim();

        if (!code) {
            notificationManager.ERROR('Login failed: missing authorization code.');
            navigate(`/${pagePaths.HOME_PAGE}`, { replace: true });
            return;
        }

        const existingToken = getAccessToken();
        const existingSession = existingToken ? hydrateSessionFromToken(existingToken) : null;
        if (existingSession) {
            applyParsedSession(existingSession);
            window.history.replaceState({}, '', `/${pagePaths.HOME_PAGE}`);
            navigate(`/${pagePaths.HOME_PAGE}`, { replace: true });
            return;
        }

        if (exchangeStartedRef.current) {
            return;
        }
        exchangeStartedRef.current = true;

        let cancelled = false;

        const completeLogin = async () => {
            const session = await authService.exchangeCode(code);

            if (cancelled && !getAccessToken()) {
                return;
            }

            if (!session) {
                if (!cancelled) {
                    notificationManager.ERROR('Login failed. Please try again.');
                    navigate(`/${pagePaths.HOME_PAGE}`, { replace: true });
                }
                return;
            }

            const parsed = hydrateSessionFromToken(session.access_token);
            if (!parsed) {
                if (!cancelled) {
                    notificationManager.ERROR('Login failed. Please try again.');
                    navigate(`/${pagePaths.HOME_PAGE}`, { replace: true });
                }
                return;
            }

            applyParsedSession(parsed);
            window.history.replaceState({}, '', `/${pagePaths.HOME_PAGE}`);
            navigate(`/${pagePaths.HOME_PAGE}`, { replace: true });
        };

        completeLogin();

        return () => {
            cancelled = true;
        };
    }, [navigate, searchParams]);

    return (
        <LoadingSpinner
            message="Completing login..."
            type="progressive"
            minDelay={50}
        />
    );
}

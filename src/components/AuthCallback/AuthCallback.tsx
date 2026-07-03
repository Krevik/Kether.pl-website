import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { appStore } from '../../redux/store';
import { userDataActions } from '../../redux/slices/userDataSlice';
import { authService } from '../../services/authService';
import { pagePaths } from '../../utils/pagePaths';
import { notificationManager } from '../../utils/notificationManager';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');

        if (!code) {
            notificationManager.ERROR('Login failed: missing authorization code.');
            navigate(`/${pagePaths.HOME_PAGE}`, { replace: true });
            return;
        }

        const completeLogin = async () => {
            const session = await authService.exchangeCode(code);

            if (!session) {
                notificationManager.ERROR('Login failed. Please try again.');
                navigate(`/${pagePaths.HOME_PAGE}`, { replace: true });
                return;
            }

            appStore.dispatch(userDataActions.setUserID(session.steamid));
            appStore.dispatch(userDataActions.setIsAdmin(session.is_admin));

            window.history.replaceState({}, '', `/${pagePaths.HOME_PAGE}`);
            navigate(`/${pagePaths.HOME_PAGE}`, { replace: true });
        };

        completeLogin();
    }, [navigate, searchParams]);

    return (
        <LoadingSpinner
            message="Completing login..."
            type="progressive"
            minDelay={50}
        />
    );
}

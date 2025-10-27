import styles from './Navbar.module.css';
import SteamLoginButton from './steamLoginButton/SteamLoginButton';
import UserDetails from './userDetails/UserDetails';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { pagePaths } from '../../utils/pagePaths';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../redux/store';
import { uiActions } from '../../redux/slices/uiSlice';
import { withNavigationErrorBoundary } from '../ErrorBoundary/SpecificErrorBoundaries';
import { useMemo, useCallback } from 'react';
import { useNavigationTranslations } from '../../hooks/useTranslations';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

interface TabItem {
    label: string;
    targetPage: string;
}

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMenuShown = useSelector((state: AppState) => state.uiReducer.isNavbarVisible);
    const navTranslations = useNavigationTranslations();

    const tabs: TabItem[] = useMemo(() => [
        {
            label: navTranslations.home,
            targetPage: pagePaths.HOME_PAGE,
        },
        {
            label: navTranslations.hallOfFame,
            targetPage: pagePaths.HALL_OF_FAME,
        },
        {
            label: navTranslations.hallOfFameSuggestions,
            targetPage: pagePaths.HALL_OF_FAME_SUGGESTIONS,
        },
        {
            label: navTranslations.githubRepo,
            targetPage: pagePaths.GITHUB,
        },
        {
            label: navTranslations.donate,
            targetPage: pagePaths.DONATE,
        },
    ], [navTranslations]);

    const getNavigationButtons = useCallback(() => {
        return tabs.map((tab) => {
            return (
                <button
                    className={styles.navigationButton}
                    key={tab.label.toString()}
                    onClick={() => {
                        navigate(`../${tab.targetPage}`);
                    }}
                >
                    {tab.label}
                </button>
            );
        });
    }, [tabs, navigate]);

    const hideMenuButton = useCallback(() => {
        return (
            <Button
                className={styles.openHideMenuButton}
                label={isMenuShown ? '«' : '»'}
                onClick={() => dispatch(uiActions.toggleNavbarVisibility())}
            />
        );
    }, [isMenuShown, dispatch]);

    const navigationInternalContent = useCallback(() => {
        return (
            <>
                <SteamLoginButton />
                <UserDetails />
                {getNavigationButtons()}
                <LanguageSwitcher />
            </>
        );
    }, [getNavigationButtons]);

    const containerClassName = useMemo(() => 
        `${styles.navigationMenu} ${isMenuShown ? styles.menuVisible : styles.menuHidden}`,
        [isMenuShown]
    );

    return (
        <div className={styles.navigationMenuContainer}>
            <div className={containerClassName}>
                {navigationInternalContent()}
            </div>
            {hideMenuButton()}
        </div>
    );
}

export default withNavigationErrorBoundary(Navbar);

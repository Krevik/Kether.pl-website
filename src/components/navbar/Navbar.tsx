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
import React, { useMemo, useCallback } from 'react';
import { preloadOnHover } from '../../utils/preloadUtils';
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
            // Create preload handlers for each tab
            const preloadHandler = preloadOnHover(tab.label, () => {
                switch (tab.targetPage) {
                    case pagePaths.HOME_PAGE:
                        return import('../HomePage/HomePage');
                    case pagePaths.HALL_OF_FAME:
                        return import('../HallOfFame/HallOfFame');
                    case pagePaths.HALL_OF_FAME_SUGGESTIONS:
                        return import('../HallOfFame/HallOfFameSuggestions');
                    case pagePaths.GITHUB:
                        return import('../GithubRepo/GithubRepo');
                    case pagePaths.DONATE:
                        return import('../Donate/Donate');
                    default:
                        return Promise.resolve();
                }
            });

            return (
                <button
                    className={styles.navigationButton}
                    key={tab.label.toString()}
                    onClick={() => {
                        navigate(`../${tab.targetPage}`);
                    }}
                    onMouseEnter={preloadHandler}
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
                icon={
                    isMenuShown
                        ? 'pi-angle-double-up'
                        : 'pi-angle-double-down'
                }
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

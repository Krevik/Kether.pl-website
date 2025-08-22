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
interface TabItem {
    label: string;
    targetPage: string;
}

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMenuShown = useSelector((state: AppState) => state.uiReducer.isNavbarVisible);

    const tabs: TabItem[] = [
        {
            label: 'Home',
            targetPage: pagePaths.HOME_PAGE,
        },
        {
            label: 'Hall of Fame',
            targetPage: pagePaths.HALL_OF_FAME,
        },
        {
            label: 'Hall of Fame Suggestions',
            targetPage: pagePaths.HALL_OF_FAME_SUGGESTIONS,
        },

        {
            label: 'Github Repo',
            targetPage: pagePaths.GITHUB,
        },
        {
            label: 'Donate',
            targetPage: pagePaths.DONATE,
        },
    ];

    const getNavigationButtons = () => {
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
    };

    const hideMenuButton = () => {
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
    };

    const navigationInternalContent = () => {
        return (
            <>
                <SteamLoginButton />
                <UserDetails />
                {getNavigationButtons()}
            </>
        );
    };

    return (
        <div className={styles.navigationMenuContainer}>
            <div className={`${styles.navigationMenu} ${isMenuShown ? styles.menuVisible : styles.menuHidden}`}>
                {navigationInternalContent()}
            </div>
            {hideMenuButton()}
        </div>
    );
}

export default withNavigationErrorBoundary(Navbar);

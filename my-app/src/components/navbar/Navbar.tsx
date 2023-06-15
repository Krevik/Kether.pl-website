import styles from './Navbar.module.css';
import SteamLoginButton from './steamLoginButton/SteamLoginButton';
import UserDetails from './userDetails/UserDetails';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { pagePaths } from '../../utils/pagePaths';
interface TabItem {
    label: string;
    targetPage: string;
}

export type NavbarProps = {
    isMenuShown: boolean;
    setIsMenuShown: (boolean) => void;
};

export default function Navbar(props: NavbarProps) {
    const navigate = useNavigate();

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
            label: 'Game Stats',
            targetPage: pagePaths.GAME_STATS,
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
                    props.isMenuShown
                        ? 'pi-angle-double-up'
                        : 'pi-angle-double-down'
                }
                onClick={() => props.setIsMenuShown(!props.isMenuShown)}
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
            <div className={styles.navigationMenu}>
                {props.isMenuShown && navigationInternalContent()}
            </div>
            {hideMenuButton()}
        </div>
    );
}

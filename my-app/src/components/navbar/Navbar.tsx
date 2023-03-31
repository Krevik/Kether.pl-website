import './Navbar.css';
import SteamLoginButton from './steamLoginButton/SteamLoginButton';
import UserDetails from './userDetails/UserDetails';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { pagePaths } from '../../utils/pagePaths';

interface TabItem {
    label: string;
    targetPage: string;
}

export default function Navbar() {
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
                <Button
                    onClick={() => {
                        navigate(`../${tab.targetPage}`);
                    }}
                >
                    {tab.label}
                </Button>
            );
        });
    };

    return (
        <div className="card">
            <div className="navigation-menu">
                <SteamLoginButton />
                <UserDetails />
                {getNavigationButtons()}
            </div>
        </div>
    );
}

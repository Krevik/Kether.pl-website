import HomePage from '../HomePage/HomePage';
import HallOfFame from '../HallOfFame/HallOfFame';
import GithubRepo from '../GithubRepo/GithubRepo';
import Donate from '../Donate/Donate';
import { steamAPIService } from '../../services/steamAPIService';
import GameStats from '../GameStats/GameStats';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { pagePaths } from '../../utils/pagePaths';
import HallOfFameSuggestions from '../HallOfFame/HallOfFameSuggestions';

export default function KetherApplication() {
    steamAPIService.useAdminDetectionService();
    //steamAPIService.useSteamAuthService();
    steamAPIService.useUserDataFetcher();
    steamAPIService.useOwnedGamesFetcher();

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={<HomePage />} />
                <Route path={pagePaths.HOME_PAGE} element={<HomePage />} />
                <Route path={pagePaths.HALL_OF_FAME} element={<HallOfFame />} />
                <Route
                    path={pagePaths.HALL_OF_FAME_SUGGESTIONS}
                    element={<HallOfFameSuggestions />}
                />
                <Route path={pagePaths.GAME_STATS} element={<GameStats />} />
                <Route path={pagePaths.GITHUB} element={<GithubRepo />} />
                <Route path={pagePaths.DONATE} element={<Donate />} />
            </>
        )
    );

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

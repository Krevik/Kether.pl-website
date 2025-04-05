import HomePage from '../HomePage/HomePage';
import HallOfFame from '../HallOfFame/HallOfFame';
import GithubRepo from '../GithubRepo/GithubRepo';
import Donate from '../Donate/Donate';
import { steamAPIService } from '../../services/steamAPIService';
// import GameStats from '../GameStats/GameStats';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { pagePaths } from '../../utils/pagePaths';
import HallOfFameSuggestions from '../HallOfFame/HallOfFameSuggestions';
import { PageLayout } from '../PageLayout/PageLayout';
import { useEffect, useState } from 'react';

export default function KetherApplication() {
    steamAPIService.useAdminDetectionService();
    steamAPIService.useSteamAuthService();
    steamAPIService.useUserDataFetcher();
    steamAPIService.useOwnedGamesFetcher();

    const [isMenuShown, setIsMenuShown] = useState(true);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route
                    path={pagePaths.HOME_PAGE}
                    element={
                        <PageLayout
                            children={<HomePage/>}
                            isMenuShown={isMenuShown}
                            setIsMenuShown={setIsMenuShown}
                        />
                    }
                />
                <Route
                    path={pagePaths.HALL_OF_FAME}
                    element={
                        <PageLayout
                            children={<HallOfFame/>}
                            isMenuShown={isMenuShown}
                            setIsMenuShown={setIsMenuShown}
                        />
                    }
                />
                <Route
                    path={pagePaths.HALL_OF_FAME_SUGGESTIONS}
                    element={
                        <PageLayout
                            children={<HallOfFameSuggestions/>}
                            isMenuShown={isMenuShown}
                            setIsMenuShown={setIsMenuShown}
                        />
                    }
                />
                {/* <Route
                    path={pagePaths.GAME_STATS}
                    element={
                        <PageLayout
                            children={GameStats()}
                            isMenuShown={isMenuShown}
                            setIsMenuShown={setIsMenuShown}
                        />
                    }
                /> */}
                <Route
                    path={pagePaths.GITHUB}
                    element={
                        <PageLayout
                            children={<GithubRepo/>}
                            isMenuShown={isMenuShown}
                            setIsMenuShown={setIsMenuShown}
                        />
                    }
                />
                <Route
                    path={pagePaths.DONATE}
                    element={
                        <PageLayout
                            children={<Donate/>}
                            isMenuShown={isMenuShown}
                            setIsMenuShown={setIsMenuShown}
                        />
                    }
                />
                <Route
                    path="*"
                    element={
                        <PageLayout
                            children={<HomePage/>}
                            isMenuShown={isMenuShown}
                            setIsMenuShown={setIsMenuShown}
                        />
                    }
                />
            </>
        )
    );

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

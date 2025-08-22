import HomePage from '../HomePage/HomePage';
import HallOfFame from '../HallOfFame/HallOfFame';
import GithubRepo from '../GithubRepo/GithubRepo';
import Donate from '../Donate/Donate';
import { steamAPIService } from '../../services/steamAPIService';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { pagePaths } from '../../utils/pagePaths';
import HallOfFameSuggestions from '../HallOfFame/HallOfFameSuggestions';
import { PageLayout } from '../PageLayout/PageLayout';
export default function KetherApplication() {
    steamAPIService.useAdminDetectionService();
    steamAPIService.useSteamAuthService();
    steamAPIService.useUserDataFetcher();
    steamAPIService.useOwnedGamesFetcher();

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route
                    path={pagePaths.HOME_PAGE}
                    element={
                        <PageLayout>
                            <HomePage/>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.HALL_OF_FAME}
                    element={
                        <PageLayout>
                            <HallOfFame/>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.HALL_OF_FAME_SUGGESTIONS}
                    element={
                        <PageLayout>
                            <HallOfFameSuggestions/>
                        </PageLayout>
                    }
                />

                <Route
                    path={pagePaths.GITHUB}
                    element={
                        <PageLayout>
                            <GithubRepo/>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.DONATE}
                    element={
                        <PageLayout>
                            <Donate/>
                        </PageLayout>
                    }
                />
                <Route
                    path="*"
                    element={
                        <PageLayout>
                            <HomePage/>
                        </PageLayout>
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

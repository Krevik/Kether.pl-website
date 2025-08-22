import { steamAPIService } from '../../services/steamAPIService';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { pagePaths } from '../../utils/pagePaths';
import { PageLayout } from '../PageLayout/PageLayout';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import PerformanceMonitor from '../PerformanceMonitor/PerformanceMonitor';

// Lazy load components for better performance
const HomePage = lazy(() => import('../HomePage/HomePage'));
const HallOfFame = lazy(() => import('../HallOfFame/HallOfFame'));
const GithubRepo = lazy(() => import('../GithubRepo/GithubRepo'));
const Donate = lazy(() => import('../Donate/Donate'));
const HallOfFameSuggestions = lazy(() => import('../HallOfFame/HallOfFameSuggestions'));
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
                            <Suspense fallback={<LoadingSpinner message="Loading Home Page..." />}>
                                <HomePage/>
                            </Suspense>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.HALL_OF_FAME}
                    element={
                        <PageLayout>
                            <Suspense fallback={<LoadingSpinner message="Loading Hall of Fame..." />}>
                                <HallOfFame/>
                            </Suspense>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.HALL_OF_FAME_SUGGESTIONS}
                    element={
                        <PageLayout>
                            <Suspense fallback={<LoadingSpinner message="Loading Suggestions..." />}>
                                <HallOfFameSuggestions/>
                            </Suspense>
                        </PageLayout>
                    }
                />

                <Route
                    path={pagePaths.GITHUB}
                    element={
                        <PageLayout>
                            <Suspense fallback={<LoadingSpinner message="Loading GitHub..." />}>
                                <GithubRepo/>
                            </Suspense>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.DONATE}
                    element={
                        <PageLayout>
                            <Suspense fallback={<LoadingSpinner message="Loading Donate Page..." />}>
                                <Donate/>
                            </Suspense>
                        </PageLayout>
                    }
                />
                <Route
                    path="*"
                    element={
                        <PageLayout>
                            <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                                <HomePage/>
                            </Suspense>
                        </PageLayout>
                    }
                />
            </>
        )
    );

    return (
        <>
            <RouterProvider router={router} />
            {process.env.NODE_ENV === 'development' && (
                <PerformanceMonitor show={true} />
            )}
        </>
    );
}

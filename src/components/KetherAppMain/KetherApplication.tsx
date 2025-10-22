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
import { useNavigationTranslations } from '../../hooks/useTranslations';

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

    const navTranslations = useNavigationTranslations();

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route
                    path={pagePaths.HOME_PAGE}
                    element={
                        <PageLayout>
                            <Suspense fallback={
                                <LoadingSpinner 
                                    message={navTranslations.loading.home} 
                                    type="skeleton"
                                    minDelay={200}
                                />
                            }>
                                <HomePage/>
                            </Suspense>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.HALL_OF_FAME}
                    element={
                        <PageLayout>
                            <Suspense fallback={
                                <LoadingSpinner 
                                    message={navTranslations.loading.hallOfFame} 
                                    type="progressive"
                                    minDelay={150}
                                />
                            }>
                                <HallOfFame/>
                            </Suspense>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.HALL_OF_FAME_SUGGESTIONS}
                    element={
                        <PageLayout>
                            <Suspense fallback={
                                <LoadingSpinner 
                                    message={navTranslations.loading.suggestions} 
                                    type="skeleton"
                                    minDelay={150}
                                />
                            }>
                                <HallOfFameSuggestions/>
                            </Suspense>
                        </PageLayout>
                    }
                />

                <Route
                    path={pagePaths.GITHUB}
                    element={
                        <PageLayout>
                            <Suspense fallback={
                                <LoadingSpinner 
                                    message={navTranslations.loading.github} 
                                    size="small"
                                    minDelay={100}
                                />
                            }>
                                <GithubRepo/>
                            </Suspense>
                        </PageLayout>
                    }
                />
                <Route
                    path={pagePaths.DONATE}
                    element={
                        <PageLayout>
                            <Suspense fallback={
                                <LoadingSpinner 
                                    message={navTranslations.loading.donate} 
                                    type="progressive"
                                    minDelay={200}
                                />
                            }>
                                <Donate/>
                            </Suspense>
                        </PageLayout>
                    }
                />
                <Route
                    path="*"
                    element={
                        <PageLayout>
                            <Suspense fallback={
                                <LoadingSpinner 
                                    message={navTranslations.loading.generic} 
                                    type="skeleton"
                                    minDelay={100}
                                />
                            }>
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

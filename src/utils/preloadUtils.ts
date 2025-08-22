/**
 * Preloading utilities for instant navigation
 */

// Cache for preloaded components
const preloadedComponents = new Map<string, Promise<any>>();

/**
 * Preload a component by its import function
 */
export function preloadComponent(
    name: string,
    importFn: () => Promise<any>
): Promise<any> {
    if (preloadedComponents.has(name)) {
        return preloadedComponents.get(name)!;
    }

    const promise = importFn();
    preloadedComponents.set(name, promise);
    return promise;
}

/**
 * Preload all main components for instant navigation
 */
export function preloadAllComponents() {
    // Preload components in the background
    setTimeout(() => {
        preloadComponent('HomePage', () => import('../components/HomePage/HomePage'));
        preloadComponent('HallOfFame', () => import('../components/HallOfFame/HallOfFame'));
        preloadComponent('GithubRepo', () => import('../components/GithubRepo/GithubRepo'));
        preloadComponent('Donate', () => import('../components/Donate/Donate'));
        preloadComponent('HallOfFameSuggestions', () => import('../components/HallOfFame/HallOfFameSuggestions'));
    }, 1000); // Delay preloading to not interfere with initial load
}

/**
 * Preload specific component based on user interaction
 */
export function preloadOnHover(
    name: string,
    importFn: () => Promise<any>
) {
    return () => {
        preloadComponent(name, importFn);
    };
}

/**
 * Preload component on route prediction
 */
export function preloadOnRoutePrediction(
    currentPath: string,
    predictedPath: string
) {
    const componentMap: Record<string, () => Promise<any>> = {
        '/': () => import('../components/HomePage/HomePage'),
        '/hall-of-fame': () => import('../components/HallOfFame/HallOfFame'),
        '/hall-of-fame-suggestions': () => import('../components/HallOfFame/HallOfFameSuggestions'),
        '/github': () => import('../components/GithubRepo/GithubRepo'),
        '/donate': () => import('../components/Donate/Donate'),
    };

    const importFn = componentMap[predictedPath];
    if (importFn && currentPath !== predictedPath) {
        preloadComponent(predictedPath, importFn);
    }
}

/**
 * Clear preloaded components cache
 */
export function clearPreloadedComponents() {
    preloadedComponents.clear();
}

/**
 * Get preloaded component status
 */
export function getPreloadedComponents(): string[] {
    return Array.from(preloadedComponents.keys());
}

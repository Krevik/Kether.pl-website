/**
 * Enhanced performance utilities with monitoring and metrics
 */

import React from 'react';

// Performance monitoring
export interface PerformanceMetric {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
    private metrics: Map<string, PerformanceMetric> = new Map();
    private observers: Set<(metric: PerformanceMetric) => void> = new Set();

    /**
     * Start measuring performance for a named operation
     */
    startMeasure(name: string, metadata?: Record<string, unknown>): void {
        this.metrics.set(name, {
            name,
            startTime: performance.now(),
            metadata,
        });
    }

    /**
     * End measuring performance and calculate duration
     */
    endMeasure(name: string): PerformanceMetric | null {
        const metric = this.metrics.get(name);
        if (!metric) {
            console.warn(`Performance metric "${name}" not found`);
            return null;
        }

        metric.endTime = performance.now();
        metric.duration = metric.endTime - metric.startTime;

        // Notify observers
        this.observers.forEach(observer => observer(metric));

        // Log in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`Performance: ${name} took ${metric.duration.toFixed(2)}ms`);
        }

        this.metrics.delete(name);
        return metric;
    }

    /**
     * Measure an async operation
     */
    async measureAsync<T>(
        name: string,
        operation: () => Promise<T>,
        metadata?: Record<string, unknown>
    ): Promise<T> {
        this.startMeasure(name, metadata);
        try {
            const result = await operation();
            this.endMeasure(name);
            return result;
        } catch (error) {
            this.endMeasure(name);
            throw error;
        }
    }

    /**
     * Measure a synchronous operation
     */
    measureSync<T>(
        name: string,
        operation: () => T,
        metadata?: Record<string, unknown>
    ): T {
        this.startMeasure(name, metadata);
        try {
            const result = operation();
            this.endMeasure(name);
            return result;
        } catch (error) {
            this.endMeasure(name);
            throw error;
        }
    }

    /**
     * Add observer for performance metrics
     */
    addObserver(observer: (metric: PerformanceMetric) => void): () => void {
        this.observers.add(observer);
        return () => this.observers.delete(observer);
    }

    /**
     * Get all current metrics
     */
    getMetrics(): PerformanceMetric[] {
        return Array.from(this.metrics.values());
    }

    /**
     * Clear all metrics
     */
    clear(): void {
        this.metrics.clear();
    }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React performance utilities
export const performanceUtils = {
    // Debounce function to limit how often a function can be called
    debounce<T extends (...args: unknown[]) => unknown>(
        func: T,
        wait: number,
    ): (...args: Parameters<T>) => void {
        let timeout: ReturnType<typeof setTimeout>;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    // Throttle function to ensure a function is called at most once in a specified time period
    throttle<T extends (...args: unknown[]) => unknown>(
        func: T,
        limit: number,
    ): (...args: Parameters<T>) => void {
        let inThrottle: boolean;
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    // Memoize function results
    memoize<T extends (...args: unknown[]) => unknown>(
        fn: T,
    ): T {
        const cache = new Map();
        return ((...args: Parameters<T>) => {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = fn(...args);
            cache.set(key, result);
            return result;
        }) as T;
    },

    // Measure execution time of a function
    measureTime<T>(fn: () => T, label?: string): T {
        return performanceMonitor.measureSync(label || 'Function', fn);
    },

    // Measure async execution time
    measureAsyncTime<T>(fn: () => Promise<T>, label?: string): Promise<T> {
        return performanceMonitor.measureAsync(label || 'Async Function', fn);
    },
};

// React Hook for performance monitoring
export function usePerformanceMonitor() {
    const [metrics, setMetrics] = React.useState<PerformanceMetric[]>([]);

    React.useEffect(() => {
        const unsubscribe = performanceMonitor.addObserver((metric) => {
            setMetrics(prev => [...prev, metric]);
        });

        return unsubscribe;
    }, []);

    const startMeasure = React.useCallback((name: string, metadata?: Record<string, unknown>) => {
        performanceMonitor.startMeasure(name, metadata);
    }, []);

    const endMeasure = React.useCallback((name: string) => {
        return performanceMonitor.endMeasure(name);
    }, []);

    const clearMetrics = React.useCallback(() => {
        setMetrics([]);
        performanceMonitor.clear();
    }, []);

    return {
        metrics,
        startMeasure,
        endMeasure,
        clearMetrics,
    };
}

// Higher-order component for performance monitoring
export function withPerformanceMonitoring<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    componentName?: string
) {
    const WithPerformanceMonitoring = (props: P) => {

        React.useEffect(() => {
            const displayName = WrappedComponent.displayName || WrappedComponent.name;
            performanceMonitor.startMeasure(`${displayName}-mount`);
            return () => {
                performanceMonitor.endMeasure(`${displayName}-mount`);
            };
        }, []);

        return React.createElement(WrappedComponent, props);
    };

    WithPerformanceMonitoring.displayName = `withPerformanceMonitoring(${WrappedComponent.displayName || WrappedComponent.name})`;
    return WithPerformanceMonitoring;
}

// Web Vitals monitoring (placeholder - install web-vitals package to enable)
export function useWebVitals() {
    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Web Vitals monitoring available - install web-vitals package to enable');
        }
    }, []);
}

// Bundle size analyzer
export function analyzeBundleSize() {
    if (process.env.NODE_ENV === 'development') {
        const bundleSize = {
            js: document.querySelectorAll('script[src*="static/js"]').length,
            css: document.querySelectorAll('link[href*="static/css"]').length,
            images: document.querySelectorAll('img').length,
        };

        console.log('Bundle Analysis:', bundleSize);
        return bundleSize;
    }
}

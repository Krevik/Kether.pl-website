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
		const start = performance.now();
		const result = fn();
		const end = performance.now();
		
		console.log(`${label || 'Function'} took ${(end - start).toFixed(2)}ms`);
		
		return result;
	},
};

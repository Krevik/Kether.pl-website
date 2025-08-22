import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './VirtualList.css';

interface VirtualListProps<T> {
    items: T[];
    height: number;
    itemHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    overscan?: number;
    className?: string;
}

export function VirtualList<T>({
    items,
    height,
    itemHeight,
    renderItem,
    overscan = 5,
    className = '',
}: VirtualListProps<T>) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate visible range
    const visibleRange = useMemo(() => {
        const start = Math.floor(scrollTop / itemHeight);
        const visibleCount = Math.ceil(height / itemHeight);
        const end = Math.min(start + visibleCount + overscan, items.length);
        const startIndex = Math.max(0, start - overscan);

        return { start: startIndex, end };
    }, [scrollTop, itemHeight, height, overscan, items.length]);

    // Calculate total height for scroll container
    const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

    // Calculate offset for visible items
    const offsetY = useMemo(() => visibleRange.start * itemHeight, [visibleRange.start, itemHeight]);

    // Handle scroll events
    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
    }, []);

    // Get visible items
    const visibleItems = useMemo(() => {
        return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
            item,
            index: visibleRange.start + index,
        }));
    }, [items, visibleRange.start, visibleRange.end]);

    // Auto-scroll to top when items change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
            setScrollTop(0);
        }
    }, [items]);

    return (
        <div
            ref={containerRef}
            className={`virtual-list ${className}`}
            style={{ height, overflow: 'auto' }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div
                    style={{
                        position: 'absolute',
                        top: offsetY,
                        left: 0,
                        right: 0,
                    }}
                >
                    {visibleItems.map(({ item, index }) => (
                        <div
                            key={index}
                            style={{ height: itemHeight }}
                            className="virtual-list-item"
                        >
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default VirtualList;

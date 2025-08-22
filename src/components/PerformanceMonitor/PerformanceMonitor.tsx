import React from 'react';
import { usePerformanceMonitor } from '../../utils/performanceUtils';
import { useTranslation } from 'react-i18next';
import './PerformanceMonitor.css';

interface PerformanceMonitorProps {
    show?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ show = false }) => {
    const { metrics, clearMetrics } = usePerformanceMonitor();
    const { t } = useTranslation();

    if (!show || process.env.NODE_ENV !== 'development') {
        return null;
    }

    const averageDuration = metrics.length > 0 
        ? metrics.reduce((sum, metric) => sum + (metric.duration || 0), 0) / metrics.length 
        : 0;

    const slowOperations = metrics.filter(metric => (metric.duration || 0) > 100);

    return (
        <div className="performance-monitor">
            <div className="performance-monitor-header">
                <h3>{t('performance.monitor.title')}</h3>
                <button onClick={clearMetrics} className="clear-button">
                    {t('performance.monitor.clear')}
                </button>
            </div>
            
            <div className="performance-stats">
                <div className="stat">
                    <span className="stat-label">{t('performance.monitor.totalOperations')}:</span>
                    <span className="stat-value">{metrics.length}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">{t('performance.monitor.averageDuration')}:</span>
                    <span className="stat-value">{averageDuration.toFixed(2)}ms</span>
                </div>
                <div className="stat">
                    <span className="stat-label">{t('performance.monitor.slowOperations')}:</span>
                    <span className="stat-value">{slowOperations.length}</span>
                </div>
            </div>

            {metrics.length > 0 && (
                <div className="performance-metrics">
                    <h4>{t('performance.monitor.recentOperations')}</h4>
                    <div className="metrics-list">
                        {metrics.slice(-10).reverse().map((metric, index) => {
                            const isSlow = (metric.duration || 0) > 100;
                            return (
                                <div 
                                    key={`${metric.name}-${index}`} 
                                    className={`metric-item ${isSlow ? 'slow' : ''}`}
                                >
                                <span className="metric-name">{metric.name}</span>
                                <span className="metric-duration">
                                    {metric.duration?.toFixed(2)}ms
                                </span>
                            </div>
                        );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceMonitor;

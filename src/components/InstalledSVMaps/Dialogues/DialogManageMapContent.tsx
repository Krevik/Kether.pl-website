import { MapManageDetail, UpdateCheckResult } from '../../../services/mapsManageService';
import { useMapsTranslations } from '../../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type DialogManageMapContentProps = {
    detail: MapManageDetail | null;
    loading: boolean;
    loadError: string | null;
    updateResult: UpdateCheckResult | null;
    mapsTranslations: MapsTranslations;
};

function formatDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function DialogManageMapContent({
    detail,
    loading,
    loadError,
    updateResult,
    mapsTranslations,
}: DialogManageMapContentProps) {
    if (loading) {
        return <p className="maps-manage-loading">{mapsTranslations.manageLoading}</p>;
    }

    if (loadError) {
        return <p className="maps-install-hint maps-install-hint-error">{loadError}</p>;
    }

    if (!detail) {
        return null;
    }

    const checksum = detail.checksum
        ? `${detail.checksumKind?.toUpperCase() ?? 'MD5'}: ${detail.checksum}`
        : mapsTranslations.manageNotAvailable;

    return (
        <div className="maps-manage-content">
            <h3 className="maps-manage-title">{detail.name}</h3>
            <dl className="maps-manage-detail">
                <div className="maps-manage-detail__row">
                    <dt>{mapsTranslations.manageDetailFilename}</dt>
                    <dd>{detail.installedPath}</dd>
                </div>
                <div className="maps-manage-detail__row">
                    <dt>{mapsTranslations.manageDetailChecksum}</dt>
                    <dd className="maps-manage-detail__checksum">{checksum}</dd>
                </div>
                <div className="maps-manage-detail__row">
                    <dt>{mapsTranslations.manageDetailInstalledAt}</dt>
                    <dd>{formatDate(detail.installedAt)}</dd>
                </div>
                {detail.workshopUpdatedAt ? (
                    <div className="maps-manage-detail__row">
                        <dt>{mapsTranslations.manageDetailWorkshopUpdatedAt}</dt>
                        <dd>{formatDate(detail.workshopUpdatedAt)}</dd>
                    </div>
                ) : null}
            </dl>

            {updateResult ? (
                <div
                    className={`maps-manage-status maps-manage-status--${updateResult.status.replace('_', '-')}`}
                    role="status"
                >
                    {updateResult.message}
                </div>
            ) : null}
        </div>
    );
}

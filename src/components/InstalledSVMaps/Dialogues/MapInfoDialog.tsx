import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { MapEntry } from '../mapEntry';
import { formatMapDate } from '../utils';
import { useCommonTranslations, useMapsTranslations } from '../../../hooks/useTranslations';
import { DIALOG_STYLES } from '../constants';

export type MapInfoDialogProps = {
    isDialogVisible: boolean;
    map: MapEntry | null;
    onHide: () => void;
};

/**
 * Read-only info popup for non-admins: just the checksum and installed date,
 * sourced from the already-loaded public map list (no extra network request).
 */
export function MapInfoDialog({ isDialogVisible, map, onHide }: MapInfoDialogProps) {
    const mapsTranslations = useMapsTranslations();
    const commonTranslations = useCommonTranslations();

    const checksum = map?.checksum
        ? `${map.checksumKind?.toUpperCase() ?? 'MD5'}: ${map.checksum}`
        : mapsTranslations.manageNotAvailable;
    const installedAt = map?.installedAt
        ? formatMapDate(map.installedAt)
        : mapsTranslations.manageNotAvailable;

    const footer = (
        <div className="maps-install-dialog__footer-actions">
            <Button
                label={commonTranslations.close}
                className="maps-install-dialog__btn maps-install-dialog__btn-cancel app-focus-ring"
                onClick={onHide}
            />
        </div>
    );

    return (
        <Dialog
            visible={isDialogVisible}
            header={mapsTranslations.infoTitle}
            modal
            className="p-fluid app-dialog maps-install-dialog maps-manage-dialog"
            headerClassName="maps-install-dialog__header"
            contentClassName="maps-install-dialog__content"
            maskClassName="maps-install-dialog__mask"
            style={DIALOG_STYLES}
            footer={footer}
            onHide={onHide}
        >
            {map ? (
                <div className="maps-manage-content">
                    <h3 className="maps-manage-title">{map.mapName}</h3>
                    <dl className="maps-manage-detail">
                        <div className="maps-manage-detail__row">
                            <dt>{mapsTranslations.manageDetailChecksum}</dt>
                            <dd className="maps-manage-detail__checksum">{checksum}</dd>
                        </div>
                        <div className="maps-manage-detail__row">
                            <dt>{mapsTranslations.manageDetailInstalledAt}</dt>
                            <dd>{installedAt}</dd>
                        </div>
                    </dl>
                </div>
            ) : null}
        </Dialog>
    );
}

import { Button } from 'primereact/button';
import ST_L from '/favicons/steam-logo-svgrepo.png';
import { MapEntry } from './InstalledSVMaps';
import { MAP_SOURCES, BUTTON_CONTAINER_STYLES } from './constants';
import { extractSteamWorkshopId, openSteamWorkshopPage, openUrlInNewWindow } from './utils';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

/**
 * Template for rendering map name cell
 */
export const mapNameBodyTemplate = (rowData: MapEntry) => {
    if (rowData.source === MAP_SOURCES.WORKSHOP) {
        return (
            <a 
                href={rowData.downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-source-link"
            >
                {rowData.mapName}
            </a>
        );
    }
    
    return rowData.mapName;
};

/**
 * Template for rendering action buttons cell
 */
export const mapActionsBodyTemplate = (
    rowData: MapEntry,
    mapsTranslations: MapsTranslations,
    onHelpClick?: () => void
) => {
    if (rowData.source === MAP_SOURCES.WORKSHOP) {
        return renderWorkshopButton(rowData, mapsTranslations);
    }
    
    return renderDownloadButton(rowData, mapsTranslations, onHelpClick);
};

/**
 * Renders the Workshop install button
 */
const renderWorkshopButton = (
    rowData: MapEntry,
    mapsTranslations: MapsTranslations
) => {
    const workshopId = extractSteamWorkshopId(rowData.downloadUrl);
    
    const handleClick = () => {
        if (workshopId) {
            openSteamWorkshopPage(workshopId);
        } else if (rowData.downloadUrl) {
            openUrlInNewWindow(rowData.downloadUrl);
        }
    };
    
    return (
        <Button
            label={`　${mapsTranslations.install}`}
            icon={<img src={ST_L} width="23px" height="23px" alt="Steam logo" />}
            className="p-button-success"
            onClick={handleClick}
        />
    );
};

/**
 * Renders the download button(s) for non-Workshop maps
 */
const renderDownloadButton = (
    rowData: MapEntry,
    mapsTranslations: MapsTranslations,
    onHelpClick?: () => void
) => {
    const handleDownload = () => {
        if (rowData.downloadUrl) {
            openUrlInNewWindow(rowData.downloadUrl);
        }
    };
    
    return (
        <div style={BUTTON_CONTAINER_STYLES}>
            <Button
                label={`🌐　${mapsTranslations.download}`}
                className="p-button-info"
                onClick={handleDownload}
            />
            {rowData.source === MAP_SOURCES.SIR_PLEASE && (
                <Button
                    label="?"
                    className="p-button p-button-help"
                    onClick={onHelpClick}
                    title={mapsTranslations.installationHelp}
                />
            )}
        </div>
    );
};


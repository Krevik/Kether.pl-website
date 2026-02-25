import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { MapEntry } from './InstalledSVMaps';
import { mapNameBodyTemplate, mapActionsBodyTemplate } from './tableTemplates';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

interface MapsDataTableProps {
    maps: MapEntry[];
    title: string;
    isAdmin: boolean;
    mapsTranslations: MapsTranslations;
    onHelpClick?: () => void;
}

/**
 * Reusable DataTable component for displaying maps
 */
export const MapsDataTable: React.FC<MapsDataTableProps> = ({
    maps,
    title,
    isAdmin,
    mapsTranslations,
    onHelpClick,
}) => {
    if (maps.length === 0) {
        return null;
    }

    return (
        <div className="table-wrapper">
            <div className="table-title">{title}</div>
            <DataTable
                value={maps}
                className="app-data-table maps-data-table"
                scrollable={true}
                scrollHeight="flex"
                emptyMessage={mapsTranslations.noMapsAvailable}
            >
                {isAdmin && (
                    <Column
                        header={mapsTranslations.databaseId}
                        body={(_, options) => options.rowIndex + 1}
                    />
                )}
                <Column
                    field="mapName"
                    header={mapsTranslations.mapName}
                    sortable
                    body={mapNameBodyTemplate}
                />
                <Column
                    header={mapsTranslations.actions}
                    body={(rowData) =>
                        mapActionsBodyTemplate(rowData, mapsTranslations, onHelpClick)
                    }
                />
            </DataTable>
        </div>
    );
};


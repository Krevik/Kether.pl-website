import { Dialog } from 'primereact/dialog';
import { DIALOG_STYLES, CODE_BLOCK_STYLES } from './constants';
import { useMapsTranslations } from '../../hooks/useTranslations';

interface InstallationHelpDialogProps {
    visible: boolean;
    onHide: () => void;
}

/**
 * Dialog component displaying installation instructions for manual map installation
 */
export const InstallationHelpDialog: React.FC<InstallationHelpDialogProps> = ({
    visible,
    onHide,
}) => {
    const mapsTranslations = useMapsTranslations();

    return (
        <Dialog
            visible={visible}
            header={mapsTranslations.installationInstructions}
            modal
            className="p-fluid app-dialog maps-install-dialog"
            headerClassName="maps-install-dialog__header"
            contentClassName="maps-install-dialog__content"
            maskClassName="maps-install-dialog__mask"
            onHide={onHide}
            style={DIALOG_STYLES}
        >
            <div style={{ padding: '1rem' }}>
                <p style={{ marginBottom: '1rem' }}>
                    {mapsTranslations.installationDescription}
                </p>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#4a9eff' }}>
                        🪟 Windows:
                    </h4>
                    <code style={CODE_BLOCK_STYLES}>
                        {mapsTranslations.windowsPath}
                    </code>
                </div>
                
                <div>
                    <h4 style={{ marginBottom: '0.5rem', color: '#4a9eff' }}>
                        🐧 Linux:
                    </h4>
                    <code style={CODE_BLOCK_STYLES}>
                        {mapsTranslations.linuxPath}
                    </code>
                </div>
            </div>
        </Dialog>
    );
};


import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { notificationManager } from '../../../utils/notificationManager';

import { CommandEntry } from '../../../models/commandModels';
import { commandsManagingService } from '../../../services/commandsManagingService';
import DialogCommandContent from './DialogCommandContent';
import { useCommandsTranslations, useCommonTranslations } from '../../../hooks/useTranslations';

type AddNewCommandDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    command: string;
    commandDescription: string;
    setCommand: (command: string) => void;
    setCommandDescription: (commandDescription: string) => void;
};

export default function AddNewCommandDialog(props: AddNewCommandDialogProps) {
    const commandsTranslations = useCommandsTranslations();
    const commonTranslations = useCommonTranslations();
    
    const newCommandDialogFooter = (
        <>
            <Button
                label={`❌ ${commonTranslations.cancel}`}
                className="p-button-text app-focus-ring"
                onClick={() => props.setDialogVisibility(false)}
            />
            <Button
                label={`✅ ${commonTranslations.save}`}
                className="p-button-text app-focus-ring"
                onClick={() => {
                    const newCommand = {
                        command: props.command,
                        description: props.commandDescription,
                    } as CommandEntry;
                    commandsManagingService
                        .addNewCommand(newCommand)
                        .then(() => {
                            notificationManager.SUCCESS(
                                commandsTranslations.successfullyAdded
                            );
                            props.setDialogVisibility(false);
                            props.setCommandDescription('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                `${commandsTranslations.couldntAdd}: ${error.message}`
                            );
                        });
                }}
            />
        </>
    );

    return (
        <Dialog
            visible={props.isDialogVisible}
            header={commandsTranslations.addNewCommand}
            modal
            className="p-fluid app-dialog"
            footer={newCommandDialogFooter}
            onHide={() => props.setDialogVisibility(false)}
        >
            <DialogCommandContent
                setCommandDescription={props.setCommandDescription}
                commandDescription={props.commandDescription}
                setCommand={props.setCommand}
                command={props.command}
            />
        </Dialog>
    );
}

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { notificationManager } from '../../../utils/notificationManager';

import { CommandEntry } from '../../../models/commandModels';
import { commandsManagingService } from '../../../services/commandsManagingService';
import DialogCommandContent from './DialogCommandContent';

type AddNewCommandDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    command: string;
    commandDescription: string;
    setCommand: (command: string) => void;
    setCommandDescription: (commandDescription: string) => void;
};

export default function AddNewCommandDialog(props: AddNewCommandDialogProps) {
    const newCommandDialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => props.setDialogVisibility(false)}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={() => {
                    const newCommand = {
                        command: props.command,
                        description: props.commandDescription,
                    } as CommandEntry;
                    commandsManagingService
                        .addNewCommand(newCommand)
                        .then(() => {
                            notificationManager.SUCCESS(
                                `Successfully added new command`
                            );
                            props.setDialogVisibility(false);
                            props.setCommandDescription('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                `Couldn't add the command: ${error.message}`
                            );
                        });
                }}
            />
        </>
    );

    return (
        <Dialog
            visible={props.isDialogVisible}
            header="Add new command"
            modal
            className="p-fluid"
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

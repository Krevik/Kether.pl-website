import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { notificationManager } from '../../../utils/notificationManager';
import { MutableRefObject } from 'react';
import { CommandEntry } from '../../../models/commandModels';
import { commandsManagingService } from '../../../services/commandsManagingService';
import DialogCommandContent from './DialogCommandContent';

type EditCommandDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    command: string;
    commandDescription: string;
    setCommand: (author: string) => void;
    setCommandDescription: (text: string) => void;
    commandEditingIdRef: MutableRefObject<Number>;
};

export default function EditCommandDialog(props: EditCommandDialogProps) {
    const editCommandDialogFooter = () => {
        return (
            <>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    className="p-button-text"
                    onClick={() => {
                        props.commandEditingIdRef.current = -1;
                        props.setDialogVisibility(false);
                    }}
                />

                <Button
                    label="Update"
                    icon="pi pi-check"
                    className="p-button-text"
                    onClick={() => {
                        const newCommandData = {
                            command: props.command,
                            description: props.commandDescription,
                            id: props.commandEditingIdRef.current,
                        } as CommandEntry;
                        commandsManagingService
                            .updateCommand(newCommandData)
                            .then(() => {
                                notificationManager.SUCCESS(
                                    `Successfully updated the command`
                                );
                                props.setDialogVisibility(false);
                                props.commandEditingIdRef.current = -1;
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    `Couldn't update the command: ${error.message}`
                                );
                            });
                    }}
                />
            </>
        );
    };

    return (
        <Dialog
            visible={props.isDialogVisible}
            header="Edit Command"
            modal
            className="p-fluid"
            footer={editCommandDialogFooter()}
            onHide={() => {
                props.setDialogVisibility(false);
            }}
        >
            <DialogCommandContent
                command={props.command}
                commandDescription={props.commandDescription}
                setCommand={props.setCommand}
                setCommandDescription={props.setCommandDescription}
            />
        </Dialog>
    );
}

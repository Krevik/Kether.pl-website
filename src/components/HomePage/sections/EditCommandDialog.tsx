import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { notificationManager } from '../../../utils/notificationManager';
import { MutableRefObject } from 'react';
import { CommandEntry } from '../../../models/commandModels';
import { commandsManagingService } from '../../../services/commandsManagingService';
import DialogCommandContent from './DialogCommandContent';
import { useCommandsTranslations, useCommonTranslations } from '../../../hooks/useTranslations';

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
    const commandsTranslations = useCommandsTranslations();
    const commonTranslations = useCommonTranslations();
    
    const editCommandDialogFooter = () => {
        return (
            <>
                <Button
                    label={`❌ ${commonTranslations.cancel}`}
                    className="p-button-text app-focus-ring"
                    onClick={() => {
                        props.commandEditingIdRef.current = -1;
                        props.setDialogVisibility(false);
                    }}
                />

                <Button
                    label={`✅ ${commonTranslations.update}`}
                    className="p-button-text app-focus-ring"
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
                                    commonTranslations.update
                                );
                                props.setDialogVisibility(false);
                                props.commandEditingIdRef.current = -1;
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    `${commonTranslations.error}: ${error.message}`
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
            header={commandsTranslations.editCommand}
            modal
            className="p-fluid app-dialog"
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

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRef, useState } from 'react';
import { commandsManagingService } from '../../../services/commandsManagingService';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { CommandEntry } from '../../../models/commandModels';
import { Button } from 'primereact/button';
import { notificationManager } from '../../../utils/notificationManager';
import { Toast } from 'primereact/toast';
import EditCommandDialog from './EditCommandDialog';
import { Toolbar } from 'primereact/toolbar';
import AddNewCommandDialog from './AddNewCommandDialog';

export default function CommandsSection() {
    const isAdmin: boolean = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );
    const commands: CommandEntry[] = useSelector(
        (state: AppState) => state.commandsReducer.commands
    );
    const [commandDescription, setCommandDescription] = useState('');
    const editingCommandID = useRef(-1);
    const [command, setCommand] = useState('');
    const [newCommandDialogVisibiilty, setNewCommandDialogVisibility] =
        useState(false);

    const [editCommandDialogVisibility, setEditCommandDialogVisibility] =
        useState(false);

    commandsManagingService.useCommandsLoadingService();

    const commandActionsColumnBody = (rowData: CommandEntry) => {
        return (
            <>
                <Button
                    data-toggle="tooltip"
                    title="Edits the given command"
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => {
                        editingCommandID.current = rowData.id;
                        setEditCommandDialogVisibility(true);
                        setCommand(rowData.command);
                        setCommandDescription(rowData.description);
                    }}
                />
                <Button
                    data-toggle="tooltip"
                    title="Deletes the given command instantly"
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => {
                        commandsManagingService
                            .deleteCommand(rowData)
                            .then((deletedCommandResponse) => {
                                notificationManager.SUCCESS(
                                    `${deletedCommandResponse}`
                                );
                                setNewCommandDialogVisibility(false);
                                setCommandDescription('');
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    `Couldn't delete the command: ${error}`
                                );
                            });
                    }}
                />
            </>
        );
    };

    const getToolbarLeftSide = () => {
        return (
            <>
                {isAdmin && (
                    <Button
                        label="New Command"
                        icon="pi pi-plus"
                        className="p-button-success mr-2"
                        data-toggle="tooltip"
                        title="Adds new command"
                        onClick={() => setNewCommandDialogVisibility(true)}
                    ></Button>
                )}
            </>
        );
    };

    return (
        <div className="section">
            <AddNewCommandDialog
                setCommandDescription={setCommandDescription}
                commandDescription={commandDescription}
                setCommand={setCommand}
                command={command}
                isDialogVisible={newCommandDialogVisibiilty}
                setDialogVisibility={setNewCommandDialogVisibility}
            />
            <EditCommandDialog
                setCommandDescription={setCommandDescription}
                commandDescription={commandDescription}
                setCommand={setCommand}
                command={command}
                commandEditingIdRef={editingCommandID}
                isDialogVisible={editCommandDialogVisibility}
                setDialogVisibility={setEditCommandDialogVisibility}
            />

            {isAdmin && (
                <Toolbar
                    className="mb-4"
                    start={getToolbarLeftSide()}
                ></Toolbar>
            )}

            <DataTable
                value={commands}
                responsiveLayout="scroll"
                style={{
                    backgroundColor: 'transparent',
                    background: 'transparent',
                    backdropFilter: 'blur(2px)',
                }}
            >
                <Column field="command" header="Command"></Column>
                <Column field="description" header="Description"></Column>
                {isAdmin && (
                    <Column
                        header="Actions"
                        body={commandActionsColumnBody}
                    ></Column>
                )}
            </DataTable>
        </div>
    );
}

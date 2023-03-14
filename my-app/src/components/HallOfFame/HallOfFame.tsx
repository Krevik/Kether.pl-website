import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import backgroundImage from '../../resources/backgrounds/background_2.jpg';
import './HallOfFame.css';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import { bindsManagingService } from '../../services/bindsManagingService';
import { Button } from 'primereact/button';
import { BindEntry, BindSuggestionEntry } from '../../models/bindsModels';
import { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { bindSuggestionsManagingService } from '../../services/bindSuggestionsManagingService';
import { notificationManager } from '../../utils/notificationManager';
import EditBindDialog from './Dialog/EditBindDialog';
import DialogBindContent from './Dialog/DialogBindContent';

export default function HallOfFame() {
    const binds = useSelector((state: AppState) => state.bindsReducer.binds);
    const bindSuggestions = useSelector(
        (state: AppState) => state.bindSuggestionsReducer.bindSuggestions
    );
    const userID = useSelector(
        (state: AppState) => state.userDataReducer.userID
    );
    const steamUserData = useSelector(
        (state: AppState) => state.userDataReducer.userData
    );
    const isAdmin: boolean = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );

    const [newBindDialogVisibility, setNewBindDialogVisibility] =
        useState(false);
    const [
        newBindSuggestionDialogVisibility,
        setNewBindSuggestionDialogVisibility,
    ] = useState(false);

    const [editBindDialogVisibility, setEditBindDialogVisibility] =
        useState(false);

    const [bindAuthor, setBindAuthor] = useState('');
    const editingBindID = useRef(-1);

    const [bindText, setBindText] = useState('');

    const toast = useRef<Toast>(null);

    bindsManagingService.useBindsLoadingService();
    bindSuggestionsManagingService.useBindSuggestionsLoadingService();

    const bindSuggestionBody = (rowData: BindSuggestionEntry) => {
        return (
            <>
                <Button
                    data-toggle="tooltip"
                    title="Accepts the given bind"
                    icon="pi pi-check"
                    className="p-button-rounded p-button-success"
                    onClick={() => {
                        const bind = trimBindAuthor(
                            rowData
                        ) as BindSuggestionEntry;
                        bindsManagingService
                            .addNewBind(bind)
                            .then((addedBind) => {
                                notificationManager.SUCCESS(
                                    toast,
                                    `Successfully accepted new bind: ${addedBind}`
                                );
                                bindSuggestionsManagingService.deleteBindSuggestion(
                                    bind
                                );
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    toast,
                                    `Couldn't add new bind: ${error}`
                                );
                            });
                    }}
                />

                <Button
                    data-toggle="tooltip"
                    title="Deletes the given bind suggestion instantly"
                    icon="pi pi-times"
                    className="p-button-rounded p-button-danger"
                    onClick={() => {
                        bindSuggestionsManagingService
                            .deleteBindSuggestion(rowData)
                            .then((deletedBind) => {
                                notificationManager.SUCCESS(
                                    toast,
                                    `Successfully deleted bind suggestion: ${deletedBind}`
                                );
                                setNewBindDialogVisibility(false);
                                setBindText('');
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    toast,
                                    `Couldn't delete bind suggestion: ${error}`
                                );
                            });
                    }}
                />
            </>
        );
    };

    const trimBindAuthor = (bind: BindEntry | BindSuggestionEntry) => {
        return {
            ...bind,
            author: bind.author.replace(':', '').trim(),
        };
    };

    const bindActionBodyTemplate = (rowData: BindEntry) => {
        return (
            <>
                <Button
                    data-toggle="tooltip"
                    title="Edits the given bind"
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => {
                        editingBindID.current = rowData.id;
                        setEditBindDialogVisibility(true);
                        setBindAuthor(trimBindAuthor(rowData).author);
                        setBindText(rowData.text);
                    }}
                />
                <Button
                    data-toggle="tooltip"
                    title="Deletes the given bind instantly"
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => {
                        bindsManagingService
                            .deleteBind(rowData)
                            .then((deletedBindResponse) => {
                                notificationManager.SUCCESS(
                                    toast,
                                    `${deletedBindResponse}`
                                );
                                setNewBindDialogVisibility(false);
                                setBindText('');
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    toast,
                                    `Couldn't delete the bind: ${error}`
                                );
                            });
                    }}
                />
            </>
        );
    };

    const newBindDialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={(e) => setNewBindDialogVisibility(false)}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={() => {
                    const newBind = {
                        author: bindAuthor,
                        text: bindText,
                    } as BindEntry;
                    bindsManagingService
                        .addNewBind(newBind)
                        .then(() => {
                            notificationManager.SUCCESS(
                                toast,
                                `Successfully added new bind`
                            );
                            setNewBindDialogVisibility(false);
                            setBindText('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                toast,
                                `Couldn't add the bind: ${error}`
                            );
                        });
                }}
            />
        </>
    );

    const newBindSuggestionDialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={(e) => setNewBindSuggestionDialogVisibility(false)}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={() => {
                    const newBind = {
                        id: -1,
                        proposedBy: steamUserData!.personaname,
                        author: bindAuthor,
                        text: bindText,
                    } as BindSuggestionEntry;
                    bindSuggestionsManagingService
                        .addNewBindSuggestion(newBind)
                        .then(() => {
                            notificationManager.SUCCESS(
                                toast,
                                `Successfully suggested new bind`
                            );
                            setNewBindSuggestionDialogVisibility(false);
                            setBindText('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                toast,
                                `Couldn't suggest the bind: ${error}`
                            );
                        });
                }}
            />
        </>
    );

    const getToolbarLeftSide = () => {
        return (
            <>
                {isAdmin && (
                    <Button
                        label="New Bind"
                        icon="pi pi-plus"
                        className="p-button-success mr-2"
                        data-toggle="tooltip"
                        title="Adds new bind"
                        onClick={(e) => setNewBindDialogVisibility(true)}
                    ></Button>
                )}
                {userID && (
                    <Button
                        label="Suggest Bind"
                        icon="pi pi-plus"
                        className="p-button-success mr-2"
                        data-toggle="tooltip"
                        title="Adds new bind suggestion"
                        onClick={(e) =>
                            setNewBindSuggestionDialogVisibility(true)
                        }
                    ></Button>
                )}
            </>
        );
    };

    const addNewBindDialog = () => {
        return (
            <Dialog
                visible={newBindDialogVisibility}
                header="Add new Bind"
                modal
                className="p-fluid"
                footer={newBindDialogFooter}
                onHide={() => setNewBindDialogVisibility(false)}
            >
                <DialogBindContent
                    setBindText={setBindText}
                    bindText={bindText}
                    setBindAuthor={setBindAuthor}
                    bindAuthor={bindAuthor}
                />
            </Dialog>
        );
    };

    const addNewBindSuggestionDialog = () => {
        return (
            <Dialog
                visible={newBindSuggestionDialogVisibility}
                header="Suggest new bind"
                modal
                className="p-fluid"
                footer={newBindSuggestionDialogFooter}
                onHide={() => setNewBindSuggestionDialogVisibility(false)}
            >
                <DialogBindContent
                    setBindText={setBindText}
                    bindText={bindText}
                    setBindAuthor={setBindAuthor}
                    bindAuthor={bindAuthor}
                />
            </Dialog>
        );
    };

    const mapBinds = (binds: BindEntry[] | BindSuggestionEntry[]) => {
        return binds.map((bind) => {
            return {
                ...bind,
                author: `${bind.author} : `,
            };
        });
    };

    return (
        <div
            className="hall-of-fame"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="card">
                <Toast ref={toast} />
                {addNewBindDialog()}
                {addNewBindSuggestionDialog()}

                <EditBindDialog
                    setBindText={setBindText}
                    bindText={bindText}
                    setBindAuthor={setBindAuthor}
                    bindAuthor={bindAuthor}
                    bindEditingIdRef={editingBindID}
                    isDialogVisible={editBindDialogVisibility}
                    setDialogVisibility={setEditBindDialogVisibility}
                    notificationToast={toast}
                />

                <Toolbar className="mb-4" left={getToolbarLeftSide()}></Toolbar>

                <div className="centered-text"> Binds</div>
                <div className="card">
                    <DataTable value={mapBinds(binds)} scrollable={true}>
                        {isAdmin && (
                            <Column
                                field="id"
                                header="database ID"
                                sortable
                            ></Column>
                        )}
                        <Column
                            field="author"
                            header="Author"
                            sortable
                        ></Column>
                        <Column field="text" header="Text" sortable></Column>
                        {isAdmin && (
                            <Column
                                header="Actions"
                                body={bindActionBodyTemplate}
                            ></Column>
                        )}
                    </DataTable>
                </div>

                {isAdmin && (
                    <>
                        <div className="centered-text">Bind Suggestions</div>
                        <div className="card">
                            <DataTable
                                value={mapBinds(bindSuggestions)}
                                scrollable={true}
                            >
                                <Column
                                    field="proposedBy"
                                    header="Proposed By"
                                ></Column>
                                <Column
                                    field="id"
                                    header="database ID"
                                    sortable
                                ></Column>
                                <Column
                                    field="author"
                                    header="Author"
                                    sortable
                                ></Column>
                                <Column
                                    field="text"
                                    header="Text"
                                    sortable
                                ></Column>
                                <Column
                                    header="Actions"
                                    body={bindSuggestionBody}
                                ></Column>
                            </DataTable>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

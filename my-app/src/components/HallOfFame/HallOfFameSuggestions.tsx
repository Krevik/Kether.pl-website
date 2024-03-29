import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import backgroundImage from '../../resources/backgrounds/background_2.jpg';
import './HallOfFameSuggestions.css';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import { bindsManagingService } from '../../services/bindsManagingService';
import { Button } from 'primereact/button';
import { BindEntry, BindSuggestionEntry } from '../../models/bindsModels';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { bindSuggestionsManagingService } from '../../services/bindSuggestionsManagingService';
import { notificationManager } from '../../utils/notificationManager';
import AddNewBindSuggestionDialog from './Dialogues/AddNewBindSuggestionDalog';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';

export default function HallOfFameSuggestions() {
    const bindSuggestions = useSelector(
        (state: AppState) => state.bindSuggestionsReducer.bindSuggestions
    );

    const userID = useSelector(
        (state: AppState) => state.userDataReducer.userID
    );
    const userData = useSelector(
        (state: AppState) => state.userDataReducer.userData
    );
    const isAdmin: boolean = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );

    const [
        newBindSuggestionDialogVisibility,
        setNewBindSuggestionDialogVisibility,
    ] = useState(false);

    const [bindAuthor, setBindAuthor] = useState('');
    const editingBindID = useRef(-1);

    const [bindText, setBindText] = useState('');

    bindSuggestionsManagingService.useBindSuggestionsLoadingService();

    const bindSuggestionBody = (rowData: BindSuggestionEntry) => {
        return (
            isAdmin && (
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
                                .addNewBind(bind, userData?.steamid)
                                .then((addedBind) => {
                                    notificationManager.SUCCESS(
                                        `Successfully accepted new bind: ${addedBind}`
                                    );
                                    bindSuggestionsManagingService.deleteBindSuggestion(
                                        bind
                                    );
                                })
                                .catch((error) => {
                                    notificationManager.ERROR(
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
                                        `Successfully deleted bind suggestion: ${deletedBind}`
                                    );
                                    setBindText('');
                                })
                                .catch((error) => {
                                    notificationManager.ERROR(
                                        `Couldn't delete bind suggestion: ${error}`
                                    );
                                });
                        }}
                    />
                </>
            )
        );
    };

    const trimBindAuthor = (bind: BindEntry | BindSuggestionEntry) => {
        return {
            ...bind,
            author: bind.author.replace(':', '').trim(),
        };
    };

    const getToolbarLeftSide = () => {
        return (
            <>
                {userID && (
                    <Button
                        label="Suggest Bind"
                        icon="pi pi-plus"
                        className="p-button-success mr-2"
                        data-toggle="tooltip"
                        title="Adds new bind suggestion"
                        onClick={() =>
                            setNewBindSuggestionDialogVisibility(true)
                        }
                    ></Button>
                )}
            </>
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
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_2}>
            <div className="hall-of-fame-suggestions">
                <div className="card">
                    <AddNewBindSuggestionDialog
                        setBindText={setBindText}
                        bindText={bindText}
                        setBindAuthor={setBindAuthor}
                        bindAuthor={bindAuthor}
                        bindEditingIdRef={editingBindID}
                        isDialogVisible={newBindSuggestionDialogVisibility}
                        setDialogVisibility={
                            setNewBindSuggestionDialogVisibility
                        }
                    />

                    <Toolbar
                        className="mb-4"
                        start={getToolbarLeftSide()}
                    ></Toolbar>

                    <>
                        <div className="centered-text">Bind Suggestions</div>
                        <div className="card">
                            <DataTable
                                value={mapBinds(bindSuggestions)}
                                scrollable={true}
                                scrollHeight="flex"
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
                </div>
            </div>
        </PageWithBackground>
    );
}

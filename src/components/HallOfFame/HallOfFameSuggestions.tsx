import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import './HallOfFameSuggestions.css';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import { bindsManagingService } from '../../services/bindsManagingService';
import { Button } from 'primereact/button';
import { BindEntry, BindSuggestionEntry } from '../../models/bindsModels';
import { useRef, useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { bindSuggestionsManagingService } from '../../services/bindSuggestionsManagingService';
import { notificationManager } from '../../utils/notificationManager';
import AddNewBindSuggestionDialog from './Dialogues/AddNewBindSuggestionDalog';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { trimBindAuthor } from '../../utils/bindUtils';
import { useSuggestionsTranslations, useBindsTranslations } from '../../hooks/useTranslations';

const mapBinds = (binds: BindEntry[] | BindSuggestionEntry[]) => {
    return binds.map((bind) => {
        return {
            ...bind,
            author: `${bind.author} : `,
        };
    });
};

const getToolbarLeftSide = (
    userID: string | undefined,
    setNewBindSuggestionDialogVisibility: (
        value: boolean | ((prevVar: boolean) => boolean)
    ) => void,
    suggestionsTranslations: ReturnType<typeof useSuggestionsTranslations>
) => {
    return (
        <>
            {userID && (
                <Button
                    label={suggestionsTranslations.suggestBind}
                    icon="pi pi-plus"
                    className="p-button-success mr-2"
                    data-toggle="tooltip"
                    title={suggestionsTranslations.suggestBindTooltip}
                    onClick={() => setNewBindSuggestionDialogVisibility(true)}
                ></Button>
            )}
        </>
    );
};

const bindSuggestionBody = (
    rowData: BindSuggestionEntry,
    isAdmin: boolean,
    userData: any,
    suggestionsTranslations: ReturnType<typeof useSuggestionsTranslations>
) => {
    return (
        isAdmin && (
            <>
                <Button
                    data-toggle="tooltip"
                    title={suggestionsTranslations.acceptBindTooltip}
                    icon="pi pi-check"
                    className="p-button-rounded p-button-success"
                    onClick={() => {
                        const bind = trimBindAuthor(
                            rowData
                        ) as BindSuggestionEntry;
                        bindsManagingService
                            .addNewBind(bind, userData?.steamid)
                            .then((_addedBind) => {
                                notificationManager.SUCCESS(
                                    suggestionsTranslations.successfullyAccepted
                                );
                                bindSuggestionsManagingService.deleteBindSuggestion(
                                    bind
                                );
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    `${suggestionsTranslations.couldntAccept}: ${error}`
                                );
                            });
                    }}
                />

                <Button
                    data-toggle="tooltip"
                    title={suggestionsTranslations.deleteSuggestionTooltip}
                    icon="pi pi-times"
                    className="p-button-rounded p-button-danger"
                    onClick={() => {
                        bindSuggestionsManagingService
                            .deleteBindSuggestion(rowData)
                            .then((deletedBind) => {
                                notificationManager.SUCCESS(
                                    `Successfully deleted bind suggestion: ${deletedBind}`
                                );
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    `${suggestionsTranslations.couldntDelete}: ${error}`
                                );
                            });
                    }}
                />
            </>
        )
    );
};

export default function HallOfFameSuggestions() {
    const bindSuggestions = useSelector(
        (state: AppState) => state.bindSuggestionsReducer.bindSuggestions
    );
    const suggestionsTranslations = useSuggestionsTranslations();
    const bindsTranslations = useBindsTranslations();

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

    const isLoading =
        bindSuggestionsManagingService.useBindSuggestionsLoadingService();

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
                        start={getToolbarLeftSide(
                            userID,
                            setNewBindSuggestionDialogVisibility,
                            suggestionsTranslations
                        )}
                    ></Toolbar>

                    <>
                        <div className="centered-text">{suggestionsTranslations.bindSuggestions}</div>
                        <div className="card">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <DataTable
                                    value={mapBinds(bindSuggestions)}
                                    scrollable={true}
                                    scrollHeight="flex"
                                    emptyMessage={suggestionsTranslations.noSuggestionsAvailable}
                                >
                                    {isAdmin && (
                                    <Column
                                        field="id"
                                        header={bindsTranslations.databaseId}
                                        sortable
                                    ></Column>
                                    )}
                                    <Column
                                        field="proposed_by"
                                        header={suggestionsTranslations.proposedBy}
                                    ></Column>
                                    <Column
                                        field="author"
                                        header={bindsTranslations.author}
                                        sortable
                                    ></Column>
                                    <Column
                                        field="text"
                                        header={bindsTranslations.text}
                                        sortable
                                    ></Column>
                                    {isAdmin && (
                                    <Column
                                        header={bindsTranslations.actions}
                                        body={(rowData) =>
                                            bindSuggestionBody(
                                                rowData,
                                                isAdmin,
                                                userData,
                                                suggestionsTranslations
                                            )
                                        }
                                    ></Column>
                                    )}
                                </DataTable>
                            )}
                        </div>
                    </>
                </div>
            </div>
        </PageWithBackground>
    );
}

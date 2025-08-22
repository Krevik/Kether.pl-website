import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import './HallOfFame.css';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import { bindsManagingService } from '../../services/bindsManagingService';
import { Button } from 'primereact/button';
import {
    BindEntry,
    BindSuggestionEntry,
    BindVote,
    BindVotingType,
} from '../../models/bindsModels';
import { useRef, useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { notificationManager } from '../../utils/notificationManager';
import EditBindDialog from './Dialogues/EditBindDialog';
import AddNewBindDialog from './Dialogues/AddNewBindDialog';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { trimBindAuthor } from '../../utils/bindUtils';
import { useBindsTranslations } from '../../hooks/useTranslations';

const mapBinds = (binds: BindEntry[] | BindSuggestionEntry[]) => {
    return binds.map((bind) => {
        return {
            ...bind,
            author: `${bind.author} : `,
        };
    });
};

const getToolbarLeftSide = (
    isAdmin: boolean,
    setNewBindDialogVisibility: (
        value: boolean | ((prevVar: boolean) => boolean)
    ) => void,
    bindsTranslations: ReturnType<typeof useBindsTranslations>
) => {
    return (
        <>
            {isAdmin && (
                <Button
                    label={bindsTranslations.newBind}
                    icon="pi pi-plus"
                    className="p-button-success mr-2"
                    data-toggle="tooltip"
                    title={bindsTranslations.addNewBindTooltip}
                    onClick={() => setNewBindDialogVisibility(true)}
                ></Button>
            )}
        </>
    );
};

const bindActionBodyTemplate = (
    rowData: BindEntry,
    setEditBindDialogVisibility: (
        value: boolean | ((prevVar: boolean) => boolean)
    ) => void,
    setBindAuthor: (value: string | ((prevVar: string) => string)) => void,
    setBindText: (value: string | ((prevVar: string) => string)) => void,
    editingBindID: React.MutableRefObject<number>,
    userData: any,
    bindsTranslations: ReturnType<typeof useBindsTranslations>
) => {
    return (
        <>
            <Button
                data-toggle="tooltip"
                title={bindsTranslations.editBindTooltip}
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning mr-2"
                onClick={() => {
                    editingBindID.current = rowData.id;
                    setEditBindDialogVisibility(true);
                    setBindAuthor(trimBindAuthor(rowData).author);
                    setBindText(rowData.text);
                }}
            />
            <Button
                data-toggle="tooltip"
                title={bindsTranslations.deleteBindTooltip}
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => {
                    bindsManagingService
                        .deleteBind(rowData, userData?.steamid)
                        .then((deletedBindResponse) => {
                            notificationManager.SUCCESS(
                                `${deletedBindResponse}`
                            );
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                `${bindsTranslations.couldntDelete}: ${error}`
                            );
                        });
                }}
            />
        </>
    );
};

const handleVote = (
    voteIn: BindVotingType,
    rowData: BindEntry,
    userData: any,
    deleteVote?: boolean
) => {
    const voteData: BindVote = {
        voterSteamID: userData?.steamid,
        votedBindID: rowData.id.toString(),
        vote: voteIn,
    };
    voteData.id = rowData.votingData?.id || undefined;
    bindsManagingService
        .setVote(voteData, deleteVote)
        .then((response) => {
            notificationManager.SUCCESS(response);
        })
        .catch((error) => {
            notificationManager.ERROR(error);
        });
};

const bindVotingBodyTemplate = (
    rowData: BindEntry,
    userData: any
) => {
    const selfBindVote: BindVotingType | undefined =
        rowData.votingData?.selfVote;
    const selfVoteUpStylingClassName =
        selfBindVote && selfBindVote === BindVotingType.UPVOTE
            ? 'self-voted'
            : '';
    const selfVoteDownStylingClassName =
        selfBindVote && selfBindVote === BindVotingType.DOWNVOTE
            ? 'self-voted'
            : '';
    const voteUpButtonStyling = `vote-up-button ${selfVoteUpStylingClassName}`;
    const voteDownButtonStyling = `vote-down-button ${selfVoteDownStylingClassName}`;
    return (
        <>
            <Button
                className={voteUpButtonStyling}
                icon="pi pi-thumbs-up"
                onClick={() => {
                    handleVote(
                        BindVotingType.UPVOTE,
                        rowData,
                        userData,
                        selfBindVote &&
                            selfBindVote === BindVotingType.UPVOTE
                    );
                }}
            >
                {rowData.votingData?.Upvotes || 0}
            </Button>
            <Button
                className={voteDownButtonStyling}
                icon="pi pi-thumbs-down"
                onClick={() => {
                    handleVote(
                        BindVotingType.DOWNVOTE,
                        rowData,
                        userData,
                        selfBindVote &&
                            selfBindVote === BindVotingType.DOWNVOTE
                    );
                }}
            >
                {rowData.votingData?.Downvotes || 0}
            </Button>
        </>
    );
};

export default function HallOfFame() {
    const binds = useSelector((state: AppState) => state.bindsReducer.binds);
    const bindsTranslations = useBindsTranslations();

    const isAdmin: boolean = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );
    const userData = useSelector(
        (state: AppState) => state.userDataReducer.userData
    );
    const userID = useSelector(
        (state: AppState) => state.userDataReducer.userID
    );

    const [newBindDialogVisibility, setNewBindDialogVisibility] =
        useState(false);

    const [editBindDialogVisibility, setEditBindDialogVisibility] =
        useState(false);

    const [bindAuthor, setBindAuthor] = useState('');
    const editingBindID = useRef(-1);

    const [bindText, setBindText] = useState('');

    const isLoading = bindsManagingService.useBindsLoadingService(
        userData?.steamid
    );

    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_2}>
            <div className="hall-of-fame">
                <div className="card">
                    <AddNewBindDialog
                        setBindText={setBindText}
                        bindText={bindText}
                        setBindAuthor={setBindAuthor}
                        bindAuthor={bindAuthor}
                        isDialogVisible={newBindDialogVisibility}
                        setDialogVisibility={setNewBindDialogVisibility}
                    />

                    <EditBindDialog
                        setBindText={setBindText}
                        bindText={bindText}
                        setBindAuthor={setBindAuthor}
                        bindAuthor={bindAuthor}
                        bindEditingIdRef={editingBindID}
                        isDialogVisible={editBindDialogVisibility}
                        setDialogVisibility={setEditBindDialogVisibility}
                    />

                    <Toolbar
                        className="mb-4"
                        start={getToolbarLeftSide(
                            isAdmin,
                            setNewBindDialogVisibility,
                            bindsTranslations
                        )}
                    ></Toolbar>

                    <div className="centered-text">{bindsTranslations.binds}</div>
                    <div className="card">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <DataTable
                                value={mapBinds(binds)}
                                scrollable={true}
                                scrollHeight="flex"
                                emptyMessage={bindsTranslations.noBindsAvailable}
                            >
                                {isAdmin && (
                                    <Column
                                        field="id"
                                        header={bindsTranslations.databaseId}
                                        sortable
                                    ></Column>
                                )}
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
                                {userID &&
                                    userData &&
                                    userData.steamid && (
                                        <Column
                                            className="voting"
                                            header={bindsTranslations.voting}
                                            body={(rowData) =>
                                                bindVotingBodyTemplate(
                                                    rowData,
                                                    userData
                                                )
                                            }
                                        ></Column>
                                    )}
                                {isAdmin && (
                                    <Column
                                        header={bindsTranslations.actions}
                                        body={(rowData) =>
                                            bindActionBodyTemplate(
                                                rowData,
                                                setEditBindDialogVisibility,
                                                setBindAuthor,
                                                setBindText,
                                                editingBindID,
                                                userData,
                                                bindsTranslations
                                            )
                                        }
                                    ></Column>
                                )}
                            </DataTable>
                        )}
                    </div>
                </div>
            </div>
        </PageWithBackground>
    );
}

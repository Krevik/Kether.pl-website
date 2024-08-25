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
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { notificationManager } from '../../utils/notificationManager';
import EditBindDialog from './Dialogues/EditBindDialog';
import AddNewBindDialog from './Dialogues/AddNewBindDialog';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';

export default function HallOfFame() {
    const binds = useSelector((state: AppState) => state.bindsReducer.binds);

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

    bindsManagingService.useBindsLoadingService(userData?.steamid);

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
                    title="Deletes the given bind instantly"
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => {
                        bindsManagingService
                            .deleteBind(rowData, userData?.steamid)
                            .then((deletedBindResponse) => {
                                notificationManager.SUCCESS(
                                    `${deletedBindResponse}`
                                );
                                setNewBindDialogVisibility(false);
                                setBindText('');
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    `Couldn't delete the bind: ${error}`
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

    const bindVotingBodyTemplate = (rowData: BindEntry) => {
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
                        onClick={() => setNewBindDialogVisibility(true)}
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
                        start={getToolbarLeftSide()}
                    ></Toolbar>

                    <div className="centered-text"> Binds</div>
                    <div className="card">
                        <DataTable
                            value={mapBinds(binds)}
                            scrollable={true}
                            scrollHeight="flex"
                        >
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
                            <Column
                                field="text"
                                header="Text"
                                sortable
                            ></Column>
                            {userID && userData && userData.steamid && (
                                <Column
                                    className="voting"
                                    header="Voting"
                                    body={bindVotingBodyTemplate}
                                ></Column>
                            )}
                            {isAdmin && (
                                <Column
                                    header="Actions"
                                    body={bindActionBodyTemplate}
                                ></Column>
                            )}
                        </DataTable>
                    </div>
                </div>
            </div>
        </PageWithBackground>
    );
}

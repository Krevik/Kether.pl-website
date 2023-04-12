import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import backgroundImage from '../../resources/backgrounds/background_2.jpg';
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
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';

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

    const toast = useRef<Toast>(null);

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
                            .deleteBind(rowData, userData?.steamid)
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

    const handleVote = (voteIn: BindVotingType, rowData: BindEntry) => {
        const voteData: BindVote = {
            voterSteamID: userData?.steamid,
            votedBindID: rowData.id.toString(),
            vote: voteIn,
        };
        voteData.id = rowData.votingData?.id || undefined;
        bindsManagingService
            .setVote(voteData)
            .then((response) => {
                notificationManager.SUCCESS(toast, response);
            })
            .catch((error) => {
                notificationManager.ERROR(toast, error);
            });
    };

    const bindVotingBodyTemplate = (rowData: BindEntry) => {
        return (
            <>
                <Button
                    icon="pi pi-thumbs-up"
                    onClick={() => {
                        handleVote(BindVotingType.UPVOTE, rowData);
                    }}
                >
                    {rowData.votingData?.Upvotes || 0}
                </Button>
                <Button
                    icon="pi pi-thumbs-down"
                    onClick={() => {
                        handleVote(BindVotingType.DOWNVOTE, rowData);
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
        <>
            <Navbar />
            <div
                className="hall-of-fame"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="card">
                    <Toast ref={toast} />

                    <AddNewBindDialog
                        setBindText={setBindText}
                        bindText={bindText}
                        setBindAuthor={setBindAuthor}
                        bindAuthor={bindAuthor}
                        isDialogVisible={newBindDialogVisibility}
                        setDialogVisibility={setNewBindDialogVisibility}
                        notificationToast={toast}
                    />

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
            <Footer />
        </>
    );
}

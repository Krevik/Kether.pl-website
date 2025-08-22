import { Dialog } from 'primereact/dialog';
import DialogBindContent from './DialogBindContent';
import { MutableRefObject } from 'react';
import { Button } from 'primereact/button';
import { BindSuggestionEntry } from '../../../models/bindsModels';
import { bindSuggestionsManagingService } from '../../../services/bindSuggestionsManagingService';
import { notificationManager } from '../../../utils/notificationManager';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';

type AddNewBindSuggestionDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    bindAuthor: string;
    bindText: string;
    setBindAuthor: (author: string) => void;
    setBindText: (text: string) => void;
    bindEditingIdRef: MutableRefObject<Number>;
};

export default function AddNewBindSuggestionDialog(
    props: AddNewBindSuggestionDialogProps
) {
    const steamUserData = useSelector(
        (state: AppState) => state.userDataReducer.userData
    );
    const newBindSuggestionDialogFooter = (
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
                    const newBind = {
                        id: -1,
                        proposedBy: steamUserData!.personaname,
                        author: props.bindAuthor,
                        text: props.bindText,
                    } as BindSuggestionEntry;
                    bindSuggestionsManagingService
                        .addNewBindSuggestion(newBind)
                        .then(() => {
                            notificationManager.SUCCESS(
                                `Successfully suggested new bind`
                            );
                            props.setDialogVisibility(false);
                            props.setBindText('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                `Couldn't suggest the bind: ${error}`
                            );
                        });
                }}
            />
        </>
    );

    return (
        <Dialog
            visible={props.isDialogVisible}
            header="Suggest new bind"
            modal
            className="p-fluid"
            footer={newBindSuggestionDialogFooter}
            onHide={() => props.setDialogVisibility(false)}
        >
            <DialogBindContent
                setBindText={props.setBindText}
                bindText={props.bindText}
                setBindAuthor={props.setBindAuthor}
                bindAuthor={props.bindAuthor}
            />
        </Dialog>
    );
}

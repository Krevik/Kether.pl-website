import { Dialog } from 'primereact/dialog';
import DialogBindContent from './DialogBindContent';
import { MutableRefObject, RefObject } from 'react';
import { Toast } from 'primereact/toast';
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
    notificationToast: RefObject<Toast>;
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
                        proposedBy: steamUserData!.personaname,
                        author: props.bindAuthor,
                        text: props.bindText,
                    } as BindSuggestionEntry;
                    bindSuggestionsManagingService
                        .addBindSuggestion(newBind)
                        .then(() => {
                            notificationManager.SUCCESS(
                                props.notificationToast,
                                `Successfully suggested new bind`
                            );
                            props.setDialogVisibility(false);
                            props.setBindText('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                props.notificationToast,
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

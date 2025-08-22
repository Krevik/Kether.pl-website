import { Dialog } from 'primereact/dialog';
import DialogBindContent from './DialogBindContent';
import { MutableRefObject } from 'react';
import { Button } from 'primereact/button';
import { BindSuggestionEntry } from '../../../models/bindsModels';
import { bindSuggestionsManagingService } from '../../../services/bindSuggestionsManagingService';
import { notificationManager } from '../../../utils/notificationManager';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { useSuggestionsTranslations, useCommonTranslations } from '../../../hooks/useTranslations';

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
    const suggestionsTranslations = useSuggestionsTranslations();
    const commonTranslations = useCommonTranslations();
    
    const newBindSuggestionDialogFooter = (
        <>
            <Button
                label={commonTranslations.cancel}
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => props.setDialogVisibility(false)}
            />
            <Button
                label={commonTranslations.save}
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
                                suggestionsTranslations.successfullySuggested
                            );
                            props.setDialogVisibility(false);
                            props.setBindText('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                `${suggestionsTranslations.couldntAdd}: ${error}`
                            );
                        });
                }}
            />
        </>
    );

    return (
        <Dialog
            visible={props.isDialogVisible}
            header={suggestionsTranslations.addNewSuggestion}
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

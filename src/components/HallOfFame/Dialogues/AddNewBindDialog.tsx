import { Dialog } from 'primereact/dialog';
import DialogBindContent from './DialogBindContent';
import { Button } from 'primereact/button';
import { BindEntry } from '../../../models/bindsModels';
import { bindsManagingService } from '../../../services/bindsManagingService';
import { notificationManager } from '../../../utils/notificationManager';
import { useBindsTranslations, useCommonTranslations } from '../../../hooks/useTranslations';

type AddNewBindDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    bindAuthor: string;
    bindText: string;
    setBindAuthor: (author: string) => void;
    setBindText: (text: string) => void;
};

export default function AddNewBindDialog(props: AddNewBindDialogProps) {
    const bindsTranslations = useBindsTranslations();
    const commonTranslations = useCommonTranslations();
    
    const newBindDialogFooter = (
        <>
            <Button
                label={`❌ ${commonTranslations.cancel}`}
                className="p-button-text"
                onClick={() => props.setDialogVisibility(false)}
            />
            <Button
                label={`✅ ${commonTranslations.save}`}
                className="p-button-text"
                onClick={() => {
                    const newBind = {
                        author: props.bindAuthor,
                        text: props.bindText,
                    } as BindEntry;
                    bindsManagingService
                        .addNewBind(newBind)
                        .then(() => {
                            notificationManager.SUCCESS(
                                bindsTranslations.successfullyAdded
                            );
                            props.setDialogVisibility(false);
                            props.setBindText('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                `${bindsTranslations.couldntAdd}: ${error}`
                            );
                        });
                }}
            />
        </>
    );

    return (
        <Dialog
            visible={props.isDialogVisible}
            header={bindsTranslations.addNewBind}
            modal
            className="p-fluid"
            footer={newBindDialogFooter}
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

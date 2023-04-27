import { Dialog } from 'primereact/dialog';
import DialogBindContent from './DialogBindContent';
import { Button } from 'primereact/button';
import { BindEntry } from '../../../models/bindsModels';
import { bindsManagingService } from '../../../services/bindsManagingService';
import { notificationManager } from '../../../utils/notificationManager';
import { RefObject } from 'react';
import { Toast } from 'primereact/toast';

type AddNewBindDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    bindAuthor: string;
    bindText: string;
    setBindAuthor: (author: string) => void;
    setBindText: (text: string) => void;
    notificationToast: RefObject<Toast>;
};

export default function AddNewBindDialog(props: AddNewBindDialogProps) {
    const newBindDialogFooter = (
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
                    bindsManagingService
                        .addNewBind(props.bindAuthor, props.bindText)
                        .then(() => {
                            notificationManager.SUCCESS(
                                props.notificationToast,
                                `Successfully added new bind`
                            );
                            props.setDialogVisibility(false);
                            props.setBindText('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
                                props.notificationToast,
                                `Couldn't add the bind: ${error}`
                            );
                        });
                }}
            />
        </>
    );

    return (
        <Dialog
            visible={props.isDialogVisible}
            header="Add new Bind"
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

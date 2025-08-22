import { Dialog } from 'primereact/dialog';
import DialogBindContent from './DialogBindContent';
import { Button } from 'primereact/button';
import { BindEntry } from '../../../models/bindsModels';
import { bindsManagingService } from '../../../services/bindsManagingService';
import { notificationManager } from '../../../utils/notificationManager';

type AddNewBindDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    bindAuthor: string;
    bindText: string;
    setBindAuthor: (author: string) => void;
    setBindText: (text: string) => void;
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
                    const newBind = {
                        author: props.bindAuthor,
                        text: props.bindText,
                    } as BindEntry;
                    bindsManagingService
                        .addNewBind(newBind)
                        .then(() => {
                            notificationManager.SUCCESS(
                                `Successfully added new bind`
                            );
                            props.setDialogVisibility(false);
                            props.setBindText('');
                        })
                        .catch((error) => {
                            notificationManager.ERROR(
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

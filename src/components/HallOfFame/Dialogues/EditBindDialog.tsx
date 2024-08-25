import { Dialog } from 'primereact/dialog';
import DialogBindContent from './DialogBindContent';
import { Button } from 'primereact/button';
import { BindEntry } from '../../../models/bindsModels';
import { bindsManagingService } from '../../../services/bindsManagingService';
import { notificationManager } from '../../../utils/notificationManager';
import { MutableRefObject, RefObject } from 'react';
import { Toast } from 'primereact/toast';

type EditBindDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    bindAuthor: string;
    bindText: string;
    setBindAuthor: (author: string) => void;
    setBindText: (text: string) => void;
    bindEditingIdRef: MutableRefObject<Number>;
};

export default function EditBindDialog(props: EditBindDialogProps) {
    const editBindDialogFooter = () => {
        return (
            <>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    className="p-button-text"
                    onClick={() => {
                        props.bindEditingIdRef.current = -1;
                        props.setDialogVisibility(false);
                    }}
                />

                <Button
                    label="Update"
                    icon="pi pi-check"
                    className="p-button-text"
                    onClick={() => {
                        const newBindData = {
                            author: props.bindAuthor,
                            text: props.bindText,
                            id: props.bindEditingIdRef.current,
                        } as BindEntry;
                        bindsManagingService
                            .updateBind(newBindData)
                            .then(() => {
                                notificationManager.SUCCESS(
                                    `Successfully updated the bind`
                                );
                                props.setDialogVisibility(false);
                                props.bindEditingIdRef.current = -1;
                            })
                            .catch((error) => {
                                notificationManager.ERROR(
                                    `Couldn't update the bind: ${error}`
                                );
                            });
                    }}
                />
            </>
        );
    };

    return (
        <Dialog
            visible={props.isDialogVisible}
            header="Edit Bind"
            modal
            className="p-fluid"
            footer={editBindDialogFooter()}
            onHide={() => {
                props.setDialogVisibility(false);
            }}
        >
            <DialogBindContent
                bindAuthor={props.bindAuthor}
                bindText={props.bindText}
                setBindAuthor={props.setBindAuthor}
                setBindText={props.setBindText}
            />
        </Dialog>
    );
}

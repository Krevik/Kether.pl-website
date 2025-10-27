import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

export type Field = {
    fieldName: string;
    fieldValue: string;
    id: number;
};

export type ActionDialogProps = {
    dialogHeader: string;
    actionType: 'ADD' | 'UPDATE';
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    initialData: Field[];
    onSave: (data: Field[]) => void;
};

export const ActionDialog = (props: ActionDialogProps) => {
    const [data, setData] = useState(
        props.actionType === 'ADD' ? props.initialData : []
    );

    const newBindDialogFooter = (
        <>
            <Button
                label="❌ Cancel"
                className="p-button-text"
                onClick={() => props.setDialogVisibility(false)}
            />
            <Button
                label="✅ Save"
                className="p-button-text"
                onClick={() => {
                    props.onSave(data);
                }}
            />
        </>
    );

    const dialogContent = () => {
        const mapField = (field: Field) => {
            return (
                <>
                    <h5>{field.fieldName}</h5>
                    <InputText
                        value={field.fieldValue}
                        onChange={(event) => {
                            field.fieldValue = event.target.value;
                            setData(data);
                        }}
                    />
                </>
            );
        };
        return data.map(mapField);
    };

    return (
        <Dialog
            visible={props.isDialogVisible}
            header={props.dialogHeader}
            modal
            className="p-fluid"
            footer={newBindDialogFooter}
            onHide={() => props.setDialogVisibility(false)}
        >
            {dialogContent()}
        </Dialog>
    );
};

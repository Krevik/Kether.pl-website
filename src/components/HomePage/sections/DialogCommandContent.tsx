import { InputText } from 'primereact/inputtext';

type DialogCommandContentProps = {
    command: string;
    commandDescription: string;
    setCommand: (command: string) => void;
    setCommandDescription: (description: string) => void;
};

export default function DialogCommandContent(props: DialogCommandContentProps) {
    return (
        <>
            <h5>Command</h5>
            <InputText
                value={props.command}
                onChange={(event) => props.setCommand(event.target.value)}
            />
            <h5>Description</h5>
            <InputText
                value={props.commandDescription}
                onChange={(event) =>
                    props.setCommandDescription(event.target.value)
                }
            />
        </>
    );
}

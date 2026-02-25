import { InputText } from 'primereact/inputtext';
import { useCommandsTranslations } from '../../../hooks/useTranslations';

type DialogCommandContentProps = {
    command: string;
    commandDescription: string;
    setCommand: (command: string) => void;
    setCommandDescription: (description: string) => void;
};

export default function DialogCommandContent(props: DialogCommandContentProps) {
    const commandsTranslations = useCommandsTranslations();

    return (
        <>
            <h5>{commandsTranslations.command}</h5>
            <InputText
                className="app-focus-ring"
                value={props.command}
                onChange={(event) => props.setCommand(event.target.value)}
            />
            <h5>{commandsTranslations.description}</h5>
            <InputText
                className="app-focus-ring"
                value={props.commandDescription}
                onChange={(event) =>
                    props.setCommandDescription(event.target.value)
                }
            />
        </>
    );
}

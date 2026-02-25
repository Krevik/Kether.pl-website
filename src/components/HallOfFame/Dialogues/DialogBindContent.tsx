import { InputText } from 'primereact/inputtext';
import { bindUtils } from '../../../utils/bindUtils';
import { useBindsTranslations } from '../../../hooks/useTranslations';

type DialogBindContentProps = {
    bindAuthor: string;
    bindText: string;
    setBindAuthor: (author: string) => void;
    setBindText: (text: string) => void;
};

export default function DialogBindContent(props: DialogBindContentProps) {
    const bindsTranslations = useBindsTranslations();

    return (
        <>
            <h5>{bindsTranslations.author}</h5>
            <InputText
                className="app-focus-ring"
                value={bindUtils.replaceNonEnglishLatinChars(props.bindAuthor)}
                onChange={(event) => props.setBindAuthor(event.target.value)}
            />
            <h5>{bindsTranslations.text}</h5>
            <InputText
                className="app-focus-ring"
                value={bindUtils.replaceNonEnglishLatinChars(props.bindText)}
                onChange={(event) => props.setBindText(event.target.value)}
            />
        </>
    );
}

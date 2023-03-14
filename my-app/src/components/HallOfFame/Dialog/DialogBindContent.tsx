import { InputText } from 'primereact/inputtext';
import { bindUtils } from '../../../utils/bindUtils';

type DialogBindContentProps = {
    bindAuthor: string;
    bindText: string;
    setBindAuthor: (author: string) => void;
    setBindText: (text: string) => void;
};

export default function DialogBindContent(props: DialogBindContentProps) {
    return (
        <>
            <h5>Author</h5>
            <InputText
                value={bindUtils.replaceNonEnglishLatinChars(props.bindAuthor)}
                onChange={(event) => props.setBindAuthor(event.target.value)}
            />
            <h5>Text</h5>
            <InputText
                value={bindUtils.replaceNonEnglishLatinChars(props.bindText)}
                onChange={(event) => props.setBindText(event.target.value)}
            />
        </>
    );
}

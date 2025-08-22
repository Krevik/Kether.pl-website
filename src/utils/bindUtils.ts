import { BindEntry, BindSuggestionEntry } from "../models/bindsModels";

export const trimBindAuthor = (bind: BindEntry | BindSuggestionEntry) => {
    return {
        ...bind,
        author: bind.author.replace(':', '').trim(),
    };
};
export const bindUtils = {
    replaceNonEnglishLatinChars: (text: string): string => {
        const mapping: { [key: string]: string } = {
            // English equivalents
            À: 'A',
            Á: 'A',
            Â: 'A',
            Ã: 'A',
            Ä: 'A',
            Å: 'A',
            Ç: 'C',
            È: 'E',
            É: 'E',
            Ê: 'E',
            Ë: 'E',
            Ì: 'I',
            Í: 'I',
            Î: 'I',
            Ï: 'I',
            Ñ: 'N',
            Ò: 'O',
            Ô: 'O',
            Õ: 'O',
            Ö: 'O',
            O̧: 'O',
            Ù: 'U',
            Ú: 'U',
            Û: 'U',
            Ü: 'U',
            Ý: 'Y',
            à: 'a',
            á: 'a',
            â: 'a',
            ã: 'a',
            ä: 'a',
            å: 'a',
            ç: 'c',
            è: 'e',
            é: 'e',
            ê: 'e',
            ë: 'e',
            ì: 'i',
            í: 'i',
            î: 'i',
            ï: 'i',
            ñ: 'n',
            ò: 'o',
            ô: 'o',
            õ: 'o',
            ö: 'o',
            o̧: 'o',
            ù: 'u',
            ú: 'u',
            û: 'u',
            ü: 'u',
            ý: 'y',

            // Polish equivalents
            Ą: 'A',
            Ć: 'C',
            Ę: 'E',
            Ł: 'L',
            Ń: 'N',
            Ó: 'O',
            Ś: 'S',
            Ź: 'Z',
            Ż: 'Z',
            ą: 'a',
            ć: 'c',
            ę: 'e',
            ł: 'l',
            ń: 'n',
            ó: 'o',
            ś: 's',
            ź: 'z',
            ż: 'z',
        };

        // Normalize text using NFKD, which decomposes characters into base and combining characters
        const normalizedText = text.normalize('NFKD');

        // Remove any remaining combining characters
        const strippedText = normalizedText.replace(/[\u0300-\u036f]/g, '');

        // Replace characters based on the mapping
        return strippedText
            .replace(/[^\u0000-\u007F]/g, (char) => mapping[char] || char)
            .replace(/[:;#*()]/g, '')
            .replace('^', '')
            .replace('%', ' procent');
    },
};

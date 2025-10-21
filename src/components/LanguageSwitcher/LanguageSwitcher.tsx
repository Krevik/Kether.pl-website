import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import './LanguageSwitcher.css';

interface Language {
    code: string;
    name: string;
    flag: string;
}

const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
];

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (language: Language) => {
        i18n.changeLanguage(language.code);
    };

    const languageTemplate = (option: Language) => (
        <div className="language-option">
            <span className="language-flag">{option.flag}</span>
            <span className="language-name">{option.name}</span>
        </div>
    );

    const selectedLanguageTemplate = (option: Language) => (
        <div className="language-option">
            <span className="language-flag">{option.flag}</span>
        </div>
    );

    return (
        <div className="language-switcher">
            <Dropdown
                value={currentLanguage}
                options={languages}
                onChange={(e) => handleLanguageChange(e.value)}
                optionLabel="name"
                itemTemplate={languageTemplate}
                valueTemplate={selectedLanguageTemplate}
                className="language-dropdown"
                panelClassName="language-dropdown-panel"
                showClear={false}
                style={{ backgroundColor: '#000', color: 'white', border: 'none' }}
            />
        </div>
    );
};

export default LanguageSwitcher;

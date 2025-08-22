import { useTranslation } from 'react-i18next';

/**
 * Custom hook for easier translation usage with type safety
 */
export function useTranslations() {
    const { t, i18n } = useTranslation();

    return {
        t,
        i18n,
        currentLanguage: i18n.language,
        changeLanguage: i18n.changeLanguage,
        isLanguage: (lang: string) => i18n.language === lang,
        isEnglish: () => i18n.language === 'en',
        isPolish: () => i18n.language === 'pl',
    };
}

/**
 * Hook for common translations
 */
export function useCommonTranslations() {
    const { t } = useTranslation();
    
    return {
        loading: t('common.loading'),
        error: t('common.error'),
        retry: t('common.retry'),
        cancel: t('common.cancel'),
        save: t('common.save'),
        update: t('common.update'),
        noAvailableOptions: t('common.noAvailableOptions'),
        delete: t('common.delete'),
        edit: t('common.edit'),
        add: t('common.add'),
        close: t('common.close'),
        back: t('common.back'),
        next: t('common.next'),
        previous: t('common.previous'),
        search: t('common.search'),
        filter: t('common.filter'),
        sort: t('common.sort'),
        refresh: t('common.refresh'),
        copy: t('common.copy'),
        share: t('common.share'),
        download: t('common.download'),
        upload: t('common.upload'),
        submit: t('common.submit'),
        confirm: t('common.confirm'),
        yes: t('common.yes'),
        no: t('common.no'),
        ok: t('common.ok'),
    };
}

/**
 * Hook for navigation translations
 */
export function useNavigationTranslations() {
    const { t } = useTranslation();
    
    return {
        home: t('navigation.home'),
        hallOfFame: t('navigation.hallOfFame'),
        hallOfFameSuggestions: t('navigation.hallOfFameSuggestions'),
        githubRepo: t('navigation.githubRepo'),
        donate: t('navigation.donate'),
        loading: {
            home: t('navigation.loading.home'),
            hallOfFame: t('navigation.loading.hallOfFame'),
            suggestions: t('navigation.loading.suggestions'),
            github: t('navigation.loading.github'),
            donate: t('navigation.loading.donate'),
            generic: t('navigation.loading.generic'),
        },
    };
}

/**
 * Hook for error translations
 */
export function useErrorTranslations() {
    const { t } = useTranslation();
    
    return {
        networkError: t('errors.networkError'),
        serverError: t('errors.serverError'),
        notFound: t('errors.notFound'),
        unauthorized: t('errors.unauthorized'),
        forbidden: t('errors.forbidden'),
        timeout: t('errors.timeout'),
        unknown: t('errors.unknown'),
        loadingTimeout: t('errors.loadingTimeout'),
        retryMessage: t('errors.retryMessage'),
    };
}

/**
 * Hook for success translations
 */
export function useSuccessTranslations() {
    const { t } = useTranslation();
    
    return {
        saved: t('success.saved'),
        deleted: t('success.deleted'),
        updated: t('success.updated'),
        added: t('success.added'),
        copied: t('success.copied'),
        downloaded: t('success.downloaded'),
    };
}

/**
 * Hook for server info translations
 */
export function useServerInfoTranslations() {
    const { t } = useTranslation();
    
    return {
        name: t('serverInfo.name'),
        players: t('serverInfo.players'),
        status: t('serverInfo.status'),
        online: t('serverInfo.online'),
        offline: t('serverInfo.offline'),
        map: t('serverInfo.map'),
        joinGame: t('serverInfo.joinGame'),
        nickname: t('serverInfo.nickname'),
        score: t('serverInfo.score'),
        duration: t('serverInfo.duration'),
        bot: t('serverInfo.bot'),
        bots: t('serverInfo.bots'),
        customMapsText: t('serverInfo.customMapsText'),
        here: t('serverInfo.here'),
        noPlayersAvailable: t('serverInfo.noPlayersAvailable'),
    };
}

/**
 * Hook for commands translations
 */
export function useCommandsTranslations() {
    const { t } = useTranslation();
    
    return {
        newCommand: t('commands.newCommand'),
        addNewCommand: t('commands.addNewCommand'),
        editCommand: t('commands.editCommand'),
        addNewCommandTooltip: t('commands.addNewCommandTooltip'),
        successfullyAdded: t('commands.successfullyAdded'),
        couldntAdd: t('commands.couldntAdd'),
        command: t('commands.command'),
        description: t('commands.description'),
        actions: t('commands.actions'),
        editCommandTooltip: t('commands.editCommandTooltip'),
        deleteCommandTooltip: t('commands.deleteCommandTooltip'),
        couldntDelete: t('commands.couldntDelete'),
        noCommandsAvailable: t('commands.noCommandsAvailable'),
    };
}

/**
 * Hook for binds translations
 */
export function useBindsTranslations() {
    const { t } = useTranslation();
    
    return {
        newBind: t('binds.newBind'),
        addNewBind: t('binds.addNewBind'),
        editBind: t('binds.editBind'),
        binds: t('binds.binds'),
        addNewBindTooltip: t('binds.addNewBindTooltip'),
        successfullyAdded: t('binds.successfullyAdded'),
        couldntAdd: t('binds.couldntAdd'),
        author: t('binds.author'),
        text: t('binds.text'),
        databaseId: t('binds.databaseId'),
        actions: t('binds.actions'),
        editBindTooltip: t('binds.editBindTooltip'),
        deleteBindTooltip: t('binds.deleteBindTooltip'),
        couldntDelete: t('binds.couldntDelete'),
        voting: t('binds.voting'),
        upvotes: t('binds.upvotes'),
        downvotes: t('binds.downvotes'),
        noBindsAvailable: t('binds.noBindsAvailable'),
    };
}

/**
 * Hook for suggestions translations
 */
export function useSuggestionsTranslations() {
    const { t } = useTranslation();
    
    return {
        newSuggestion: t('suggestions.newSuggestion'),
        addNewSuggestion: t('suggestions.addNewSuggestion'),
        editSuggestion: t('suggestions.editSuggestion'),
        successfullyAdded: t('suggestions.successfullyAdded'),
        couldntAdd: t('suggestions.couldntAdd'),
        bindSuggestions: t('suggestions.bindSuggestions'),
        suggestBind: t('suggestions.suggestBind'),
        suggestBindTooltip: t('suggestions.suggestBindTooltip'),
        acceptBindTooltip: t('suggestions.acceptBindTooltip'),
        deleteSuggestionTooltip: t('suggestions.deleteSuggestionTooltip'),
        couldntAccept: t('suggestions.couldntAccept'),
        couldntDelete: t('suggestions.couldntDelete'),
        successfullyAccepted: t('suggestions.successfullyAccepted'),
        successfullySuggested: t('suggestions.successfullySuggested'),
        proposedBy: t('suggestions.proposedBy'),
        noSuggestionsAvailable: t('suggestions.noSuggestionsAvailable'),
    };
}

/**
 * Hook for GitHub translations
 */
export function useGithubTranslations() {
    const { t } = useTranslation();
    
    return {
        title: t('github.title'),
        description: t('github.description'),
        here: t('github.here'),
    };
}

/**
 * Hook for donate translations
 */
export function useDonateTranslations() {
    const { t } = useTranslation();
    
    return {
        title: t('donate.title'),
        description: t('donate.description'),
        transfer: t('donate.transfer'),
        bankPLN: t('donate.bankPLN'),
        cryptoBSC: t('donate.cryptoBSC'),
        cryptoBTC: t('donate.cryptoBTC'),
        cryptoPolygon: t('donate.cryptoPolygon'),
        bankPLN2: t('donate.bankPLN2'),
        bankEUR: t('donate.bankEUR'),
        bankGBP: t('donate.bankGBP'),
        blik: t('donate.blik'),
    };
}

/**
 * Hook for footer translations
 */
export function useFooterTranslations() {
    const { t } = useTranslation();
    
    return {
        copyright: t('footer.copyright'),
        discordTooltip: t('footer.discordTooltip'),
        steamTooltip: t('footer.steamTooltip'),
    };
}

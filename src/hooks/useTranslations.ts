import { useTranslation } from 'react-i18next';
import { polishPluralForm } from '../utils/polishPlural';
import { InstallSourceMode } from '../components/InstalledSVMaps/installMapUtils';

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
        installedSVMaps: t('navigation.installedSVMaps'),
        githubRepo: t('navigation.githubRepo'),
        donate: t('navigation.donate'),
        loading: {
            home: t('navigation.loading.home'),
            hallOfFame: t('navigation.loading.hallOfFame'),
            suggestions: t('navigation.loading.suggestions'),
            installedSVMaps: t('navigation.loading.installedSVMaps'),
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

/**
 * Hook for maps translations
 */
export function useMapsTranslations() {
    const { t, i18n } = useTranslation();

    const updatesCountStatus = (
        count: number,
        keys: { one: string; few: string; many: string }
    ) => {
        if (i18n.language.toLowerCase().startsWith('pl')) {
            const form = polishPluralForm(count);
            if (form === 'one') return t(keys.one);
            if (form === 'few') return t(keys.few, { count });
            return t(keys.many, { count });
        }
        return count === 1 ? t(keys.one) : t(keys.many, { count });
    };

    const installInputLabel = (mode: InstallSourceMode) => {
        switch (mode) {
            case 'workshop':
                return t('maps.installInputLabelWorkshop');
            case 'l4d2center':
                return t('maps.installInputLabelL4d2Center');
            default:
                return t('maps.installInputLabelAuto');
        }
    };

    const installInputPlaceholder = (mode: InstallSourceMode) => {
        switch (mode) {
            case 'workshop':
                return t('maps.installInputPlaceholderWorkshop');
            case 'l4d2center':
                return t('maps.installL4d2CenterSelectPlaceholder');
            default:
                return t('maps.installInputPlaceholderAuto');
        }
    };

    const installInputHint = (mode: InstallSourceMode) => {
        switch (mode) {
            case 'workshop':
                return t('maps.installInputHintWorkshop');
            case 'l4d2center':
                return t('maps.installInputHintL4d2Center');
            default:
                return t('maps.installInputHintAuto');
        }
    };

    const installValidationError = (key: string) => t(`maps.${key}`);
    
    return {
        title: t('maps.title'),
        mapName: t('maps.mapName'),
        source: t('maps.source'),
        actions: t('maps.actions'),
        install: t('maps.install'),
        download: t('maps.download'),
        workshop: t('maps.workshop'),
        databaseId: t('maps.databaseId'),
        noMapsAvailable: t('maps.noMapsAvailable'),
        allMaps: t('maps.allMaps'),
        installationHelp: t('maps.installationHelp'),
        installationInstructions: t('maps.installationInstructions'),
        installationDescription: t('maps.installationDescription'),
        windowsPath: t('maps.windowsPath'),
        linuxPath: t('maps.linuxPath'),
        tabWorkshop: t('maps.tabWorkshop'),
        tabSirPlease: t('maps.tabSirPlease'),
        tabL4D2Center: t('maps.tabL4D2Center'),
        tabOther: t('maps.tabOther'),
        tabSuggestions: t('maps.tabSuggestions'),
        mapsSections: t('maps.mapsSections'),
        workshopFileId: t('maps.workshopFileId'),
        openWorkshopPage: t('maps.openWorkshopPage'),
        searchLabel: t('maps.searchLabel'),
        searchPlaceholder: t('maps.searchPlaceholder'),
        searchNoResults: t('maps.searchNoResults'),
        staleListNotice: t('maps.staleListNotice'),
        expandParts: t('maps.expandParts'),
        collapseParts: t('maps.collapseParts'),
        partLabel: (n: number) => t('maps.partLabel', { n }),
        partsCount: (n: number) => t('maps.partsCount', { n }),
        addMap: t('maps.addMap'),
        addMapTooltip: t('maps.addMapTooltip'),
        installSourceLabel: t('maps.installSourceLabel'),
        installSourceAuto: t('maps.installSourceAuto'),
        installSourceWorkshop: t('maps.installSourceWorkshop'),
        installSourceL4d2Center: t('maps.installSourceL4d2Center'),
        installL4d2CenterLoading: t('maps.installL4d2CenterLoading'),
        installL4d2CenterLoadFailed: t('maps.installL4d2CenterLoadFailed'),
        installL4d2CenterSelectPlaceholder: t('maps.installL4d2CenterSelectPlaceholder'),
        installL4d2CenterAlreadyInstalled: t('maps.installL4d2CenterAlreadyInstalled'),
        installInputLabel,
        installInputPlaceholder,
        installInputHint,
        installNameOverride: t('maps.installNameOverride'),
        installNameOverrideHint: t('maps.installNameOverrideHint'),
        installInProgress: t('maps.installInProgress'),
        installSuccess: t('maps.installSuccess'),
        installFailed: t('maps.installFailed'),
        installValidationError,
        manageMap: t('maps.manageMap'),
        manageMapTooltip: t('maps.manageMapTooltip'),
        manageLoading: t('maps.manageLoading'),
        manageNotAvailable: t('maps.manageNotAvailable'),
        manageDetailFilename: t('maps.manageDetailFilename'),
        manageDetailChecksum: t('maps.manageDetailChecksum'),
        manageDetailInstalledAt: t('maps.manageDetailInstalledAt'),
        manageDetailWorkshopUpdatedAt: t('maps.manageDetailWorkshopUpdatedAt'),
        manageCheckUpdate: t('maps.manageCheckUpdate'),
        manageCheckUpdateInProgress: t('maps.manageCheckUpdateInProgress'),
        manageRemoveAddon: t('maps.manageRemoveAddon'),
        manageRemoveInProgress: t('maps.manageRemoveInProgress'),
        manageRemoveConfirm: (name: string) => t('maps.manageRemoveConfirm', { name }),
        manageUpdateResultUpdated: t('maps.manageUpdateResultUpdated'),
        manageUpdateResultUpToDate: t('maps.manageUpdateResultUpToDate'),
        manageUpdateResultUnsupported: t('maps.manageUpdateResultUnsupported'),
        manageUpdateResultFailed: t('maps.manageUpdateResultFailed'),
        manageRemoveSuccess: t('maps.manageRemoveSuccess'),
        manageRemoveFailed: t('maps.manageRemoveFailed'),
        updatesNone: t('maps.updatesNone'),
        updatesAvailableStatus: (count: number) =>
            updatesCountStatus(count, {
                one: 'maps.updatesAvailableOne',
                few: 'maps.updatesAvailableFew',
                many: 'maps.updatesAvailableMany',
            }),
        updatesInProgressStatus: (count: number) =>
            updatesCountStatus(count, {
                one: 'maps.updatesInProgressOne',
                few: 'maps.updatesInProgressFew',
                many: 'maps.updatesInProgressMany',
            }),
        updatesShowDetails: t('maps.updatesShowDetails'),
        updatesDetailsTitle: t('maps.updatesDetailsTitle'),
        updatesSectionAvailable: t('maps.updatesSectionAvailable'),
        updatesSectionInProgress: t('maps.updatesSectionInProgress'),
        updatesEmptySection: t('maps.updatesEmptySection'),
        updatesCheck: t('maps.updatesCheck'),
        updatesCheckInProgress: t('maps.updatesCheckInProgress'),
        updatesCheckFailed: t('maps.updatesCheckFailed'),
        updatesCheckNone: t('maps.updatesCheckNone'),
        updatesCheckFound: (count: number) =>
            updatesCountStatus(count, {
                one: 'maps.updatesCheckFound_one',
                few: 'maps.updatesCheckFound_few',
                many: 'maps.updatesCheckFound_many',
            }),
        updatesUpdate: t('maps.updatesUpdate'),
        updatesUpdateAll: t('maps.updatesUpdateAll'),
        updatesUpdating: t('maps.updatesUpdating'),
        updatesPhaseLabel: (item: {
            name: string;
            phase?: string;
            percent?: number;
            bytesDownloaded?: number;
        }) => {
            const name = item.name;
            if (item.phase === 'downloading') {
                if (typeof item.percent === 'number') {
                    return t('maps.updatesPhaseDownloadingPercent', {
                        name,
                        percent: item.percent,
                    });
                }
                if (typeof item.bytesDownloaded === 'number' && item.bytesDownloaded > 0) {
                    return t('maps.updatesPhaseDownloadingBytes', {
                        name,
                        downloaded: formatDownloadBytes(item.bytesDownloaded),
                    });
                }
                return t('maps.updatesPhaseDownloading', { name });
            }
            if (item.phase === 'extracting') {
                return t('maps.updatesPhaseExtracting', { name });
            }
            if (item.phase === 'installing') {
                return t('maps.updatesPhaseInstalling', { name });
            }
            return t('maps.updatesPhaseGeneric', { name });
        },
        updatesApplySuccess: t('maps.updatesApplySuccess'),
        updatesApplyFailed: t('maps.updatesApplyFailed'),
        updatesSourceWorkshop: t('maps.updatesSourceWorkshop'),
        updatesSourceL4d2Center: t('maps.updatesSourceL4d2Center'),
        suggestMap: t('maps.suggestMap'),
        suggestMapTooltip: t('maps.suggestMapTooltip'),
        suggestSubmit: t('maps.suggestSubmit'),
        suggestSubmitting: t('maps.suggestSubmitting'),
        suggestSuccess: t('maps.suggestSuccess'),
        suggestFailed: t('maps.suggestFailed'),
        suggestLoadFailed: t('maps.suggestLoadFailed'),
        suggestNone: t('maps.suggestNone'),
        suggestProposedBy: t('maps.suggestProposedBy'),
        suggestOpenSource: t('maps.suggestOpenSource'),
        suggestAccept: t('maps.suggestAccept'),
        suggestAccepting: t('maps.suggestAccepting'),
        suggestDeny: t('maps.suggestDeny'),
        suggestDenying: t('maps.suggestDenying'),
        suggestAcceptSuccess: t('maps.suggestAcceptSuccess'),
        suggestAcceptFailed: t('maps.suggestAcceptFailed'),
        suggestDenySuccess: t('maps.suggestDenySuccess'),
        suggestDenyFailed: t('maps.suggestDenyFailed'),
        suggestConflictOtherSource: (name: string, source: string) =>
            t('maps.suggestConflictOtherSource', { name, source }),
    };
}

function formatDownloadBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

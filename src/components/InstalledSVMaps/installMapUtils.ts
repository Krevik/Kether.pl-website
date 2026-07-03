import { extractSteamWorkshopId } from './utils';

export type InstallSourceMode = 'auto' | 'workshop' | 'l4d2center';

export interface InstallMapPayload {
    mode: InstallSourceMode;
    input: string;
    name?: string;
}

export interface ValidateInstallPayloadOptions {
    catalogNames?: string[];
}

function isHttpUrl(input: string): boolean {
    const lower = input.trim().toLowerCase();
    return lower.startsWith('http://') || lower.startsWith('https://');
}

function parseWorkshopId(input: string): string | null {
    const trimmed = input.trim();
    if (/^\d+$/.test(trimmed)) {
        return trimmed;
    }
    return extractSteamWorkshopId(trimmed);
}

export function validateInstallPayload(
    payload: InstallMapPayload,
    options?: ValidateInstallPayloadOptions
): string | null {
    const input = payload.input.trim();
    if (!input) {
        return 'installInputRequired';
    }

    const optionalName = payload.name?.trim();
    if (optionalName && optionalName.length > 255) {
        return 'installNameTooLong';
    }

    switch (payload.mode) {
        case 'workshop':
            return parseWorkshopId(input) ? null : 'installInvalidWorkshopInput';
        case 'l4d2center': {
            if (options?.catalogNames && !options.catalogNames.includes(input)) {
                return 'installInvalidCatalogSelection';
            }
            return input.length > 0 ? null : 'installInputRequired';
        }
        case 'auto':
            if (parseWorkshopId(input) || isHttpUrl(input)) {
                return null;
            }
            return 'installInvalidAutoInput';
        default:
            return 'installInvalidMode';
    }
}

export function buildInstallPayload(
    mode: InstallSourceMode,
    input: string,
    name?: string
): InstallMapPayload {
    const payload: InstallMapPayload = {
        mode,
        input: input.trim(),
    };

    const trimmedName = name?.trim();
    if (trimmedName) {
        payload.name = trimmedName;
    }

    return payload;
}

/** Polish plural categories for cardinal numerals. */
export type PolishPluralForm = 'one' | 'few' | 'many';

export function polishPluralForm(n: number): PolishPluralForm {
    const abs = Math.abs(Math.trunc(n));
    if (abs === 1) {
        return 'one';
    }
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        return 'few';
    }
    return 'many';
}

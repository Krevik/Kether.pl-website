import { describe, expect, it } from 'vitest';
import { polishPluralForm } from './polishPlural';

describe('polishPluralForm', () => {
    it('classifies one, few, and many', () => {
        expect(polishPluralForm(1)).toBe('one');
        expect(polishPluralForm(2)).toBe('few');
        expect(polishPluralForm(4)).toBe('few');
        expect(polishPluralForm(5)).toBe('many');
        expect(polishPluralForm(12)).toBe('many');
        expect(polishPluralForm(22)).toBe('few');
        expect(polishPluralForm(25)).toBe('many');
    });
});

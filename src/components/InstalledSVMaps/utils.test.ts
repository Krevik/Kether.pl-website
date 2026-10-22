import { describe, expect, it } from 'vitest';
import { MapEntry } from './mapEntry';
import { formatMapSize, groupWorkshopMaps, sortMapEntries, totalMapSize } from './utils';

const map = (mapName: string, sizeBytes?: number, workshopId = 0): MapEntry => ({
    mapName,
    source: 'Workshop',
    downloadUrl: workshopId
        ? `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`
        : undefined,
    sizeBytes,
});

describe('map size sorting', () => {
    const maps = [map('Bravo', 300), map('Alpha', undefined), map('Charlie', 100), map('Delta', 300)];

    it('sorts by size ascending and descending, unknown sizes last', () => {
        expect(sortMapEntries(maps, 'size', 'asc').map((m) => m.mapName)).toEqual([
            'Charlie',
            'Bravo',
            'Delta',
            'Alpha',
        ]);
        expect(sortMapEntries(maps, 'size', 'desc').map((m) => m.mapName)).toEqual([
            'Delta',
            'Bravo',
            'Charlie',
            'Alpha',
        ]);
    });

    it('sorts multi-part workshop folders by the total size of their parts', () => {
        const items = groupWorkshopMaps(
            [
                map('Big Campaign Part 1', 400, 11),
                map('Big Campaign Part 2', 400, 12),
                map('Single Map', 700, 13),
                map('Small Map', 50, 14),
            ],
            'size',
            'desc'
        );
        const names = items.map((item) => (item.kind === 'folder' ? item.folderName : item.map.mapName));
        expect(names).toEqual(['Big Campaign', 'Single Map', 'Small Map']);
    });

    it('totals known sizes and formats them', () => {
        expect(totalMapSize([map('a', 10), map('b'), map('c', 5)])).toBe(15);
        expect(totalMapSize([map('a'), map('b')])).toBeUndefined();
        expect(formatMapSize(512)).toBe('512 B');
        expect(formatMapSize(1536)).toBe('1.5 KB');
        expect(formatMapSize(250 * 1024 * 1024)).toBe('250.0 MB');
        expect(formatMapSize(1_288_490_189)).toBe('1.20 GB');
    });
});

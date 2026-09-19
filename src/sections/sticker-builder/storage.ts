import type { StickerDesign, SavedDesignRecord } from './types';

import { DESIGNS_STORAGE_KEY } from './constants';
import { nowIso, cloneDesign } from './utils';

function readAll(): SavedDesignRecord[] {
    try {
        const raw = localStorage.getItem(DESIGNS_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeAll(records: SavedDesignRecord[]): void {
    localStorage.setItem(DESIGNS_STORAGE_KEY, JSON.stringify(records));
}

export function listSavedDesigns(): SavedDesignRecord[] {
    return readAll().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getSavedDesign(id: string): SavedDesignRecord | undefined {
    return readAll().find((record) => record.id === id);
}

export function saveDesign(design: StickerDesign, previewUrl?: string): SavedDesignRecord {
    const records = readAll();
    const nextDesign: StickerDesign = {
        ...cloneDesign(design),
        updatedAt: nowIso(),
        previewUrl: previewUrl || design.previewUrl,
    };

    const record: SavedDesignRecord = {
        id: nextDesign.id,
        name: nextDesign.name,
        createdAt: nextDesign.createdAt,
        updatedAt: nextDesign.updatedAt,
        previewUrl: nextDesign.previewUrl,
        design: nextDesign,
    };

    const index = records.findIndex((item) => item.id === record.id);
    if (index >= 0) {
        records[index] = { ...record, createdAt: records[index].createdAt };
        record.createdAt = records[index].createdAt;
        record.design.createdAt = records[index].createdAt;
    } else {
        records.push(record);
    }

    writeAll(records);
    return record;
}

export function renameSavedDesign(id: string, name: string): SavedDesignRecord | undefined {
    const records = readAll();
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) return undefined;

    const trimmed = name.trim() || 'Untitled sticker';
    records[index] = {
        ...records[index],
        name: trimmed,
        updatedAt: nowIso(),
        design: {
            ...records[index].design,
            name: trimmed,
            updatedAt: nowIso(),
        },
    };
    writeAll(records);
    return records[index];
}

export function deleteSavedDesign(id: string): void {
    writeAll(readAll().filter((record) => record.id !== id));
}

export function duplicateSavedDesign(id: string): SavedDesignRecord | undefined {
    const current = getSavedDesign(id);
    if (!current) return undefined;

    const timestamp = nowIso();
    const copy: StickerDesign = {
        ...cloneDesign(current.design),
        id: `${current.design.id}-copy-${Date.now().toString(36)}`,
        name: `${current.name} copy`,
        createdAt: timestamp,
        updatedAt: timestamp,
    };

    return saveDesign(copy, copy.previewUrl);
}

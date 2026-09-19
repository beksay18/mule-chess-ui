import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import type { Product } from 'src/api/product';

import type {
    AlignMode,
    ShapeKind,
    StickerSpec,
    DesignElement,
    StickerDesign,
    SavedDesignRecord,
} from '../types';

import { GRID_SIZE } from '../constants';
import { getProductLimits, clampDesignToProduct } from '../product-limits';
import { calculatePrice } from '../pricing';
import { renderDesignPreview } from '../renderer';
import {
    saveDesign,
    getSavedDesign,
    listSavedDesigns,
    deleteSavedDesign,
    renameSavedDesign,
    duplicateSavedDesign,
} from '../storage';
import {
    clamp,
    nowIso,
    snapValue,
    cloneDesign,
    getCanvasSize,
    readImageFile,
    applySizeToDesign,
    createEmptyDesign,
    createIconElement,
    createTextElement,
    createEmojiElement,
    createQrElement,
    createImageElement,
    createShapeElement,
    removeImageBackground,
} from '../utils';
import { findQrElement, generateQrDataUrl, getQrPlacement, isQrCodeProduct, isValidQrUrl, normalizeQrUrl } from '../qr';
import { validateDesign } from '../validation';


const MAX_HISTORY = 50;

function snapshotOf(design: StickerDesign): StickerDesign {
    return cloneDesign(design);
}

export function useStickerBuilder(initialDesignId?: string, product: Product | null = null) {
    const [design, setDesign] = useState<StickerDesign>(() => {
        if (initialDesignId) {
            const saved = getSavedDesign(initialDesignId);
            if (saved) return cloneDesign(saved.design);
        }
        return createEmptyDesign();
    });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(0.72);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [savedDesigns, setSavedDesigns] = useState<SavedDesignRecord[]>(() => listSavedDesigns());

    const pastRef = useRef<StickerDesign[]>([]);
    const futureRef = useRef<StickerDesign[]>([]);
    const [historyTick, setHistoryTick] = useState(0);

    const selected = useMemo(
        () => design.elements.find((element) => element.id === selectedId) || null,
        [design.elements, selectedId]
    );

    const limits = useMemo(() => getProductLimits(product), [product]);
    const price = useMemo(() => calculatePrice(design.sticker, product), [design.sticker, product]);
    const validation = useMemo(
        () => validateDesign(design, limits, { requireQr: isQrCodeProduct(product) }),
        [design, limits, product]
    );

    useEffect(() => {
        if (!product) return;
        setDesign((current) => clampDesignToProduct(current, product));
    }, [product]);

    const bumpHistory = () => setHistoryTick((value) => value + 1);

    const pushHistory = useCallback((current: StickerDesign) => {
        pastRef.current = [...pastRef.current, snapshotOf(current)].slice(-MAX_HISTORY);
        futureRef.current = [];
        bumpHistory();
    }, []);

    const commit = useCallback(
        (updater: (current: StickerDesign) => StickerDesign) => {
            setDesign((current) => {
                pushHistory(current);
                const next = updater(cloneDesign(current));
                next.updatedAt = nowIso();
                return next;
            });
        },
        [pushHistory]
    );

    const mutateLive = useCallback((updater: (current: StickerDesign) => StickerDesign) => {
        setDesign((current) => updater(cloneDesign(current)));
    }, []);

    const beginTransform = useCallback(() => {
        pushHistory(design);
    }, [design, pushHistory]);

    const addElement = useCallback(
        (element: DesignElement) => {
            commit((current) => ({
                ...current,
                elements: [...current.elements, element],
            }));
            setSelectedId(element.id);
            return element.id;
        },
        [commit]
    );

    const addText = useCallback(
        (content?: string) => {
            const element = createTextElement(design.width, design.height);
            if (content?.trim()) {
                element.content = content.trim();
                element.name = content.trim().slice(0, 24);
            }
            addElement(element);
        },
        [addElement, design.height, design.width]
    );

    const addEmoji = useCallback(
        (emoji: string) => {
            addElement(createEmojiElement(emoji, design.width, design.height));
        },
        [addElement, design.height, design.width]
    );

    const addShape = useCallback(
        (shape: ShapeKind) => {
            addElement(createShapeElement(shape, design.width, design.height));
        },
        [addElement, design.height, design.width]
    );

    const addIcon = useCallback(
        (iconId: string) => {
            addElement(createIconElement(iconId, design.width, design.height));
        },
        [addElement, design.height, design.width]
    );

    const addImageFile = useCallback(
        async (file: File) => {
            const image = await readImageFile(file);
            addElement(createImageElement(image.src, design.width, design.height, image.width, image.height));
        },
        [addElement, design.height, design.width]
    );

    const applyQrLink = useCallback(
        async (rawUrl: string) => {
            const url = normalizeQrUrl(rawUrl);
            if (!isValidQrUrl(url)) {
                throw new Error('Enter a valid link for the QR code.');
            }

            const src = await generateQrDataUrl(url);
            const existing = findQrElement(design);

            if (existing) {
                commit((current) => ({
                    ...current,
                    sticker: { ...current.sticker, qrUrl: url },
                    elements: current.elements.map((element) =>
                        element.id === existing.id
                            ? {
                                  ...element,
                                  src,
                                  qrUrl: url,
                                  purpose: 'qr',
                                  processedSrc: undefined,
                                  backgroundRemoved: false,
                              }
                            : element
                    ),
                }));
                setSelectedId(existing.id);
                return existing.id;
            }

            const placement = getQrPlacement(design);
            const qr = createQrElement(src, url, placement.x, placement.y, placement.size);
            commit((current) => {
                if (findQrElement(current)) {
                    return {
                        ...current,
                        sticker: { ...current.sticker, qrUrl: url },
                        elements: current.elements.map((element) =>
                            element.type === 'image' && element.purpose === 'qr'
                                ? { ...element, src, qrUrl: url, processedSrc: undefined, backgroundRemoved: false }
                                : element
                        ),
                    };
                }

                return {
                    ...current,
                    sticker: { ...current.sticker, qrUrl: url },
                    elements: [
                        ...current.elements.map((element) => ({
                            ...element,
                            x: element.x + placement.shift.dx,
                            y: element.y + placement.shift.dy,
                        })),
                        qr,
                    ],
                };
            });
            setSelectedId(qr.id);
            return qr.id;
        },
        [commit, design]
    );

    const updateElement = useCallback(
        (id: string, patch: Partial<DesignElement>, recordHistory = true) => {
            const apply = (current: StickerDesign): StickerDesign => ({
                ...current,
                updatedAt: nowIso(),
                elements: current.elements.map((element) =>
                    element.id === id ? ({ ...element, ...patch } as DesignElement) : element
                ),
            });

            if (recordHistory) commit(apply);
            else mutateLive(apply);
        },
        [commit, mutateLive]
    );

    const updateSelected = useCallback(
        (patch: Partial<DesignElement>, recordHistory = true) => {
            if (!selectedId) return;
            updateElement(selectedId, patch, recordHistory);
        },
        [selectedId, updateElement]
    );

    const deleteSelected = useCallback(() => {
        if (!selectedId) return;
        const target = design.elements.find((element) => element.id === selectedId);
        if (target?.locked) return;
        commit((current) => ({
            ...current,
            elements: current.elements.filter((element) => element.id !== selectedId),
        }));
        setSelectedId(null);
        setEditingTextId(null);
    }, [commit, design.elements, selectedId]);

    const duplicateSelected = useCallback(() => {
        if (!selected) return;
        const copy: DesignElement = {
            ...cloneDesign({ ...createEmptyDesign(), elements: [selected] }).elements[0],
            id: `${selected.id}-copy-${Date.now().toString(36)}`,
            x: selected.x + 24,
            y: selected.y + 24,
            locked: false,
            name: `${selected.name} copy`,
        };
        addElement(copy);
    }, [addElement, selected]);

    const toggleLock = useCallback(
        (id?: string) => {
            const targetId = id || selectedId;
            if (!targetId) return;
            const target = design.elements.find((element) => element.id === targetId);
            if (!target) return;
            updateElement(targetId, { locked: !target.locked });
        },
        [design.elements, selectedId, updateElement]
    );

    const reorderLayers = useCallback(
        (fromIndex: number, toIndex: number) => {
            commit((current) => {
                const next = [...current.elements];
                const [moved] = next.splice(fromIndex, 1);
                next.splice(toIndex, 0, moved);
                return { ...current, elements: next };
            });
        },
        [commit]
    );

    const bringForward = useCallback(() => {
        if (!selectedId) return;
        const index = design.elements.findIndex((element) => element.id === selectedId);
        if (index < 0 || index >= design.elements.length - 1) return;
        reorderLayers(index, index + 1);
    }, [design.elements, reorderLayers, selectedId]);

    const sendBackward = useCallback(() => {
        if (!selectedId) return;
        const index = design.elements.findIndex((element) => element.id === selectedId);
        if (index <= 0) return;
        reorderLayers(index, index - 1);
    }, [design.elements, reorderLayers, selectedId]);

    const alignSelected = useCallback(
        (mode: AlignMode) => {
            if (!selected || selected.locked) return;
            const patch: Partial<DesignElement> = {};
            if (mode === 'left') patch.x = 0;
            if (mode === 'center') patch.x = (design.width - selected.width) / 2;
            if (mode === 'right') patch.x = design.width - selected.width;
            if (mode === 'top') patch.y = 0;
            if (mode === 'middle') patch.y = (design.height - selected.height) / 2;
            if (mode === 'bottom') patch.y = design.height - selected.height;
            updateElement(selected.id, patch);
        },
        [design.height, design.width, selected, updateElement]
    );

    const updateSticker = useCallback(
        (patch: Partial<StickerSpec>) => {
            commit((current) => {
                const sticker = { ...current.sticker, ...patch };
                const maxWidth = limits?.maxWidth ?? 12;
                const maxHeight = limits?.maxHeight ?? 12;
                const maxQuantity = limits?.maxQuantity ?? 1000;
                if (sticker.customWidth != null) {
                    sticker.customWidth = clamp(sticker.customWidth, 0.5, maxWidth);
                }
                if (sticker.customHeight != null) {
                    sticker.customHeight = clamp(sticker.customHeight, 0.5, maxHeight);
                }
                sticker.quantity = clamp(sticker.quantity, 1, maxQuantity);
                let next = { ...current, sticker };
                if (patch.size || patch.customWidth || patch.customHeight) {
                    next = applySizeToDesign({ ...next, sticker }, sticker.size);
                    next.sticker = sticker;
                    const canvas = getCanvasSize(sticker);
                    next.width = canvas.width;
                    next.height = canvas.height;
                }
                return next;
            });
        },
        [commit, limits]
    );

    const resetDesign = useCallback(() => {
        const empty = createEmptyDesign(design.name);
        empty.id = design.id;
        empty.createdAt = design.createdAt;
        commit(() => empty);
        setSelectedId(null);
        setEditingTextId(null);
    }, [commit, design.createdAt, design.id, design.name]);

    const undo = useCallback(() => {
        const previous = pastRef.current[pastRef.current.length - 1];
        if (!previous) return;
        pastRef.current = pastRef.current.slice(0, -1);
        futureRef.current = [snapshotOf(design), ...futureRef.current];
        setDesign(previous);
        bumpHistory();
    }, [design]);

    const redo = useCallback(() => {
        const next = futureRef.current[0];
        if (!next) return;
        futureRef.current = futureRef.current.slice(1);
        pastRef.current = [...pastRef.current, snapshotOf(design)];
        setDesign(next);
        bumpHistory();
    }, [design]);

    const persistDesign = useCallback(
        async (name?: string) => {
            const previewUrl = await renderDesignPreview(design, { maxSide: 400, shadow: true });
            const next = {
                ...design,
                name: (name ?? design.name).trim() || 'Untitled sticker',
                previewUrl,
            };
            const record = saveDesign(next, previewUrl);
            setDesign((current) => ({ ...current, name: record.name, previewUrl, updatedAt: record.updatedAt }));
            setSavedDesigns(listSavedDesigns());
            return record;
        },
        [design]
    );

    const loadDesign = useCallback((id: string) => {
        const record = getSavedDesign(id);
        if (!record) return;
        setDesign(cloneDesign(record.design));
        setSelectedId(null);
        setEditingTextId(null);
        pastRef.current = [];
        futureRef.current = [];
        bumpHistory();
    }, []);

    const renameDesign = useCallback((name: string, id?: string) => {
        const targetId = id || design.id;
        if (targetId === design.id) {
            setDesign((current) => ({ ...current, name, updatedAt: nowIso() }));
        }
        renameSavedDesign(targetId, name);
        setSavedDesigns(listSavedDesigns());
    }, [design.id]);

    const removeDesign = useCallback(
        (id: string) => {
            deleteSavedDesign(id);
            setSavedDesigns(listSavedDesigns());
            if (id === design.id) {
                const empty = createEmptyDesign();
                setDesign(empty);
                setSelectedId(null);
            }
        },
        [design.id]
    );

    const duplicateDesign = useCallback((id: string) => {
        const copy = duplicateSavedDesign(id);
        setSavedDesigns(listSavedDesigns());
        return copy;
    }, []);

    const startNewDesign = useCallback(() => {
        setDesign(createEmptyDesign());
        setSelectedId(null);
        setEditingTextId(null);
        pastRef.current = [];
        futureRef.current = [];
        bumpHistory();
    }, []);

    const stripBackground = useCallback(async () => {
        if (!selected || selected.type !== 'image') return;
        const processedSrc = await removeImageBackground(selected.src);
        updateElement(selected.id, { processedSrc, backgroundRemoved: true });
    }, [selected, updateElement]);

    const generatePreview = useCallback(
        (shadow = true) => renderDesignPreview(design, { maxSide: 720, shadow }),
        [design]
    );

    const snapIfNeeded = useCallback(
        (value: number) => snapValue(value, GRID_SIZE, snapToGrid),
        [snapToGrid]
    );

    return {
        design,
        selected,
        selectedId,
        setSelectedId,
        zoom,
        setZoom,
        snapToGrid,
        setSnapToGrid,
        editingTextId,
        setEditingTextId,
        savedDesigns,
        limits,
        price,
        validation,
        canUndo: pastRef.current.length > 0,
        canRedo: futureRef.current.length > 0,
        historyTick,
        addText,
        addEmoji,
        addShape,
        addIcon,
        addImageFile,
        applyQrLink,
        updateElement,
        updateSelected,
        deleteSelected,
        duplicateSelected,
        toggleLock,
        reorderLayers,
        bringForward,
        sendBackward,
        alignSelected,
        updateSticker,
        resetDesign,
        undo,
        redo,
        persistDesign,
        loadDesign,
        renameDesign,
        removeDesign,
        duplicateDesign,
        startNewDesign,
        stripBackground,
        generatePreview,
        beginTransform,
        snapIfNeeded,
        mutateLive,
        commit,
    };
}

export type StickerBuilderApi = ReturnType<typeof useStickerBuilder>;

import { useEffect } from 'react';

import type { StickerBuilderApi } from './use-sticker-builder';

export function useKeyboardShortcuts(api: StickerBuilderApi) {
    const {
        selected,
        editingTextId,
        deleteSelected,
        duplicateSelected,
        undo,
        redo,
        persistDesign,
        setSelectedId,
        setEditingTextId,
        updateElement,
        snapIfNeeded,
    } = api;

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const typing =
                target &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable ||
                    Boolean(editingTextId));

            const meta = event.metaKey || event.ctrlKey;

            if (meta && event.key.toLowerCase() === 'z') {
                event.preventDefault();
                if (event.shiftKey) redo();
                else undo();
                return;
            }

            if (meta && event.key.toLowerCase() === 's') {
                event.preventDefault();
                void persistDesign();
                return;
            }

            if (typing) return;

            if (meta && event.key.toLowerCase() === 'd') {
                event.preventDefault();
                duplicateSelected();
                return;
            }

            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                deleteSelected();
                return;
            }

            if (event.key === 'Escape') {
                setSelectedId(null);
                setEditingTextId(null);
                return;
            }

            if (!selected || selected.locked) return;

            const step = event.shiftKey ? 10 : 1;
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                updateElement(selected.id, { x: snapIfNeeded(selected.x - step) });
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                updateElement(selected.id, { x: snapIfNeeded(selected.x + step) });
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                updateElement(selected.id, { y: snapIfNeeded(selected.y - step) });
            }
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                updateElement(selected.id, { y: snapIfNeeded(selected.y + step) });
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [
        deleteSelected,
        duplicateSelected,
        editingTextId,
        persistDesign,
        redo,
        selected,
        setEditingTextId,
        setSelectedId,
        snapIfNeeded,
        undo,
        updateElement,
    ]);
}

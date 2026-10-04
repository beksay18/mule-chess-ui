import type { CartItem } from './cart-context';

const DB_NAME = 'cg-sticker-cart';
const STORE = 'cart';
const KEY = 'items';
const LOCAL_KEY = 'cart';

function withoutLiveFiles(items: CartItem[]): CartItem[] {
    return items.map(({ artworkFiles: _artworkFiles, ...item }) => item);
}

function withoutHeavyArtwork(items: CartItem[]): CartItem[] {
    return items.map((item) => ({
        ...item,
        artworkFiles: undefined,
        serializedArtworkFiles: undefined,
        designJson: undefined,
        previewUrl: item.previewUrl?.startsWith('data:') ? undefined : item.previewUrl,
        imageUrl: item.imageUrl?.startsWith('data:') ? undefined : item.imageUrl,
    }));
}

export function readLocalCart(): CartItem[] {
    try {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains(STORE)) {
                request.result.createObjectStore(STORE);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function readStoredCart(): Promise<CartItem[] | null> {
    try {
        const db = await openDb();
        const stored = await new Promise<CartItem[] | undefined>((resolve, reject) => {
            const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(KEY);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        db.close();
        return Array.isArray(stored) ? stored : null;
    } catch {
        return null;
    }
}

function writeLocalCart(items: CartItem[]) {
    const payload = JSON.stringify(withoutLiveFiles(items));
    try {
        localStorage.setItem(LOCAL_KEY, payload);
        return;
    } catch {
        // The full cart is larger than localStorage allows.
    }

    try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(withoutHeavyArtwork(items)));
    } catch {
        try {
            localStorage.removeItem(LOCAL_KEY);
        } catch {
            // Ignore a second storage failure so the page keeps running.
        }
    }
}

export async function writeStoredCart(items: CartItem[]): Promise<void> {
    const persistable = withoutLiveFiles(items);

    try {
        const db = await openDb();
        await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(STORE, 'readwrite');
            transaction.objectStore(STORE).put(persistable, KEY);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
        db.close();
        try {
            localStorage.removeItem(LOCAL_KEY);
        } catch {
            // The cart is already in IndexedDB.
        }
    } catch {
        writeLocalCart(persistable);
    }
}

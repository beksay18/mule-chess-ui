const ALLOWED_TAGS = new Set([
    'P',
    'BR',
    'STRONG',
    'B',
    'EM',
    'I',
    'U',
    'S',
    'H2',
    'H3',
    'H4',
    'UL',
    'OL',
    'LI',
    'BLOCKQUOTE',
    'A',
    'DIV',
]);

export function articlePlainText(value: string) {
    return value
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, ' ')
        .trim();
}

export function articleExcerpt(value: string, max = 220) {
    const text = articlePlainText(value);
    if (text.length <= max) {
        return text;
    }
    return `${text.slice(0, max).trimEnd()}…`;
}

export function looksLikeHtml(value: string) {
    return /<\/?[a-z][\s\S]*>/i.test(value);
}

function escapeHtml(value: string) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function toEditorHtml(value: string) {
    if (!value.trim()) {
        return '<p></p>';
    }
    if (looksLikeHtml(value)) {
        return value;
    }
    return value
        .split(/\n{2,}/)
        .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
        .join('');
}

export function sanitizeArticleHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const root = document.createElement('div');
    doc.body.childNodes.forEach((child) => {
        const next = cleanNode(child);
        if (next) {
            root.appendChild(next);
        }
    });
    return root.innerHTML;
}

function cleanNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.cloneNode();
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const element = node as HTMLElement;
    if (!ALLOWED_TAGS.has(element.tagName)) {
        const fragment = document.createDocumentFragment();
        element.childNodes.forEach((child) => {
            const next = cleanNode(child);
            if (next) {
                fragment.appendChild(next);
            }
        });
        return fragment;
    }

    const clean = document.createElement(element.tagName.toLowerCase());
    if (element.tagName === 'A') {
        const href = element.getAttribute('href') || '';
        if (/^(https?:|mailto:|\/)/i.test(href)) {
            clean.setAttribute('href', href);
            clean.setAttribute('target', '_blank');
            clean.setAttribute('rel', 'noopener noreferrer');
        }
    }

    element.childNodes.forEach((child) => {
        const next = cleanNode(child);
        if (next) {
            clean.appendChild(next);
        }
    });
    return clean;
}

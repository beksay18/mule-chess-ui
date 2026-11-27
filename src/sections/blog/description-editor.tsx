import { useRef, useEffect, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LinkIcon from '@mui/icons-material/Link';
import { alpha } from '@mui/material/styles';
import { toEditorHtml, articlePlainText } from './article-html';

const BRAND_BLUE = '#175195';

type DescriptionEditorProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    caption?: string;
    required?: boolean;
    error?: string;
};

type Tool = {
    label: string;
    text?: string;
    icon?: ReactNode;
    command: string;
    arg?: string;
};

const TOOLS: Tool[] = [
    { label: 'Heading', text: 'H2', command: 'formatBlock', arg: '<h2>' },
    { label: 'Subheading', text: 'H3', command: 'formatBlock', arg: '<h3>' },
    { label: 'Bold', icon: <FormatBoldIcon fontSize="small" />, command: 'bold' },
    { label: 'Italic', icon: <FormatItalicIcon fontSize="small" />, command: 'italic' },
    { label: 'Underline', icon: <FormatUnderlinedIcon fontSize="small" />, command: 'underline' },
    { label: 'Bulleted list', icon: <FormatListBulletedIcon fontSize="small" />, command: 'insertUnorderedList' },
    { label: 'Numbered list', icon: <FormatListNumberedIcon fontSize="small" />, command: 'insertOrderedList' },
    { label: 'Quote', icon: <FormatQuoteIcon fontSize="small" />, command: 'formatBlock', arg: '<blockquote>' },
];

const bodySx = {
    '& h2': { fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.3, mt: 3, mb: 1 },
    '& h3': { fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.35, mt: 2.5, mb: 1 },
    '& p': { fontSize: '1.0625rem', lineHeight: 1.75, my: 1.25 },
    '& ul, & ol': { pl: 3, my: 1.25 },
    '& li': { lineHeight: 1.7, mb: 0.5 },
    '& blockquote': {
        borderLeft: `3px solid ${BRAND_BLUE}`,
        pl: 2,
        my: 2,
        color: 'text.secondary',
    },
    '& a': { color: BRAND_BLUE },
};

export function DescriptionEditor({
    value,
    onChange,
    label = 'Article',
    placeholder = 'Write the full article. Headings, lists, quotes, and links are available above.',
    caption = 'This is the full article visitors will read. It can be as long as you need.',
    required = false,
    error,
}: DescriptionEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const ready = useRef(false);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || ready.current) {
            return undefined;
        }
        editor.innerHTML = toEditorHtml(value);
        ready.current = true;
        return undefined;
    }, [value]);

    const emit = () => {
        onChange(editorRef.current?.innerHTML || '');
    };

    const run = (command: string, arg?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, arg);
        emit();
    };

    const addLink = () => {
        const url = window.prompt('Link address', 'https://');
        if (!url) {
            return;
        }
        run('createLink', url);
    };

    const empty = articlePlainText(value).length === 0;

    return (
        <Box id={error !== undefined || required ? 'tournament-description' : undefined}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', mb: 1 }}>
                {label}
                {required && (
                    <Box component="span" sx={{ color: '#d32f2f', ml: 0.4 }}>*</Box>
                )}
            </Typography>
            {error && (
                <Typography sx={{ color: '#d32f2f', fontSize: 12, fontWeight: 700, mb: 0.75, lineHeight: 1.4 }}>
                    <Box component="span" sx={{ mr: 0.4 }}>*</Box>
                    {error}
                </Typography>
            )}
            <Stack
                direction="row"
                spacing={0.5}
                flexWrap="wrap"
                useFlexGap
                sx={{
                    p: 0.75,
                    mb: 0,
                    border: `1px solid ${error ? '#d32f2f' : alpha(BRAND_BLUE, 0.2)}`,
                    borderBottom: 'none',
                    borderRadius: '10px 10px 0 0',
                    bgcolor: alpha(BRAND_BLUE, 0.03),
                }}
            >
                {TOOLS.map((tool) => (
                    <Box
                        key={tool.label}
                        component="button"
                        type="button"
                        aria-label={tool.label}
                        title={tool.label}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => run(tool.command, tool.arg)}
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 36,
                            height: 36,
                            px: tool.icon ? 0 : 1,
                            border: 0,
                            borderRadius: 1,
                            bgcolor: 'transparent',
                            color: BRAND_BLUE,
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: alpha(BRAND_BLUE, 0.08) },
                        }}
                    >
                        {tool.icon ?? tool.text}
                    </Box>
                ))}
                <Box
                    component="button"
                    type="button"
                    aria-label="Link"
                    title="Link"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={addLink}
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        border: 0,
                        borderRadius: 1,
                        bgcolor: 'transparent',
                        color: BRAND_BLUE,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: alpha(BRAND_BLUE, 0.08) },
                    }}
                >
                    <LinkIcon fontSize="small" />
                </Box>
            </Stack>
            <Box sx={{ position: 'relative' }}>
                {empty && (
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            color: 'text.disabled',
                            pointerEvents: 'none',
                        }}
                    >
                        {placeholder}
                    </Typography>
                )}
                <Box
                    ref={editorRef}
                    contentEditable
                    role="textbox"
                    aria-label={label}
                    aria-multiline="true"
                    onInput={emit}
                    sx={{
                        minHeight: 420,
                        p: 2,
                        border: `1px solid ${error ? '#d32f2f' : alpha(BRAND_BLUE, 0.2)}`,
                        borderRadius: '0 0 10px 10px',
                        outline: 'none',
                        bgcolor: '#ffffff',
                        '&:focus': { borderColor: error ? '#d32f2f' : BRAND_BLUE },
                        ...bodySx,
                    }}
                />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                {caption}
            </Typography>
        </Box>
    );
}

export const articleBodySx = bodySx;

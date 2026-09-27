import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { alpha } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import {
    BLOG_CATEGORIES,
    BlogCategory,
    blogCoverSrc,
    BlogPostRequest,
    createBlogPost,
    getBlogPost,
    updateBlogPost,
} from 'src/api/blog';
import { DashboardContent } from 'src/layouts/dashboard';
import { articlePlainText } from './article-html';
import { DescriptionEditor } from './description-editor';

const BRAND_BLUE = '#175195';

const today = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
};

const messageFrom = (err: unknown) => {
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
    return message || 'Could not save the article.';
};

export default function BlogForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<BlogCategory>('Design tips');
    const [readTime, setReadTime] = useState('4');
    const [postedAt, setPostedAt] = useState(today());
    const [published, setPublished] = useState(true);
    const [coverUrl, setCoverUrl] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit || !id) {
            return undefined;
        }
        let active = true;
        setLoading(true);
        getBlogPost(Number(id))
            .then((post) => {
                if (!active) return;
                setTitle(post.title);
                setDescription(post.description);
                setCategory(post.category);
                setReadTime(String(post.readTime));
                setPostedAt(post.postedAt?.slice(0, 10) || today());
                setPublished(post.published);
                setCoverUrl(post.coverUrl || '');
            })
            .catch((err) => {
                console.error('Failed to load blog post', err);
                if (active) setError('Could not load this article.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [id, isEdit]);

    useEffect(() => {
        if (!image) {
            setPreviewUrl('');
            return undefined;
        }
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleSubmit = async () => {
        const minutes = Number(readTime);
        if (!title.trim() || !articlePlainText(description) || !postedAt || !Number.isFinite(minutes) || minutes < 1) {
            setError('Fill in the title, article, category, read time, and date.');
            return;
        }
        if (!isEdit && !image) {
            setError('Cover image is required.');
            return;
        }

        const payload: BlogPostRequest = {
            title: title.trim(),
            description: description.trim(),
            category,
            readTime: minutes,
            postedAt,
            published,
            image,
        };

        try {
            setSaving(true);
            setError('');
            if (isEdit && id) {
                await updateBlogPost(Number(id), payload);
            } else {
                await createBlogPost(payload);
            }
            navigate('/blog-posts');
        } catch (err) {
            console.error('Failed to save blog post', err);
            setError(messageFrom(err));
        } finally {
            setSaving(false);
        }
    };

    const displayUrl = previewUrl || blogCoverSrc(coverUrl);

    return (
        <DashboardContent maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 3 }}>
                {isEdit ? 'Edit article' : 'New article'}
            </Typography>
            <Card sx={{ p: 3 }}>
                {loading ? (
                    <Typography color="text.secondary">Loading article…</Typography>
                ) : (
                    <Stack spacing={2.5}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                        />
                        <DescriptionEditor value={description} onChange={setDescription} />
                        <TextField
                            select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as BlogCategory)}
                            fullWidth
                            required
                        >
                            {BLOG_CATEGORIES.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="Read time (minutes)"
                                type="number"
                                value={readTime}
                                onChange={(e) => setReadTime(e.target.value)}
                                slotProps={{ htmlInput: { min: 1 } }}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Posted on"
                                type="date"
                                value={postedAt}
                                onChange={(e) => setPostedAt(e.target.value)}
                                fullWidth
                                required
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Stack>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                />
                            }
                            label={published ? 'Published on the public blog' : 'Draft — hidden from the public blog'}
                        />
                        <Box>
                            {displayUrl ? (
                                <Box
                                    component="img"
                                    src={displayUrl}
                                    alt=""
                                    sx={{
                                        width: '100%',
                                        maxHeight: 220,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        mb: 1.5,
                                    }}
                                />
                            ) : null}
                            <Box
                                component="label"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    border: `2px dashed ${alpha(BRAND_BLUE, 0.25)}`,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: alpha(BRAND_BLUE, 0.04) },
                                }}
                            >
                                <CloudUploadOutlinedIcon sx={{ color: alpha(BRAND_BLUE, 0.7) }} />
                                <Typography sx={{ fontWeight: 600, color: BRAND_BLUE }}>
                                    {displayUrl ? 'Replace cover image' : 'Upload cover image'}
                                </Typography>
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                                {image ? `New file selected: ${image.name}` : 'JPG, PNG, or WebP. Required for a new article.'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="outlined" onClick={() => navigate('/blog-posts')} disabled={saving}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={handleSubmit} disabled={saving}>
                                {isEdit ? 'Save article' : 'Create article'}
                            </Button>
                        </Box>
                    </Stack>
                )}
            </Card>
        </DashboardContent>
    );
}

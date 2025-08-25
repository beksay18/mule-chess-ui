// components/reviews/ProductReviews.tsx
import { useEffect, useMemo, useState } from "react";
import {
    Box, Button, Divider, Rating, Stack, TextField, Typography, CircularProgress, Pagination
} from "@mui/material";
import dayjs from "dayjs";
import {createReview, getProductReviews, getProductReviewSummary, ProductReviewContent} from "../../../../api/reviews";

type Props = {
    productId: number;
    productName?: string;
    currentUserId: number;
};

const labels: Record<number, string> = {
    1: "Terrible",
    2: "Bad",
    3: "Okay",
    4: "Great",
    5: "Perfect",
};

export default function ProductReviews({ productId, productName, currentUserId }: Props) {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [rows, setRows] = useState<ProductReviewContent[]>([]);
    const [loading, setLoading] = useState(true);

    const [summaryLoading, setSummaryLoading] = useState(true);
    const [avg, setAvg] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [againPct, setAgainPct] = useState<number>(0);

    const [rating, setRating] = useState<number | null>(5);
    const [hover, setHover] = useState(-1);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [saving, setSaving] = useState(false);
    const ratingLabel = useMemo(
        () => (hover !== -1 ? labels[hover] : labels[rating ?? 0] ?? ""),
        [hover, rating]
    );

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await getProductReviews({
                    page: page - 1,
                    size,
                    filter: `productId==${productId}`,
                });
                if (cancelled) return;
                setRows(data.content || []);
                setTotalPages(data.totalPages || 1);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [page, size, productId]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setSummaryLoading(true);
                const s = await getProductReviewSummary(productId);
                if (cancelled) return;
                setAvg(s.averageRating ?? 0);
                setTotal(s.totalReviews ?? 0);
                setAgainPct(s.wouldOrderAgainPct ?? 0);
            } catch {
                if (!cancelled) {
                    setAvg(0);
                    setTotal(0);
                    setAgainPct(0);
                }
                console.warn("Failed to load review summary");
            } finally {
                if (!cancelled) setSummaryLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [productId]);

    async function onSave() {
        if (!rating || !desc.trim()) return;
        setSaving(true);
        try {
            await createReview({
                title: title.trim(),
                description: desc.trim(),
                rating,
                productId,
                userId: currentUserId,
                isActive: true,
            });
            setTitle("");
            setDesc("");
            setRating(5);
            setPage(1);
            const [list, s] = await Promise.all([
                getProductReviews({ page: 0, size, filter: `productId==${productId}` }),
                getProductReviewSummary(productId),
            ]);
            setRows(list.content || []);
            setTotalPages(list.totalPages || 1);
            setAvg(s.averageRating ?? 0);
            setTotal(s.totalReviews ?? 0);
            setAgainPct(s.wouldOrderAgainPct ?? 0);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Stack spacing={3}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                    Reviews for {productName ?? "this product"}
                </Typography>
            </Box>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={4}
                sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
            >
                <SummaryItem
                    loading={summaryLoading}
                    headline={avg ? `${avg.toFixed(2)} / 5` : "—"}
                    sub="Average rating"
                />
                <SummaryItem loading={summaryLoading} headline={`${total}`} sub="Total reviews" />
                <SummaryItem
                    loading={summaryLoading}
                    headline={againPct ? `${againPct}%` : "—"}
                    sub="Would order again"
                />
            </Stack>

            <Divider />

            <Box sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6">How would you rate this product?</Typography>
                        <Rating
                            value={rating}
                            onChange={(_, v) => setRating(v)}
                            onChangeActive={(_, v) => setHover(v ?? -1)}
                        />
                        <Typography color="text.secondary">{ratingLabel}</Typography>
                    </Stack>

                    <TextField
                        label="Title (optional)"
                        placeholder="What is the title of your review?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Review *"
                        placeholder="Tell us what you think of this product…"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        fullWidth
                        multiline
                        minRows={4}
                        required
                    />

                    <Box>
                        <Button
                            variant="contained"
                            onClick={onSave}
                            disabled={saving || !rating || !desc.trim()}
                        >
                            {saving ? "Saving…" : "Save Review"}
                        </Button>
                    </Box>
                </Stack>
            </Box>

            {/* List */}
            <Stack spacing={2}>
                {loading ? (
                    <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : rows.length === 0 ? (
                    <Typography color="text.secondary">No reviews yet—be the first!</Typography>
                ) : (
                    <Stack spacing={2}>
                        {rows.map((r, i) => (
                            <Box key={i} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Rating value={r.rating} readOnly size="small" />
                                        <Typography fontWeight={600}>{r.title}</Typography>
                                    </Stack>
                                    <Typography color="text.secondary" variant="body2">
                                        {dayjs(r.dateCreated).format("MMM D, YYYY")}
                                    </Typography>
                                </Stack>
                                <Typography sx={{ mt: 1.5 }}>{r.description}</Typography>
                                <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                                    {r.customerFirstName} {r.customerLastName?.[0] ?? ""}.
                                </Typography>
                            </Box>
                        ))}
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, p) => setPage(p)}
                                shape="rounded"
                            />
                        </Box>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
}

function SummaryItem({
                         loading,
                         headline,
                         sub,
                     }: {
    loading: boolean;
    headline: string;
    sub: string;
}) {
    return (
        <Stack spacing={0.5}>
            <Typography variant="h3" fontWeight={800}>
                {loading ? "…" : headline}
            </Typography>
            <Typography color="text.secondary">{sub}</Typography>
        </Stack>
    );
}

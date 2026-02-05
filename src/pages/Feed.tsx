import {
    Box,
    Typography,
    CircularProgress,
    Chip,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useEffect, useMemo, useRef } from "react";
import { useAllPostsInfinite, useAuthorPostsInfinite } from "@/hooks/usePosts";
import { useStyles } from "./Feed.styles";
import PostCard from "@/components/Feed/PostCard";
import { useSearchParams } from "react-router-dom";

const Feed = () => {
    const classes = useStyles();
    const [searchParams, setSearchParams] = useSearchParams();
    const authorId = searchParams.get("authorId");
    const authorName = searchParams.get("authorName");

    // How many posts to fetch per "page" when infinite-scrolling
    const limit = 3;

    // Always call both hooks, but enable only the one that matches the current filter.
    const allQuery = useAllPostsInfinite({
        limit,
        enabled: !authorId,
    });

    const authorQuery = useAuthorPostsInfinite(authorId || undefined, {
        limit,
        enabled: !!authorId,
    });

    const activeQuery = authorId ? authorQuery : allQuery;

    const posts = useMemo(() => {
        return activeQuery.data?.pages.flatMap((p) => p.items) ?? [];
    }, [activeQuery.data]);

    const isLoading = activeQuery.isLoading;
    const error = activeQuery.error;
    const fetchNextPage = activeQuery.fetchNextPage;
    const hasNextPage = activeQuery.hasNextPage;
    const isFetchingNextPage = activeQuery.isFetchingNextPage;

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const el = loadMoreRef.current;
        // Feed is rendered inside an overflowed scroll container (see Layout),
        // so IntersectionObserver must use that element as the root.
        const scrollRoot = document.getElementById("app-scroll-container");

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first?.isIntersecting) return;
                if (!hasNextPage) return;
                if (isFetchingNextPage) return;
                fetchNextPage();
            },
            {
                root: scrollRoot,
                // Start loading before the user reaches the very bottom
                rootMargin: "800px",
                threshold: 0,
            },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [authorId, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const clearFilter = () => {
        setSearchParams({});
    };

    return (
        <Box sx={classes.container}>
            {authorId && (
                <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing posts by:
                    </Typography>
                    <Chip
                        label={authorName || "User"}
                        onDelete={clearFilter}
                        color="primary"
                        variant="outlined"
                        deleteIcon={<CloseIcon />}
                    />
                </Box>
            )}
            <Box sx={classes.postsContainer}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                        <Typography>Failed to load posts</Typography>
                    </Box>
                ) : posts?.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                        <Typography>No posts yet. Be the first to share your workout!</Typography>
                    </Box>
                ) : (
                    <>
                        {posts?.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}

                        <>
                            <Box ref={loadMoreRef} sx={classes.infiniteSentinel} />
                            {isFetchingNextPage && (
                                <Box sx={classes.infiniteLoaderContainer}>
                                    <CircularProgress size={26} />
                                </Box>
                            )}
                            {!hasNextPage && (
                                <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
                                    <Typography variant="body2">You're all caught up</Typography>
                                </Box>
                            )}
                        </>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Feed;

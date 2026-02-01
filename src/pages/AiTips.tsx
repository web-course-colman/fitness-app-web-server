import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Chip,
    Tooltip,
    CircularProgress,
    Grid,
} from "@mui/material";
import {
    AutoAwesome,
    Send,
    FitnessCenter,
    Restaurant,
    NightsStay,
    Favorite,
    CheckCircleOutline,
    History,
} from "@mui/icons-material";
import { useStyles } from "./AiTips.styles";
import { useAiCoach, CoachResponse } from "../hooks/useAi";

interface Tip {
    id: string;
    title: string;
    description: string;
    category: "workout" | "nutrition" | "recovery" | "motivation";
    icon: React.ReactNode;
}

const tips: Tip[] = [
    {
        id: "1",
        title: "Progressive Overload",
        description: "Increase your weights by 2.5-5% each week to continuously challenge your muscles and promote growth.",
        category: "workout",
        icon: <FitnessCenter fontSize="small" />,
    },
    {
        id: "2",
        title: "Post-Workout Nutrition",
        description: "Consume protein within 30-60 minutes after training to optimize muscle recovery and growth.",
        category: "nutrition",
        icon: <Restaurant fontSize="small" />,
    },
    {
        id: "3",
        title: "Sleep for Gains",
        description: "Aim for 7-9 hours of quality sleep. This is when your body repairs and builds muscle tissue.",
        category: "recovery",
        icon: <NightsStay fontSize="small" />,
    },
    {
        id: "4",
        title: "Track Your Progress",
        description: "Document your workouts and celebrate small wins. Progress photos can be incredibly motivating!",
        category: "motivation",
        icon: <Favorite fontSize="small" sx={{ color: "#ff4d4f" }} />,
    },
];

const quickQuestions = [
    "When was my last heavy squat?",
    "How much protein do I need?",
    "Tips for better sleep?",
    "Analyze my weekly volume",
];

interface Message {
    role: "user" | "coach";
    content: string;
    data?: CoachResponse;
}

const AiTips = () => {
    const classes = useStyles();
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const coachMutation = useAiCoach();

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (q?: string) => {
        const query = q || question;
        if (!query.trim() || coachMutation.isPending) return;

        const userMsg: Message = { role: "user", content: query };
        setMessages(prev => [...prev, userMsg]);
        if (!q) setQuestion("");

        try {
            const result = await coachMutation.mutateAsync(query);
            const coachMsg: Message = {
                role: "coach",
                content: result.answer,
                data: result
            };
            setMessages(prev => [...prev, coachMsg]);
        } catch (error) {
            console.error("Coach error:", error);
        }
    };

    const handleQuickQuestion = (q: string) => {
        handleSend(q);
    };

    return (
        <Box sx={classes.container}>
            <Box sx={classes.aiCoachCard}>
                <Box sx={classes.aiCoachHeader}>
                    <AutoAwesome fontSize="small" sx={{ color: "primary.main" }} />
                    <Typography sx={classes.aiCoachTitle}>Ask AI Coach</Typography>
                </Box>
                <Typography sx={classes.aiCoachSubtitle}>
                    Get personalized fitness advice powered by AI
                </Typography>

                <Box sx={classes.chatContainer} ref={scrollRef}>
                    {messages.length === 0 ? (
                        <Box sx={classes.minimizedSection}>
                            <Box sx={classes.tagsGroup}>
                                <Typography sx={classes.miniSectionTitle}>Today's Tips</Typography>
                                <Box sx={classes.tagsRow}>
                                    {tips.map((tip) => (
                                        <Tooltip key={tip.id} title={tip.description} arrow placement="top">
                                            <Chip
                                                icon={tip.icon}
                                                label={tip.title}
                                                onClick={() => { }}
                                                sx={classes.tipChip}
                                            />
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Box>

                            <Box sx={classes.tagsGroup}>
                                <Typography sx={classes.miniSectionTitle}>Quick Questions</Typography>
                                <Box sx={classes.tagsRow}>
                                    {quickQuestions.map((q) => (
                                        <Chip
                                            key={q}
                                            label={q}
                                            disabled={coachMutation.isPending}
                                            onClick={() => handleQuickQuestion(q)}
                                            sx={classes.questionChip}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    ...classes.messageBubble,
                                    ...(msg.role === "user" ? classes.userBubble : classes.coachBubble)
                                }}
                            >
                                <Typography sx={classes.answerText}>{msg.content}</Typography>

                                {msg.role === "coach" && msg.data && (
                                    <Box sx={classes.resultsContainer}>
                                        {msg.data.suggestedNextSteps?.length > 0 && (
                                            <Box>
                                                <Typography sx={classes.sectionTitle}>
                                                    <CheckCircleOutline fontSize="inherit" />
                                                    Suggested Next Steps
                                                </Typography>
                                                <Box sx={classes.nextStepsContainer}>
                                                    {msg.data.suggestedNextSteps.map((step, i) => (
                                                        <Box key={i} sx={classes.nextStepItem} onClick={() => handleQuickQuestion(step)}>
                                                            <Typography variant="body2">{step}</Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}

                                        {msg.data.references?.length > 0 && (
                                            <Box>
                                                <Typography sx={classes.sectionTitle}>
                                                    <History fontSize="inherit" />
                                                    Referenced Workouts
                                                </Typography>
                                                <Grid container spacing={1}>
                                                    {msg.data.references.map((ref) => (
                                                        <Grid item xs={12} key={ref.id}>
                                                            <Box sx={classes.referenceCard}>
                                                                <Typography sx={classes.referenceDate}>
                                                                    {new Date(ref.date).toLocaleDateString()}
                                                                </Typography>
                                                                <Typography sx={classes.referenceText}>
                                                                    {ref.text}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        ))
                    )}
                    {coachMutation.isPending && (
                        <Box sx={{ ...classes.messageBubble, ...classes.coachBubble, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={16} color="inherit" />
                            <Typography sx={classes.answerText}>AI is thinking...</Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={classes.inputContainer}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask about workouts, nutrition, recovery..."
                        value={question}
                        disabled={coachMutation.isPending}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        sx={classes.inputField}
                    />
                    <IconButton
                        sx={classes.sendButton}
                        onClick={() => handleSend()}
                        disabled={coachMutation.isPending}
                        size="small"
                    >
                        {coachMutation.isPending ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <Send fontSize="small" />
                        )}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default AiTips;

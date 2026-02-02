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
import { CoachResponse } from "../hooks/useAi";

interface Tip {
    id: string;
    title: string;
    description: string;
    category: "workout" | "nutrition" | "recovery" | "motivation";
    icon: React.ReactElement;
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
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Keep the mutation for non-streaming checks if needed, or just remove if fully replacing.
    // For now, we'll bypass it for the main chat interaction.

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (q?: string) => {
        const query = q || question;
        if (!query.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: query };
        setMessages(prev => [...prev, userMsg]);
        if (!q) setQuestion("");

        setIsLoading(true);

        // Create a placeholder message for the coach
        const placeholderId = Date.now().toString();
        const initialCoachMsg: Message = {
            role: "coach",
            content: "",
            data: { answer: "", suggestedNextSteps: [], references: [] } // Init empty data
        };
        setMessages(prev => [...prev, initialCoachMsg]);

        try {
            const response = await fetch('/api/coach/ask-stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: query }),
                credentials: 'include', // Important for cookies
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete SSE messages
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.substring(6);
                        try {
                            const event = JSON.parse(jsonStr);

                            setMessages(prev => {
                                const newMessages = [...prev];
                                const lastMsg = newMessages[newMessages.length - 1];

                                if (event.type === 'message') {
                                    // Append text
                                    lastMsg.content += event.data;
                                    // Also update answer in data to match
                                    if (lastMsg.data) lastMsg.data.answer += event.data;
                                } else if (event.type === 'metadata') {
                                    // Update metadata
                                    if (lastMsg.data) {
                                        lastMsg.data.suggestedNextSteps = event.data.suggestedNextSteps;
                                        lastMsg.data.references = event.data.references;
                                    }
                                }
                                return newMessages;
                            });
                        } catch (e) {
                            console.error("Error parsing SSE JSON:", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Coach error:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                lastMsg.content += "\n\n(Error: Failed to get full response from AI)";
                return newMessages;
            });
        } finally {
            setIsLoading(false);
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
                                            disabled={isLoading}
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
                                <Typography sx={classes.answerText} dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />

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
                                                        <Grid size={12} key={ref.id}>
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
                    {isLoading && messages[messages.length - 1]?.role !== 'coach' && (
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
                        disabled={isLoading}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        sx={classes.inputField}
                    />
                    <IconButton
                        sx={classes.sendButton}
                        onClick={() => handleSend()}
                        disabled={isLoading}
                        size="small"
                    >
                        {isLoading ? (
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

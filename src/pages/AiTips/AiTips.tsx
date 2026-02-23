import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Chip,
    CircularProgress,
    Grid,
} from "@mui/material";
import {
    AutoAwesome,
    Send,
    CheckCircleOutline,
    History,
} from "@mui/icons-material";
import { useStyles } from "./AiTips.styles";
import { CoachResponse } from "@/hooks/useAi";

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
            let currentCoachContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete SSE messages (support both \n\n and \r\n\r\n)
                const blocks = buffer.split(/\r?\n\r?\n/);
                buffer = blocks.pop() || ''; // Keep incomplete block in buffer

                for (const block of blocks) {
                    const trimmedBlock = block.trim();
                    if (!trimmedBlock) continue;

                    // SSE can have multiple data: lines; join them per spec.
                    const dataLines = trimmedBlock
                        .split(/\r?\n/)
                        .map(l => l.trim())
                        .filter(l => l.startsWith('data:'))
                        .map(l => l.replace(/^data:\s?/, ''));

                    if (dataLines.length === 0) continue;

                    const jsonStr = dataLines.join('\n');

                    try {
                        const event = JSON.parse(jsonStr);
                        console.log("Received SSE event:", event);

                        if (event.type === 'message') {
                            currentCoachContent += event.data;
                            setMessages(prev => {
                                const newMessages = [...prev];
                                const lastIdx = newMessages.length - 1;
                                if (lastIdx >= 0 && newMessages[lastIdx].role === 'coach') {
                                    newMessages[lastIdx] = {
                                        ...newMessages[lastIdx],
                                        content: currentCoachContent,
                                        data: newMessages[lastIdx].data
                                            ? {
                                                ...newMessages[lastIdx].data!,
                                                answer: currentCoachContent,
                                            }
                                            : undefined,
                                    };
                                }
                                return newMessages;
                            });
                        } else if (event.type === 'metadata') {
                            setMessages(prev => {
                                const newMessages = [...prev];
                                const lastIdx = newMessages.length - 1;
                                if (lastIdx >= 0 && newMessages[lastIdx].role === 'coach') {
                                    newMessages[lastIdx] = {
                                        ...newMessages[lastIdx],
                                        data: {
                                            ...newMessages[lastIdx].data!,
                                            suggestedNextSteps: event.data?.suggestedNextSteps || [],
                                            references: event.data?.references || [],
                                        },
                                    };
                                }
                                return newMessages;
                            });
                        }
                    } catch (e) {
                        console.error("Error parsing SSE JSON:", e, "Block:", trimmedBlock);
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
                                <Typography sx={classes.answerText} style={{ whiteSpace: 'pre-wrap' }}>
                                    {msg.content}
                                </Typography>

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

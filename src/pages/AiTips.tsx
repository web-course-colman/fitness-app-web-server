import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Chip,
    Button,
    Stack,
    Tooltip,
} from "@mui/material";
import {
    AutoAwesome,
    Send,
    FitnessCenter,
    Restaurant,
    NightsStay,
    Favorite,
    Lightbulb,
} from "@mui/icons-material";
import { useStyles } from "./AiTips.styles";

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
    "Best exercises for abs?",
    "How much protein do I need?",
    "Tips for better sleep?",
    "How to stay motivated?",
];

const AiTips = () => {
    const classes = useStyles();
    const [question, setQuestion] = useState("");

    const handleSend = () => {
        if (!question.trim()) return;
        // In a real app, this would call an AI service
        console.log("Asking AI:", question);
        setQuestion("");
    };

    const handleQuickQuestion = (q: string) => {
        setQuestion(q);
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

                    {/* Quick Questions Tags */}
                    <Box sx={classes.tagsGroup}>
                        <Typography sx={classes.miniSectionTitle}>Quick Questions</Typography>
                        <Box sx={classes.tagsRow}>
                            {quickQuestions.map((q) => (
                                <Chip
                                    key={q}
                                    label={q}
                                    onClick={() => handleQuickQuestion(q)}
                                    sx={classes.questionChip}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
                <Box sx={classes.inputContainer}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask about workouts, nutrition, recovery..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        sx={classes.inputField}
                    />
                    <IconButton sx={classes.sendButton} onClick={handleSend} size="small">
                        <Send fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default AiTips;

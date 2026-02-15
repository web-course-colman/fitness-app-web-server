
import { z } from "zod";

// Helper for parsing optional numbers from potentially empty strings
// If the improved controller handles empty strings as undefined/null, this might be simpler
// But text inputs usually return strings.
const optionalNumber = z.union([z.string(), z.number()])
    .transform((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const n = Number(val);
        return isNaN(n) ? undefined : n;
    })
    .optional();

export const editProfileSchema = z.object({
    // Profile Info
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    description: z.string().optional(),
    sportType: z.string().optional(),

    // No file validation in schema (handled separately or custom)
    // picture URL string is fine
    picture: z.string().optional(),

    // Fitness Stats
    height: optionalNumber,
    currentWeight: optionalNumber,
    age: optionalNumber,
    sex: z.string().optional(),
    bodyFatPercentage: optionalNumber,
    vo2max: optionalNumber,

    // 1RM
    oneRmSquat: optionalNumber,
    oneRmBench: optionalNumber,
    oneRmDeadlift: optionalNumber,

    workoutsPerWeek: optionalNumber,
});

export type EditProfileFormSchema = typeof editProfileSchema;
export type EditProfileFormValues = z.input<typeof editProfileSchema>;
export type EditProfileFormOutput = z.output<typeof editProfileSchema>;

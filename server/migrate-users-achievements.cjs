const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/fitness-app';
const client = new MongoClient(uri);

async function migrate() {
    try {
        await client.connect();
        const db = client.db('fitness-app');
        const usersColl = db.collection('users');
        const achievementsColl = db.collection('achievements');

        console.log('--- Phase 1: Migrating Users ---');
        // Initialize totalXp and level for all users who don't have them
        const userUpdateResult = await usersColl.updateMany(
            {
                $or: [
                    { totalXp: { $exists: false } },
                    { level: { $exists: false } }
                ]
            },
            {
                $set: {
                    totalXp: 0,
                    level: 1
                }
            }
        );
        console.log(`Updated ${userUpdateResult.modifiedCount} users with default XP and Level.`);

        console.log('\n--- Phase 2: Seeding Achievements ---');
        const achievements = [
            {
                name: 'First Steps',
                description: 'Complete your first few workouts',
                category: 'consistency',
                type: 'cumulative',
                tiers: [
                    { level: 'bronze', value: 1 },
                    { level: 'silver', value: 5 },
                    { level: 'gold', value: 10 },
                    { level: 'diamond', value: 50 }
                ],
                icon: '/first-steps.png',
                xpReward: 100,
                isActive: true
            },
            {
                name: 'Workout Streak',
                description: 'Train consecutive days',
                category: 'consistency',
                type: 'streak',
                tiers: [
                    { level: 'bronze', value: 3 },
                    { level: 'silver', value: 7 },
                    { level: 'gold', value: 30 },
                    { level: 'diamond', value: 100 }
                ],
                icon: '/workout-streak.png',
                xpReward: 250,
                isActive: true
            },
            {
                name: 'Volume King',
                description: 'Total cumulative workouts',
                category: 'consistency',
                type: 'cumulative',
                tiers: [
                    { level: 'bronze', value: 10 },
                    { level: 'silver', value: 50 },
                    { level: 'gold', value: 100 },
                    { level: 'diamond', value: 500 }
                ],
                icon: '/volume-king.png',
                xpReward: 500,
                isActive: true
            },
            {
                name: 'Pain Free',
                description: 'Workouts without pain reports',
                category: 'behavior',
                type: 'cumulative',
                tiers: [
                    { level: 'bronze', value: 5 },
                    { level: 'silver', value: 20 },
                    { level: 'gold', value: 50 },
                    { level: 'diamond', value: 200 }
                ],
                icon: '/pain-free.png',
                xpReward: 300,
                isActive: true
            },
            {
                name: 'Early Bird',
                description: 'Workouts before 8 AM',
                category: 'behavior',
                type: 'cumulative',
                tiers: [
                    { level: 'bronze', value: 3 },
                    { level: 'silver', value: 10 },
                    { level: 'gold', value: 25 },
                    { level: 'diamond', value: 100 }
                ],
                icon: '/early-bird.png',
                xpReward: 200,
                isActive: true
            },
            {
                name: 'AI Focused',
                description: 'Interaction with AI Coach',
                category: 'ai',
                type: 'cumulative',
                tiers: [
                    { level: 'bronze', value: 5 },
                    { level: 'silver', value: 15 },
                    { level: 'gold', value: 40 },
                    { level: 'diamond', value: 100 }
                ],
                icon: '/ai-focused.png',
                xpReward: 150,
                isActive: true
            },
            {
                name: 'Consistency Master',
                description: 'Maintain 4 workouts per week',
                category: 'ai',
                type: 'ai_pattern',
                tiers: [
                    { level: 'bronze', value: 2 },
                    { level: 'silver', value: 4 },
                    { level: 'gold', value: 12 },
                    { level: 'diamond', value: 52 }
                ],
                icon: '/consistency-master.png',
                xpReward: 1000,
                isActive: true
            }
        ];

        for (const achievement of achievements) {
            await achievementsColl.updateOne(
                { name: achievement.name },
                { $set: achievement },
                { upsert: true }
            );
        }
        console.log('Achievements seeded/updated successfully!');

        console.log('\n--- Migration Complete ---');

    } finally {
        await client.close();
    }
}

migrate().catch(console.error);

const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/fitness-app';
const client = new MongoClient(uri);

async function seed() {
    try {
        await client.connect();
        const db = client.db('fitness-app');
        const achievementsColl = db.collection('achievements');

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
                    { level: 'bronze', value: 2 }, // 2 weeks
                    { level: 'silver', value: 4 }, // 4 weeks
                    { level: 'gold', value: 12 }, // 12 weeks
                    { level: 'diamond', value: 52 } // 52 weeks
                ],
                icon: '/consistency-master.png',
                xpReward: 1000,
                isActive: true
            }
        ];

        console.log('Seeding achievements...');
        for (const achievement of achievements) {
            await achievementsColl.updateOne(
                { name: achievement.name },
                { $set: achievement },
                { upsert: true }
            );
        }
        console.log('Achievements seeded successfully!');

    } finally {
        await client.close();
    }
}

seed().catch(console.error);

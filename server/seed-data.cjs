const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app';
const DB_NAME = process.env.DB_NAME || 'fitness-app';

const ACHIEVEMENTS = [
    {
        name: 'First Steps',
        description: 'Complete your first few workouts',
        category: 'consistency',
        type: 'cumulative',
        tiers: [
            { level: 'bronze', value: 1 },
            { level: 'silver', value: 5 },
            { level: 'gold', value: 10 },
            { level: 'diamond', value: 50 },
        ],
        icon: '/first-steps.png',
        xpReward: 100,
        isActive: true,
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
            { level: 'diamond', value: 100 },
        ],
        icon: '/workout-streak.png',
        xpReward: 250,
        isActive: true,
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
            { level: 'diamond', value: 500 },
        ],
        icon: '/volume-king.png',
        xpReward: 500,
        isActive: true,
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
            { level: 'diamond', value: 200 },
        ],
        icon: '/pain-free.png',
        xpReward: 300,
        isActive: true,
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
            { level: 'diamond', value: 100 },
        ],
        icon: '/early-bird.png',
        xpReward: 200,
        isActive: true,
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
            { level: 'diamond', value: 100 },
        ],
        icon: '/ai-focused.png',
        xpReward: 150,
        isActive: true,
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
            { level: 'diamond', value: 52 },
        ],
        icon: '/consistency-master.png',
        xpReward: 1000,
        isActive: true,
    },
];

async function seedAchievements(db) {
    const achievementsColl = db.collection('achievements');

    for (const achievement of ACHIEVEMENTS) {
        await achievementsColl.updateOne(
            { name: achievement.name },
            { $set: achievement },
            { upsert: true },
        );
    }

    console.log(`Upserted ${ACHIEVEMENTS.length} achievements`);
}

function getDateAt(hourUtc, dayOffset = 0) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + dayOffset);
    d.setUTCHours(hourUtc, 15, 0, 0);
    return d;
}

async function runSeeding() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        console.log(`Connected to MongoDB (${MONGODB_URI}) DB=${DB_NAME}`);

        const usersColl = db.collection('users');
        const postsColl = db.collection('posts');
        const userAchievementsColl = db.collection('userachievements');

        await Promise.all([
            usersColl.deleteMany({}),
            postsColl.deleteMany({}),
            userAchievementsColl.deleteMany({}),
        ]);

        console.log('Cleared users, posts, and userachievements');

        await seedAchievements(db);

        const passwordHash = await bcrypt.hash('password123', 10);
        const now = new Date();

        const users = [
            {
                username: 'john_doe',
                password: passwordHash,
                name: 'John',
                lastName: 'Doe',
                picture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
                email: 'john@example.com',
                description: 'Runner and weekend hiker.',
                streak: 3,
                totalXp: 0,
                level: 1,
                aiUsage: 0,
                lastPostDate: getDateAt(18, -1),
                sportType: 'Running',
                preferences: { pushNotifications: true, darkMode: false, units: 'metric', weeklyGoal: 4 },
                createdAt: now,
                updatedAt: now,
            },
            {
                username: 'jane_smith',
                password: passwordHash,
                name: 'Jane',
                lastName: 'Smith',
                picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
                email: 'jane@example.com',
                description: 'Strength training focused athlete.',
                streak: 2,
                totalXp: 0,
                level: 1,
                aiUsage: 0,
                lastPostDate: getDateAt(6, -2),
                sportType: 'Strength',
                preferences: { pushNotifications: true, darkMode: true, units: 'imperial', weeklyGoal: 5 },
                createdAt: now,
                updatedAt: now,
            },
            {
                username: 'mike_fitness',
                password: passwordHash,
                name: 'Mike',
                lastName: 'Johnson',
                picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                email: 'mike@example.com',
                description: 'Balanced training and mobility.',
                streak: 1,
                totalXp: 0,
                level: 1,
                aiUsage: 0,
                lastPostDate: getDateAt(7, -1),
                sportType: 'Hybrid',
                preferences: { pushNotifications: false, darkMode: false, units: 'metric', weeklyGoal: 3 },
                createdAt: now,
                updatedAt: now,
            },
        ];

        const insertUsersResult = await usersColl.insertMany(users);
        const insertedUsers = Object.values(insertUsersResult.insertedIds);
        const [johnId, janeId, mikeId] = insertedUsers;

        console.log(`Created ${insertedUsers.length} users`);

        const postsData = [
            {
                title: 'Morning Run',
                description: 'Great run this morning at the park. Feeling energized!',
                pictures: ['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&fit=crop'],
                author: johnId,
                workoutDetails: {
                    type: 'Running',
                    duration: 45,
                    calories: 450,
                    subjectiveFeedbackFeelings: 'Felt strong and pain free.',
                    personalGoals: 'Maintain steady pace for the full route.',
                },
                likes: [],
                likeNumber: 0,
                comments: [
                    { content: 'Nice job John!', author: janeId, createdAt: now, updatedAt: now },
                    { content: 'Keep it up!', author: mikeId, createdAt: now, updatedAt: now },
                ],
                commentsNumber: 2,
                createdAt: getDateAt(6, -2),
                updatedAt: now,
            },
            {
                title: 'Heavy Leg Day',
                description: 'New PR on squats today! 100kg for 5 reps.',
                pictures: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop'],
                author: janeId,
                workoutDetails: {
                    type: 'Strength',
                    duration: 60,
                    calories: 350,
                    subjectiveFeedbackFeelings: 'Legs are sore but no pain.',
                    personalGoals: 'Progressive overload on compounds.',
                },
                likes: [],
                likeNumber: 0,
                comments: [{ content: 'Amazing strength Jane!', author: johnId, createdAt: now, updatedAt: now }],
                commentsNumber: 1,
                createdAt: getDateAt(18, -2),
                updatedAt: now,
            },
            {
                title: 'Yoga Session',
                description: 'Focusing on flexibility and mindfulness today.',
                pictures: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&fit=crop'],
                author: mikeId,
                workoutDetails: {
                    type: 'Yoga',
                    duration: 30,
                    calories: 150,
                    subjectiveFeedbackFeelings: 'Relaxed and mobile.',
                    personalGoals: 'Improve hip mobility and breathing rhythm.',
                },
                likes: [],
                likeNumber: 0,
                comments: [],
                commentsNumber: 0,
                createdAt: getDateAt(7, -1),
                updatedAt: now,
            },
            {
                title: 'Evening Hike',
                description: 'Beautiful sunset from the top of the hill.',
                pictures: ['https://images.unsplash.com/photo-1551632432-c735e8399521?w=800&fit=crop'],
                author: johnId,
                workoutDetails: {
                    type: 'Hiking',
                    duration: 90,
                    calories: 600,
                    subjectiveFeedbackFeelings: 'Felt good and controlled.',
                    personalGoals: 'Build endurance on long ascents.',
                },
                likes: [],
                likeNumber: 0,
                comments: [{ content: 'View looks incredible!', author: mikeId, createdAt: now, updatedAt: now }],
                commentsNumber: 1,
                createdAt: getDateAt(19, -1),
                updatedAt: now,
            },
        ];

        await postsColl.insertMany(postsData);
        console.log(`Created ${postsData.length} posts`);

        console.log('Seeding completed successfully');
        console.log('Seed user credentials: password123');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exitCode = 1;
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

runSeeding();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb://localhost:27017/fitness-app';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    picture: String,
    preferences: {
        pushNotifications: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false },
        units: { type: String, default: 'metric' },
        weeklyGoal: { type: Number, default: 3 },
    },
}, { timestamps: true });

const workoutDetailsSchema = new mongoose.Schema({
    type: String,
    duration: Number,
    calories: Number,
}, { _id: false });

const likeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    picture: String,
}, { _id: false });

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    pictures: [String],
    likes: { type: [likeSchema], default: [] },
    likeNumber: { type: Number, default: 0 },
    workoutDetails: workoutDetailsSchema,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: { type: [commentSchema], default: [] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

async function runSeeding() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop the problematic unique index if it exists
        try {
            await mongoose.connection.db.collection('posts').dropIndex('likes.username_1');
            console.log('Dropped unique index: likes.username_1');
        } catch (e) {
            console.log('Index likes.username_1 did not exist or could not be dropped, skipping.');
        }

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        console.log('Cleared existing data');

        const passwordHash = await bcrypt.hash('password123', 10);

        // Create Users
        const users = await User.insertMany([
            {
                username: 'john_doe',
                password: passwordHash,
                name: 'John',
                lastName: 'Doe',
                picture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
                preferences: { pushNotifications: true, darkMode: false, units: 'metric', weeklyGoal: 4 }
            },
            {
                username: 'jane_smith',
                password: passwordHash,
                name: 'Jane',
                lastName: 'Smith',
                picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
                preferences: { pushNotifications: true, darkMode: true, units: 'imperial', weeklyGoal: 5 }
            },
            {
                username: 'mike_fitness',
                password: passwordHash,
                name: 'Mike',
                lastName: 'Johnson',
                picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                preferences: { pushNotifications: false, darkMode: false, units: 'metric', weeklyGoal: 3 }
            }
        ]);

        console.log(`Created ${users.length} users`);

        // Create Posts
        const postsData = [
            {
                title: 'Morning Run 🏃‍♂️',
                description: 'Great run this morning at the park. Feeling energized!',
                pictures: ['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&fit=crop'],
                author: users[0]._id,
                workoutDetails: { type: 'Running', duration: 45, calories: 450 },
                likeNumber: 2,
                likes: [
                    { username: users[1].username, picture: users[1].picture },
                    { username: users[2].username, picture: users[2].picture }
                ],
                comments: [
                    { content: 'Nice job John!', author: users[1]._id },
                    { content: 'Keep it up!', author: users[2]._id }
                ]
            },
            {
                title: 'Heavy Leg Day 🏋️‍♀️',
                description: 'New PR on squats today! 100kg for 5 reps.',
                pictures: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop'],
                author: users[1]._id,
                workoutDetails: { type: 'Strength', duration: 60, calories: 350 },
                likeNumber: 1,
                likes: [
                    { username: users[0].username, picture: users[0].picture }
                ],
                comments: [
                    { content: 'Amazing strength Jane!', author: users[0]._id }
                ]
            },
            {
                title: 'Yoga Session 🧘‍♂️',
                description: 'Focusing on flexibility and mindfulness today.',
                pictures: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&fit=crop'],
                author: users[2]._id,
                workoutDetails: { type: 'Yoga', duration: 30, calories: 150 },
                likeNumber: 2,
                likes: [
                    { username: users[0].username, picture: users[0].picture },
                    { username: users[1].username, picture: users[1].picture }
                ],
                comments: []
            },
            {
                title: 'Evening Hike ⛰️',
                description: 'Beautiful sunset from the top of the hill.',
                pictures: ['https://images.unsplash.com/photo-1551632432-c735e8399521?w=800&fit=crop'],
                author: users[0]._id,
                workoutDetails: { type: 'Hiking', duration: 90, calories: 600 },
                likeNumber: 1,
                likes: [
                    { username: users[2].username, picture: users[2].picture }
                ],
                comments: [
                    { content: 'View looks incredible!', author: users[2]._id }
                ]
            }
        ];

        await Post.insertMany(postsData);
        console.log(`Created ${postsData.length} posts`);

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

runSeeding();

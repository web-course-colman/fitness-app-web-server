const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    lastName: String,
    picture: String,
});

const User = mongoose.model('User', userSchema);

async function run() {
    await mongoose.connect('mongodb://localhost:27017/fitness-app');
    const users = await User.find({});
    console.log('Users found:', users.length);
    users.forEach(u => {
        console.log(`User: ${u.username}, Picture: ${u.picture || 'NONE'}`);
    });
    await mongoose.disconnect();
}

run().catch(console.error);

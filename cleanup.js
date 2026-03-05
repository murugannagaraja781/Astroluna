const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://astrolunasubramani2025_db_user:IYUSOBxsZjeNVtxk@cluster0.dplzwsl.mongodb.net/?appName=Cluster0';

const UserSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    phone: { type: String, unique: true },
    name: String,
    role: { type: String, enum: ['client', 'astrologer', 'superadmin'], default: 'client' },
});

const User = mongoose.model('User', UserSchema);

async function cleanup() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // Delete users except specified phones
        const targetPhones = ['9000000001', '8000000001'];

        // Check how many we are deleting
        const count = await User.countDocuments({ phone: { $nin: targetPhones } });
        console.log(`Found ${count} users to delete.`);

        const result = await User.deleteMany({ phone: { $nin: targetPhones } });
        console.log(`Deleted ${result.deletedCount} users.`);

        // List remaining users to verify
        const remaining = await User.find({}, 'phone role name');
        console.log('Remaining users:', remaining);

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (err) {
        console.error(err);
    }
}

cleanup();

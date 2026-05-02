const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const createIndexes = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');

    const db = mongoose.connection.db;

    // Assets indexes
    await db.collection('assets').createIndex({ status: 1 });
    await db.collection('assets').createIndex({ category: 1 });
    await db.collection('assets').createIndex({ createdAt: -1 });
    await db.collection('assets').createIndex({ purchaseDate: -1 });

    // Assignments indexes
    await db.collection('assignments').createIndex({ returnDate: 1 });
    await db.collection('assignments').createIndex({ createdAt: -1 });
    await db.collection('assignments').createIndex({ employee: 1 });

    // Employees indexes
    await db.collection('employees').createIndex({ department: 1 });
    await db.collection('employees').createIndex({ createdAt: -1 });

    console.log('All indexes created!');
    process.exit(0);
};

createIndexes().catch(console.error);
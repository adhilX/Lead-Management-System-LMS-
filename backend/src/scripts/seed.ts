import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/lead.model';
import User from '../models/user.model';
import { LeadSource, LeadStatus } from '../entity/lead.entity';
import { hashPassword } from '../utils/passwordHash';

dotenv.config();

const sampleLeads = [
    { name: 'John Doe', email: 'john@example.com', phone: '1234567890', source: LeadSource.WEBSITE, status: LeadStatus.NEW, notes: 'Interested in product A' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', source: LeadSource.REFERRAL, status: LeadStatus.QUALIFIED, notes: 'Ready for a demo' },
    { name: 'Bob Wilson', email: 'bob@example.com', phone: '1122334455', source: LeadSource.COLD, status: LeadStatus.CONTACTED },
    { name: 'Alice Brown', email: 'alice@example.com', phone: '5544332211', source: LeadSource.WEBSITE, status: LeadStatus.WON, notes: 'Closed deal' },
    { name: 'Charlie Davis', email: 'charlie@example.com', phone: '6677889900', source: LeadSource.REFERRAL, status: LeadStatus.LOST },
    { name: 'Eva Green', email: 'eva@example.com', phone: '9988776655', source: LeadSource.COLD, status: LeadStatus.NEW },
    { name: 'Frank Miller', email: 'frank@example.com', phone: '4455667788', source: LeadSource.WEBSITE, status: LeadStatus.QUALIFIED },
    { name: 'Grace Lee', email: 'grace@example.com', phone: '2233445566', source: LeadSource.REFERRAL, status: LeadStatus.CONTACTED },
    { name: 'Henry Ford', email: 'henry@example.com', phone: '3344556677', source: LeadSource.COLD, status: LeadStatus.WON },
    { name: 'Ivy Chen', email: 'ivy@example.com', phone: '7788990011', source: LeadSource.WEBSITE, status: LeadStatus.LOST }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lead_management_system');
        console.log('Connected to MongoDB');

        // 1. Create a seed user if none exists
        let user = await User.findOne({ email: 'seed@example.com' });
        if (!user) {
            const hashedPassword = await hashPassword('password123');
            user = await User.create({
                name: 'Seed User',
                email: 'seed@example.com',
                password: hashedPassword
            });
            console.log('Created seed user');
        }

        // 2. Clear existing leads for this user
        await Lead.deleteMany({ createdBy: user._id });
        console.log('Cleared existing leads for seed user');

        // 3. Insert sample leads
        const leadsWithUser = sampleLeads.map(lead => ({
            ...lead,
            createdBy: user!._id
        }));

        await Lead.insertMany(leadsWithUser);
        console.log(`Successfully seeded ${sampleLeads.length} leads`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();

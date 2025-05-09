import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
    title: String,
    date: Date,
    description: String,
    image: String,
    link: String,
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'past'],
        default: 'upcoming'
    },
});
const newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: String,
    company: String,
    location: String,
    date: Date,
});
const teamMemberSchema = new mongoose.Schema({
    name: String,
    role: String,
    image: String,
    isLead: Boolean,
    linkedin: String,
    twitter: String,
    github: String,
});
export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export const News = mongoose.models.News || mongoose.model('News', newsSchema);
export const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);

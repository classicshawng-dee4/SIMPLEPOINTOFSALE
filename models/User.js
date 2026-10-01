import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        trim: true,
        lowercase: true,
        unique: true 
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true
    },
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    role: { 
        type: String, 
        enum: ['Cashier', 'Admin'],
        default: 'Cashier' 
    }
}, { 
    timestamps: true 
});

export default mongoose.model("User", userSchema);
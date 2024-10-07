import mongoose, { Schema, Document } from "mongoose";

// Message document 
export interface Message extends Document {
    _id: string; // Add the _id field to the Message interface
    content: string; // Ensure this is a string
    createdAt: Date;
}

// Message schema 
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,   // Mongoose String is capitalized
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// User document 
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]; // Array of Message documents
}

// User schema
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,   // Mongoose String is capitalized
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema] // Array of Message schema
});

// Export the User model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;

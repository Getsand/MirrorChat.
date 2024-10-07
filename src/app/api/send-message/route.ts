import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user"; // Import UserModel
import mongoose from "mongoose"; // Import mongoose for ObjectId
import { NextResponse } from "next/server";

// Define the PlainMessage type
interface PlainMessage {
    _id: string; // Use string for ObjectId representation
    content: string;
    createdAt: Date;
}

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    // Validate incoming data
    if (!username || !content) {
        return NextResponse.json({
            success: false,
            message: "Username and content are required."
        }, { status: 400 });
    }

    try {
        const user = await UserModel.findOne({ username });

        // Check if user exists
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessage) {
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 });
        }

        // Create a new message object using the Mongoose Message model
        const newMessage: PlainMessage = {
            _id: new mongoose.Types.ObjectId().toString(), // Generate a unique ID for the message
            content, // Use the content from the request
            createdAt: new Date(), // Set the creation date
        };

        // Push the new message into the user's messages array
        user.messages.push(newMessage as any); // Cast to `any` to bypass type checking

        await user.save(); // Save the updated user document

        return NextResponse.json({
            success: true,
            message: "Message submitted successfully."
        }, { status: 200 });

    } catch (error) {
        console.error("Error submitting message:", error);

        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

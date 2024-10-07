import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; // Ensure this path is correct
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user"; // Adjust path based on your project structure
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server"; // Make sure to import NextResponse

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    // Check if session and user exist
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    const user: User = session.user as User; // Safely cast to User
    const userId = new mongoose.Types.ObjectId(user._id); // Create ObjectId from user ID

    try {
        const userMessages = await UserModel.aggregate([
            { $match: { _id: userId } }, // Match the user ID
            { $unwind: '$messages' }, // Unwind the messages array
            { $sort: { 'messages.createdAt': -1 } }, // Sort messages by createdAt
            { $group: { _id: '$_id', messages: { $push: '$messages' } } } // Group back to user structure
        ]);

        if (!userMessages || userMessages.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No messages found for this user" // Improved error message
            }, { status: 404 });
        }

        // Return messages from the aggregated result
        return NextResponse.json({
            success: true,
            messages: userMessages[0].messages // Return messages
        }, { status: 200 });
    } catch (error) {
        console.error("An unexpected error occurred: ", error); // Log the error for debugging
        return NextResponse.json({
            success: false,
            message: "Error fetching messages"
        }, { status: 500 });
    }
}

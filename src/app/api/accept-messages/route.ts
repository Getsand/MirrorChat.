// api/accept-messages/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    console.log("POST request received"); // Log the incoming request
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Log the session object

    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const userId = session.user._id; // Make sure _id is defined in session.user
    const { acceptMessages } = await request.json();

    if (acceptMessages === undefined) {
        return NextResponse.json(
            {
                success: false,
                message: "acceptMessages is required",
            },
            { status: 400 }
        );
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update user status to accept messages:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update user status to accept messages",
            },
            { status: 500 }
        );
    }
}

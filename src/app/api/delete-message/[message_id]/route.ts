import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User; // User type imported from next-auth

    // Check if the user is authenticated
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    try {
        // Attempt to pull the message from the user's messages array
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        // Check if a message was modified (deleted)
        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted",
                },
                { status: 404 }
            );
        }

        // Successfully deleted the message
        return Response.json(
            {
                success: true,
                message: "Message Deleted",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in delete message route:", error);
        return Response.json(
            {
                success: false,
                message: "Error deleting message",
            },
            { status: 500 }
        );
    }
}

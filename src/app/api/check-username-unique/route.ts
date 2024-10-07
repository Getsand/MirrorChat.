'use server'; // Adjusting the directive for server-side execution

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        // Validate with Zod
        const result = UsernameQuerySchema.safeParse({ username });

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return new Response(JSON.stringify({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
            }), { status: 400 });
        }

        // If the username is valid, check if it already exists
        const { username: validatedUsername } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username: validatedUsername, isVerified: true });

        if (existingVerifiedUser) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Username is already taken',
            }), { status: 400 });
        }

        // If the username is unique
        return new Response(JSON.stringify({
            success: true,
            message: "Username is unique",
        }), { status: 200 });

    } catch (error) {
        console.error("Error checking username:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error checking username",
        }), { status: 500 });
    }
}

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect"; 
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email } // Support both email and username
                        ]
                    });

                    if (!user) {
                        throw new Error('No user found with this email or username');
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before login');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        // Return user data for session, including username
                        return {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            isVerified: user.isVerified,
                            isAcceptingMessage: user.isAcceptingMessage,
                            messages: user.messages // Include messages if you want to access them in the session
                        };
                    } else {
                        throw new Error('Incorrect password');
                    }
                } catch (err: any) {
                    throw new Error(err.message || "An error occurred");
                }
            }
        })
    ],

    session: {
        strategy: "jwt", // Use JWT for sessions
    },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET, // Secret for signing JWT
    },

    secret: process.env.NEXTAUTH_SECRET, // Ensure the secret is used for signing

    pages: {
        signIn: '/auth/signin', // Customize the sign-in page if needed
    },

    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development',
};

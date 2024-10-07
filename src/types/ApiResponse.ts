import { Message } from "@/model/user";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    Message?: Array<Message>
}
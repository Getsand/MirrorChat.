// /app/send-message/page.tsx or /pages/send-message.tsx

'use client';

import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

const SendMessagePage = () => {
    const router = useRouter();
    const { username } = router.query; // Get the username from the query parameters
    const [content, setContent] = useState('');
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('/api/send-messages', {
                username,
                content
            });
            toast({
                title: response.data.message,
                variant: response.data.success ? 'default' : 'destructive'
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="container">
            <h1>Send a Message to {username}</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message..."
                    required
                />
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default SendMessagePage;


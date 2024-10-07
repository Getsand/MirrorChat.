'use client';

import { useToast } from "@/hooks/use-toast";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Message } from "@/model/user";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";
import Link from "next/link"; 

const DashboardPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const { toast } = useToast();
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session || !session.user) {
        return <div>Please login</div>;
    }

    const { username } = session.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;
    const sendMessageUrl = `${baseUrl}/send-message?username=${username}`;

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: false,
        },
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        let isMounted = true;
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            if (isMounted) {
                setMessages(response.data.Message || []);
                if (refresh) {
                    toast({
                        title: "Refreshed Messages",
                        description: "Showing latest messages"
                    });
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            if (isMounted) {
                toast({
                    title: "Error",
                    description: axiosError.response?.data.message || "Failed to fetch messages",
                    variant: "destructive"
                });
            }
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
        return () => {
            isMounted = false;
        };
    }, [toast]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleSwitchChange = async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.post('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: response.data.message,
                variant: 'default',
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to update message acceptance",
                variant: "destructive"
            });
        } finally {
            setIsSwitchLoading(false);
        }
    };
    
    const handleDeleteMessage = useCallback((messageId: string) => {
        setMessages((prevMessages) => 
            prevMessages.filter((message) => message._id !== messageId)
        );
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: "URL copied",
            description: "Profile URL has been copied to clipboard"
        });
    };

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl text-black">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        readOnly
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />
            <Button
                className="mt-4"
                variant="outline"
                onClick={() => fetchMessages(true)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>

            <div className="mt-4">
                <Link href={sendMessageUrl}>
                    <Button variant="primary">Send a Message</Button>
                </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage} // Pass the delete function
                        />
                    ))
                ) : (
                    <p>No messages to display</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;

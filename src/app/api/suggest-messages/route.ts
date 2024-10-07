import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Set the runtime to 'edge' for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Extract incoming messages from the request body
    const { messages } = await req.json();
    
    // If no messages are provided, return a 400 response
    if (!messages || messages.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No messages provided for suggestion."
      }, { status: 400 });
    }

    // Use OpenAI to stream the response
    const result = await streamText({
      model: openai('gpt-4-turbo'),
      messages: convertToCoreMessages(messages),
    });

    // Stream the response back to the client
    return result.toDataStreamResponse();

  } catch (error) {
    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({
        name, status, headers, message
      }, { status });
    }

    // Handle general errors
    console.error("An unexpected error occurred", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}

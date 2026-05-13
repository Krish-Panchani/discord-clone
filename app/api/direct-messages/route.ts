import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { DirectMessage } from "@/generated/prisma/browser";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(
    req: Request
) {try {
    
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    //cursor for pagination & infinite scrolling 
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
        return new NextResponse("conversation ID Missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];


    //if cursor is provided, fetch messages after the cursor    
    if (cursor) {
        messages = await db.directMessage.findMany({
            take: MESSAGES_BATCH,
            skip: 1,
            cursor: {
                id: cursor,
            },
            where: {
                conversationId,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",  
            },
        });
    } else {
        //if cursor is not provided, fetch the latest messages
        messages = await db.directMessage.findMany({
            take: MESSAGES_BATCH,
            where: {
                conversationId,
            }, 
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        })
    };

    let nextCursor = null;

    //if messages are less than the batch size, there are no more messages
    if (messages.length === MESSAGES_BATCH) {
        nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
        items: messages,
        nextCursor
    });
    
} catch (error) {
    console.log("DIRECT_MESSAGE_GET_ERROR]", error);
    return new NextResponse ("Internal Server Error", {status: 500});
    
}}
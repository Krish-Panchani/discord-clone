import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile(); // Get the current user's profile

        // If the user is not logged in, return an unauthorized response
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(), // Generate a random invite code
                channels: {
                    create: [{
                        name: "general",
                        profileId: profile.id,
                    }
                ]
            },
            members: {
                create: [{
                    profileId: profile.id,
                    role: MemberRole.ADMIN,
                }],
            },
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_POST]", error); 
        // Return an internal server error response
        return new NextResponse("Internal server error", { status: 500 });
    }
    
}
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,  
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
        
    }

    try {

        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;
        
        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!serverId) {
            return res.status(400).json({ error: "Server ID Missing" });
        }
        if (!channelId) {
            return res.status(400).json({ error: "Channel ID Missing" });
        }
        if (!content) {
            return res.status(400).json({ error: "Content Missing" });
        }
        
        // Check if the user is a member of the server
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id,
                    }
                }
            },
            include: {
                members: true,
            }
        });

        if (!server) {
            return res.status(404).json({ message: "Server not found" });   
        }

        // Check if the channel exists
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });   
        }

        // Check if the user is a member of the channel
        const member = server.members.find((member) => member.profileId === profile.id);    
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            }
        });


        //Why? Because we want to send the message to all the users in the channel
        const channelKey =`chat:${channelId}:messages`;

        // Emit the message to the channel
        // This will send the message to all the users in the channel
        res?.socket?.server?.io?.emit(channelKey, message);
        
        return res.status(200).json(message);

    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ error: "Internal server error" });    
    }
}
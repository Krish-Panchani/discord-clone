import { db } from "@/lib/db";

// Get or create a conversation between two members by their IDs 
// This function is used in the chat page to get or create a conversation between two members
export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {

    // Find a conversation between two members by their IDs
    let conversation = await findCoversation(memberOneId, memberTwoId) || await findCoversation(memberTwoId, memberOneId);

    if (!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId);

    }

    return conversation;

};

// Find a conversation between two members by their IDs
// This function is used in the chat page to find a conversation between two members
const findCoversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                },
            }
        });
        
    } catch  {
        return null;
    }
    
};

// Create a new conversation between two members by their IDs
// This function is used in the chat page to create a conversation between two members
const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                }
            }
        });
    } catch {
        return null;
    }
};
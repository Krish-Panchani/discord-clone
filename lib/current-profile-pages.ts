import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";


export const currentProfilePages = async (req: NextApiRequest) => {

    // Get the user ID from the session
    const { userId } = getAuth(req);

    // If the user is not logged in, return null
    if (!userId) {
        return null;
    }

    // Find the user's profile in the database
    const profile = await db.profile.findUnique({
        where: {
            userId,
        },
    });

    // If the profile is not found, return null otherwise return the profile
    return profile;
}
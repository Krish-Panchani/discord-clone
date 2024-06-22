import { auth } from "@clerk/nextjs";
import { db } from "./db";

export const currentProfile = async () => {

    // Get the user ID from the session
    const { userId } = auth();

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
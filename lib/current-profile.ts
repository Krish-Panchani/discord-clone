import { auth } from "@clerk/nextjs";
import { db } from "./db";

export const currentProfile = async () => {
  try {
    // Get the user ID from the session
    const { userId } = auth();

    // If the user is not logged in, return null
    if (!userId) {
      return null;
    }

    // Find the user's profile in the database
    const profile = await db.profile.findUnique({
      where: { userId },
    });

    // Return the profile or null if not found
    return profile || null;
  } catch (error) {
    console.error("[PROFILE_FETCH_ERROR]", error);
    return null; // Return null on error
  }
};

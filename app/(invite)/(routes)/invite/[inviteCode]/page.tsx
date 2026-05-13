import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface InviteCodePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}
// This page is used to join a server using an invite code
const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const { inviteCode } = await params;
  const profile = await currentProfile();

  if (!profile) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  // If the invite code is not provided, redirect to the home page

  if (!inviteCode) {
    return redirect("/");
  }

  // Check if the server exists and the profile is already a member
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // If the profile is already a member of the server, redirect to the server page
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // If the server does not exist, redirect to the home page
  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  // Redirect to the server page
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;

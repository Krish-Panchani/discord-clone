import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}
// This page is used to join a server using an invite code
const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  // If the invite code is not provided, redirect to the home page

  if (!params.inviteCode) {
    return redirect("/");
  }

  // Check if the server exists and the profile is already a member
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // If the profile is already a member of the server, redirect to the server page
  if (existingServer) {
    return redirect(`/server/${existingServer.id}`);
  }

  // If the server does not exist, redirect to the home page
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
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

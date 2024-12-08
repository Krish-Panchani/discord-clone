"use client";

import { useEffect, useState } from "react";

import { InviteModel } from "@/components/modals/invite-modal";
import { CreateServerModel } from "@/components/modals/create-server-modal";

export const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModel />
      <InviteModel />
    </>
  );
};

"use client";

import { useEffect, useState } from "react";

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
    </>
  );
};

"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

import { useModel } from "@/hooks/use-modal-store";

export const InviteModel = () => {
  // Use the useModel hook to manage the model state
  const { isOpen, onClose, type } = useModel();

  const isModalOpen = isOpen && type === "createServer";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an icon. You can
            always change these later.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
      Invite Model
    </Dialog>
  );
};

import { Server } from '@prisma/client';
import exp from 'constants';
import { create} from 'zustand';

export type ModelType = "createServer" | "invite";

interface ModalData {
    server?: Server;
}

interface ModelStore {
    type: ModelType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModelType, data?: ModalData) => void;
    onClose: () => void;
}
export const useModel = create<ModelStore>((set) => ({
    type: null,
    data: {},       
    isOpen: false,
    onOpen: (type, data={}) => set({ type, isOpen: true, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));
import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

//define the keys that we will use to add, update, and query the cache
type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

//define the shape of the message that we will receive from the server
type MessageWithMemberWithProfile = Message & { 
    member: Member & {
        profile: Profile;
    }
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        //? Listen to new message
        //? When a new message is added, we will add it to the cache    
        //? So that the chat window will be updated in real-time
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {

            //add the new message to the cache using the queryKey and the addKey provided in the props 
            queryClient.setQueryData([queryKey], (oldData: any) => {

                //if there is no old data, return an empty array
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                //if there is old data, add the new message to the cache and return the new data
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }

                            //if the message is not the new message, return the old message
                            return item;
                        })
                    }
                })
                return {
                    ...oldData,
                    pages: newData,
                }
            })
        });

        // Listen to new message
        // When a new message is added, we will add it to the cache 
        // So that the chat window will be updated in real-time
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {

            //add the new message to the cache using the queryKey and the addKey provided in the props
            queryClient.setQueryData([queryKey], (oldData: any) => {
                // if there is no old data, return an array with the new message added to it 
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message],
                        }]
                    };
                };

                const newData = [...oldData.pages];

                //add the new message to the cache and return the new data
                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items
                    ]
                };

                return {
                    ...oldData,
                    pages: newData,
                }
            });
        });

        // Clean up the event listener when the component is unmounted 
        return () => {
            socket.off(addKey); //remove the event listener for the addKey
            socket.off(updateKey); //remove the event listener for the updateKey
        }
    }, [queryClient, addKey, queryKey, socket, updateKey]);
};
import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps{
    queryKey: string,
    apiUrl: string,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
};

export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
}: ChatQueryProps) => {
    const { isConnected } = useSocket();

    // Fetch messages from the server
    const fetchMessages = async ({ pageParam = undefined }) => {
        // Use the query-string library to construct the URL with the cursor and query parameters
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
            }
        }, { skipNull: true }) 

        const res = await fetch(url);
        return res.json();
    };

    // Use the useInfiniteQuery hook to fetch messages from the server
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages, 
        getNextPageParam: (lastPage) => lastPage?.nextCursor, // Get the next cursor from the last page
        refetchInterval: isConnected ? false : 1000, // Refetch every 1 second if the user is offline
        initialPageParam: undefined
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    };
};

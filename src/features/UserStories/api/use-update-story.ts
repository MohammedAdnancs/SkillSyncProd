import { toast } from "sonner";
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType , InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.userStories[":userStoryId"]["$patch"],200>;
type RequestType = InferRequestType<typeof client.api.userStories[":userStoryId"]["$patch"]>;

export const useUpdateStory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({        
        mutationFn: async ({json, param}) => {
            const response = await client.api.userStories[":userStoryId"]["$patch"]({json, param});

            if(!response.ok){
                throw new Error("Failed to update User Story");
            }
            console.log("User Story Updated!", response);
            const result = await response.json();
            return result;
        },        onSuccess: (result) => {
            toast.success("User Story Updated!");
            console.log("User Story Updated!", result);
            
            // Invalidate the list of user stories to refresh any listing views
            queryClient.invalidateQueries({queryKey: ["userStories"]});
            
            // Get the story ID - the API returns the document directly
            const storyId = result.$id;
            console.log("Invalidating userStory query for ID:", storyId);
            
            if (storyId) {
                // Invalidate the specific user story to refresh the detail view
                queryClient.invalidateQueries({queryKey: ["story", storyId]});
            }
        },
        onError: (e) => {
            console.log(e);
            toast.error("Failed to update User Story");
        }
    });

    return mutation;
}

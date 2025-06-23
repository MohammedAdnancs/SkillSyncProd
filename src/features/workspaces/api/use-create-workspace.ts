
import { toast } from "sonner";
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType , InferResponseType } from "hono";


type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form })=> {
          const response = await client.api.workspaces["$post"]({ form });
          
          if(!response.ok) {
            console.log("API Response not OK:", response);
            throw new Error("Failed to create workspace");
          }

          return await response.json();
        },
        onSuccess: () => {
          toast.success("Workspace Created!");
          queryClient.invalidateQueries({queryKey: ["workspaces"]})
        },
        onError: (e) => {
          console.log(e);
          toast.error(e.message);
        }
    });

    return mutation;
};
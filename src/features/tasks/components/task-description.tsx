import { Button } from "@/components/ui/button";
import {Task} from "../types";
import { Pencil, PencilIcon, XIcon } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { useState } from "react";
import { useUpdateTask } from "../api/use-update-tasks";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
    task: Task;
    membercanedit?: boolean;
};

export const TaskDescription = ({ task , membercanedit}: TaskDescriptionProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [value , setValue] = useState(task.description);
    const {mutate , isPending} = useUpdateTask();

    const handleSave = () => {
        mutate({
            json:{description: value},
            param: {taskId: task.$id}
        },{
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Task Description</p>
                {membercanedit? (
                     <Button onClick={() => setIsEditing((prev)=>!prev)} size="sm" variant="secondary">
                    {isEditing? (
                        <XIcon className="size-4 mr-2" />
                    ):(
                        <PencilIcon className="size-4 mr-2" />
                    )}
                    {isEditing? "Cancel": "Edit"}
                </Button>
                ):null}
            
            </div>
            <DottedSeparator className="my-4" />
            {isEditing? (
                 <div className="flex flex-col gap-y-4">
                    <Textarea placeholder="Add a description" value={value} rows={4} onChange={(e)=>setValue(e.target.value)} disabled={isPending}/>
                    <Button size="sm" className="w-fit ml-auto" onClick={handleSave} disabled={isPending}>
                        {isPending? "Saving...": "Save changes"}
                    </Button>
                 </div>
            ):(
                <div>
                    {task.description || (
                        <span className="text-muted-foreground">No Description</span>
                    )}
                </div>
            )}
           
        </div>
    );
};
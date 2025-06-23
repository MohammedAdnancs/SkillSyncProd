import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { TaskIdClient } from "./client";

const TaskIdPage = async () => {

    const user = await getCurrent();
    if (!user) redirect(`${process.env.NEXT_PUBLIC_APP_URL}/landingpage`)

    return(
        <TaskIdClient />
    );
};

export default TaskIdPage;
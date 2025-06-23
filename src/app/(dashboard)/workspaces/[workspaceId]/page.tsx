import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkSpaceIdClient } from "./client";

const WorkspacedPageId = async () => {

    const user = await getCurrent();
     if (!user) redirect(`${process.env.NEXT_PUBLIC_APP_URL}/landingpage`)

    return (
        <WorkSpaceIdClient />
    )
     
}

export default WorkspacedPageId;
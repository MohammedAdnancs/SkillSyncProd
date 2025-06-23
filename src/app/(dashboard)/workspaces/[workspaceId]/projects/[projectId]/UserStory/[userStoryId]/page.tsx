import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { UserStoryIdClient } from "./client";

const UserStoryIdPage = async () => {
    const user = await getCurrent();
    if (!user) redirect(`${process.env.NEXT_PUBLIC_APP_URL}/landingpage`)
    return (
        <UserStoryIdClient />
    );
};

export default UserStoryIdPage;
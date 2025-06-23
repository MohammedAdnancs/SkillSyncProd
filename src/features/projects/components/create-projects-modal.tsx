"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateProjectForm } from "./create-projects-form";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import { useCurrent } from "@/features/auth/api/use-current";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useRouter } from "next/navigation";

export const CreateProjectModal = () => {    
    const {isOpen, setIsOpen, close} = useCreateProjectModal();
    const workspaceId = useWorkspaceId();
    const { data: user } = useCurrent();
    const { data: members } = useGetMembers({ workspaceId });
    const router = useRouter();

    return (
        <ResponsiveModal open={isOpen} onopenchange={setIsOpen}>
            <CreateProjectForm onCancel={close} />
        </ResponsiveModal>
    )
}
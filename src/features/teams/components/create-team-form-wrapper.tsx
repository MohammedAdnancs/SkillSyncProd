import { Card, CardContent } from "@/components/ui/card";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { CreateTeamForm } from "./create-team-form";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useEffect, useState } from "react";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCurrent } from "@/features/auth/api/use-current";
import { MemberRole } from "@/features/members/types";

interface CreateTeamFormWrapperProps {
  onCancel: () => void;
}

export const CreateTeamFormWrapper = ({ onCancel }: CreateTeamFormWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });  const { data: user } = useCurrent();
  const { data: members } = useGetMembers({ workspaceId });
  const [isAdmin, setIsAdmin] = useState(false);
  const [canManageTeams, setCanManageTeams] = useState(false);
  
  // Check if the current user is an admin or has team management permissions
  useEffect(() => {
    if (members && user && Array.isArray(members.documents)) {
      // Find the current user's member document
      const currentUserMember = members.documents.find((member) => 
        member.userId === user.$id
      );
      
      if (currentUserMember) {
        setIsAdmin(currentUserMember.role === MemberRole.ADMIN);
        
        // Check for special role permissions
        if (currentUserMember.specialRole?.documents?.[0]) {
          const specialRole = currentUserMember.specialRole.documents[0];
          setCanManageTeams(!!specialRole.manageTeams);
        }
      } else {
        setIsAdmin(false);
        setCanManageTeams(false);
      }
    }
  }, [members, user]);
  
  // Allow team creation for admins OR users with manageTeams permission
  const canCreateTeams = isAdmin || canManageTeams;

  const projectOptions = projects?.documents.map(project => ({ 
    id: project.$id, 
    name: project.name, 
    imageUrl: project.imageUrl 
  }));
  
  if (isLoadingProjects) {
    return (
      <Card className="w-full h-[500px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTeamForm 
      onCancel={onCancel} 
      projectOptions={projectOptions ?? []} 
      preSelectedProjectId={projectId ?? undefined}
    />
  );
};
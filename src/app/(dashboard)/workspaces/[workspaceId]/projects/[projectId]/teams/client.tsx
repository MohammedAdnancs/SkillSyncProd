"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ArrowLeftIcon, PlusIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { CreateTeamModal } from "@/features/teams/components/create-team-modal";
import { useCreateTeamModal } from "@/features/teams/hooks/use-create-team-modal";
import { useGetTeams } from "@/features/teams/api/use-get-teams";
import { useAddTeamMemberModal } from "@/features/teams/hooks/use-add-team-member-modal";
import { AddTeamMemberModal } from "@/features/teams/components/add-team-member-modal";
import { useViewTeamModal } from "@/features/teams/hooks/use-view-team-modal";
import { Team } from "@/features/teams/types"; 
import { ViewTeamModal } from "@/features/teams/components/view-team-modal";
import { useDeleteTeam } from "@/features/teams/api/use-delete-team";
import { useConfirm } from "@/hooks/use-confirm";
import { useCurrent } from "@/features/auth/api/use-current";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberRole } from "@/features/members/types";
import { useEffect, useState } from "react";

interface TeamData {
  $id?: string;
  id?: string;
  teamtype: string; 
  workspaceId?: string;
  projectId?: string;
  memberCount?: number;
  membersId?: string[];
}

export const TeamsClient = () => {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
  const { data: teamsData, isLoading: isLoadingTeams } = useGetTeams({ projectId, workspaceId });
  const { open: openCreateTeamModal } = useCreateTeamModal();
  const { open: openAddTeamMemberModal, teamId: currentTeamId } = useAddTeamMemberModal();
  const { open: openViewTeamModal } = useViewTeamModal();
  
  // Debug logging for team member modal
  console.log("Current team ID for add member modal:", currentTeamId);
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam();
    // Get current user and check role
  const { data: user } = useCurrent();
  const { data: members } = useGetMembers({ workspaceId });
  const [isAdmin, setIsAdmin] = useState(false);
  const [canManageTeams, setCanManageTeams] = useState(false);
  
  // Check if the current user is an admin or has team management permissions
  useEffect(() => {
    if (members && user && Array.isArray(members.documents)) {
      // Find the current user's member document
      const currentUserMember = members.documents.find(member => 
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
  
  const [DeleteTeamDialog, confirmTeamDelete] = useConfirm(
      "Delete Team",
      "Are you sure you want to delete this team? This action cannot be undone.",
      "destructive"
    );

  console.log("Teams Data:", teamsData);

  const isLoading = isLoadingProject || isLoadingTeams;

  const handleDeleteTeam = async (teamId:string) => {
    const ok = await confirmTeamDelete();
    if (!ok) return;
    
    deleteTeam({ 
      param: { 
        teamId 
      }
    });
  };

  if (isLoading) return <PageLoader />;
  if (!project) return <PageError message="Project not found" />;

  let displayTeams: TeamData[] = [];

  if (teamsData && teamsData.data && teamsData.data.documents && teamsData.data.documents.length > 0) {
    displayTeams = teamsData.data.documents.map((doc: Team) => ({
      $id: doc.$id,
      id: doc.$id,
      teamtype: doc.teamtype,
      workspaceId: doc.workspaceId,
      projectId: doc.projectId,
      membersId: doc.members || [],
      memberCount: doc.memberCount || 0
    }));
  }

  return (
    <div className="flex flex-col gap-y-6">
      <CreateTeamModal />
      <AddTeamMemberModal />
      <ViewTeamModal />
      <DeleteTeamDialog />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/workspaces/${workspaceId}/projects/${projectId}`}>
              <ArrowLeftIcon className="size-4 mr-2" />
              Back to Project
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Team Management</h1>        </div>        {(isAdmin || canManageTeams) && (
          <Button size="sm" onClick={openCreateTeamModal}>
            <PlusIcon className="size-4 mr-2" />
            Create Team
          </Button>
        )}
      </div>

      <DottedSeparator />

      <Card className="team-project-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UsersIcon className="size-5 mr-2 text-primary" />
            Project Teams
          </CardTitle>
          <CardDescription>
            Create and manage teams for {project.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayTeams.map((team) => (
                <Card key={team.$id || team.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{team.teamtype}</CardTitle>
                    <CardDescription>{team.memberCount} members</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center w-full">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openViewTeamModal(team.$id || team.id || "")}
                        >
                          View Team
                        </Button>                        {(isAdmin || canManageTeams) && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteTeam(team.$id || team.id || "")}
                          >
                            Delete Team
                          </Button>
                        )}
                      </div>                      {(isAdmin || canManageTeams) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const teamIdToUse = team.$id || team.id || "";
                            console.log("Opening add member modal for team:", teamIdToUse);
                            openAddTeamMemberModal(teamIdToUse);
                          }}
                          className="ml-auto hover:bg-primary/10"
                          title="Add member to this team"
                        >
                          <UserPlusIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}              {(isAdmin || canManageTeams) && (
                <Card
                  className="hover:bg-accent/30 transition-colors duration-200 border-dashed cursor-pointer"
                  onClick={openCreateTeamModal}
                >
                  <CardContent className="flex flex-col items-center justify-center h-[120px]">
                    <PlusIcon className="size-8 mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">Add New Team</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <UsersIcon className="size-12 mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No teams created yet</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                Create teams to organize your project members by functionality, department, or however you prefer
              </p>              {(isAdmin || canManageTeams) ? (
                <Button onClick={openCreateTeamModal}>
                  <PlusIcon className="size-4 mr-2" />
                  Create First Team
                </Button>
              ) : (
                <p className="text-muted-foreground mb-2">
                  Only administrators or users with team management permission can create teams
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="team-tips-card">
        <CardHeader>
          <CardTitle>Team Management Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Teams help organize project members and their responsibilities</li>
            <li>You can assign tasks to specific teams or team members</li>
            <li>Team leaders can manage their team's workflow autonomously</li>
            <li>Members can belong to multiple teams simultaneously</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
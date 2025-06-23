import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTeam } from "../api/use-get-team";
import { useRemoveTeamMember } from "../api/use-remove-team-member";
import { useConfirm } from "@/hooks/use-confirm";
import { DottedSeparator } from "@/components/dotted-separator";
import { MembersAvatar } from "@/features/members/components/members-avatar";
import { Button } from "@/components/ui/button";
import { UserMinusIcon, Loader, UsersIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCurrent } from "@/features/auth/api/use-current";
import { MemberRole } from "@/features/members/types";
import { useEffect, useState } from "react";

interface ViewTeamFormWrapperProps {
  teamId: string;
  onCancel: () => void;
}

export const ViewTeamFormWrapper = ({ teamId, onCancel }: ViewTeamFormWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { data: team, isLoading: isLoadingTeam } = useGetTeam({ teamId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
  const { mutate: removeTeamMember, isPending: isRemoving } = useRemoveTeamMember();
    // Get current user and check role
  const { data: user } = useCurrent();
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
  
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "Are you sure you want to remove this member from the team?",
    "destructive"
  );

  const handleRemoveMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    removeTeamMember({
      param: {
        teamId,
        memberId
      }
    });
  };

  const isLoading = isLoadingTeam || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[450px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground"/>
        </CardContent>
      </Card>
    );
  }

  if (!team || !members) {
    return (
      <Card className="w-full h-[450px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <p>Team not found.</p>
        </CardContent>
      </Card>
    );
  }

  // Find team members using the membersId array from team data
  const teamMemberIds = team.membersId || [];
  const teamMembers = members.documents.filter(member => 
    teamMemberIds.includes(member.$id)
  );
  
  return (
    <Card className="w-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold flex items-center">
          <UsersIcon className="size-5 mr-2 text-primary" />
          {team.teamtype}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <h3 className="font-semibold mb-4">Team Members ({teamMembers.length})</h3>
        <div className="space-y-4 members-list-bg p-5 rounded-lg">
          {teamMembers.length > 0 ? (
            <>
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.$id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between p-3 rounded-md bg-accent/30">
                    <div className="flex items-center gap-x-3">
                      <MembersAvatar
                        className="size-10"
                        fallbackclassName="text-lg"
                        name={member.name}
                        imageUrl={member.image}
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>                    {(isAdmin || canManageTeams) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveMember(member.$id)}
                        disabled={isRemoving}
                        className="h-9 px-2"
                      >
                        <UserMinusIcon className="size-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  {index !== teamMembers.length - 1 && <Separator className="my-2" />}
                </motion.div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <UsersIcon className="size-12 mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No members in this team yet.</p>
            </div>
          )}
        </div>
        <DottedSeparator className="my-6" />
        <div className="flex justify-end items-center">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
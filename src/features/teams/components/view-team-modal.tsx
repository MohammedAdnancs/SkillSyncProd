"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useViewTeamModal } from "../hooks/use-view-team-modal";
import { ViewTeamFormWrapper } from "./view-team-form-wrapper";

export const ViewTeamModal = () => {
  const { teamId, close } = useViewTeamModal();  return (
    <ResponsiveModal 
      open={!!teamId} 
      onopenchange={close}
      title="Team Details"
      description="View team members and details"
    >
      {teamId && (
        <div>
          <ViewTeamFormWrapper 
            teamId={teamId} 
            onCancel={close} 
          />
        </div>
      )}
    </ResponsiveModal>
  );
};
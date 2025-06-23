"use client";
// navigation.tsx
import { cn } from '@/lib/utils';
import { BarChart2Icon, GithubIcon, SettingsIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';
import type { IconType } from 'react-icons';
import { usePathname } from 'next/navigation';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCurrent } from '@/features/auth/api/use-current';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberRole } from '@/features/members/types';
import { useEffect, useState } from 'react';

// Define route interface with optional adminOnly property
interface RouteItem {
    label: string;
    href: string;
    icon: IconType | React.ForwardRefExoticComponent<any>;
    activeIcon: IconType | React.ForwardRefExoticComponent<any>;
    adminOnly?: boolean;
}

// Base routes available to all users
const routes: RouteItem[] = [
    {
        label: "Home",
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill
    },
    {
        label: "My Tasks",
        href: "/my-tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,
    },
    {
        label: "GitHub",
        href: "/github-integration",
        icon: GithubIcon,
        activeIcon: GithubIcon,
        adminOnly: true, // Only ADMIN can see GitHub
    },    {
        label: "Workspace Settings",
        href: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon,
        adminOnly: true, // Only ADMIN can access workspace settings
    },
    {
        label: "Members",
        href: "/members",
        icon: UsersIcon,
        activeIcon: UsersIcon,
    },
    {
        label: "Roles",
        href: "/Roles",
        icon: ShieldCheckIcon,
        activeIcon: ShieldCheckIcon,
        adminOnly: true, // Only ADMIN can manage roles
    }
];

const adminRoutes: RouteItem[] = [
    {
        label: "Analytics",
        href: "/admin-analytics",
        icon: BarChart2Icon,
        activeIcon: BarChart2Icon,
        adminOnly: true,
    }
];

export const Navigation = () => {
    const workspaceId = useWorkspaceId();
    const pathname = usePathname();
    const { data: user } = useCurrent();
    const { data: members } = useGetMembers({ workspaceId });
    const [memberSpecialRole, setMemberSpecialRole] = useState<string | undefined>();
    const [isAdmin, setIsAdmin] = useState(false);    // Determine if current user is an admin
    const [canManageAnalytics, setCanManageAnalytics] = useState(false);
    const [memberPermissions, setMemberPermissions] = useState({
        manageProjects: false,
        manageTasks: false,
        manageUserStories: false,
        manageTeams: false,
        manageAnalytics: false,
        manageMembers: false
    });
    
    useEffect(() => {
        if (members && user) {
            const currentUserMember = members.documents.find(member => member.userId === user.$id);
            console.log("Current user member:", currentUserMember);
            setIsAdmin(currentUserMember?.role === MemberRole.ADMIN);
            
            // Check for special role permissions
            if (currentUserMember?.specialRole?.documents?.[0]) {
                const specialRole = currentUserMember.specialRole.documents[0];
                setCanManageAnalytics(!!specialRole.manageAnalytics);
                
                // Store all permissions for potential future use
                setMemberPermissions({
                    manageProjects: !!specialRole.manageProjects,
                    manageTasks: !!specialRole.manageTasks,
                    manageUserStories: !!specialRole.manageUserStories,
                    manageTeams: !!specialRole.manageTeams,
                    manageAnalytics: !!specialRole.manageAnalytics,
                    manageMembers: !!specialRole.manageMembers
                });
                
                console.log("User permissions:", {
                    isAdmin: currentUserMember?.role === MemberRole.ADMIN,
                    manageMembers: !!specialRole.manageMembers
                });
            }
        }
    }, [members, user]);    const filteredRoutes = routes.filter(route => {
        // For Roles tab - show if user is admin OR has manageMembers permission
        if (route.label === "Roles") {
            const showRoles = isAdmin || memberPermissions.manageMembers;
            console.log(`Should show Roles tab: ${showRoles}`, { 
                isAdmin, 
                manageMembers: memberPermissions.manageMembers 
            });
            return showRoles;
        }
        
        // For other adminOnly routes, only show if user is admin
        if (route.adminOnly && !isAdmin) {
            return false;
        }
        
        if (isAdmin && route.label === "My Tasks") {
            return false;
        }
        
        return true;
    });
    
    // Show Analytics route if user is admin OR has manageAnalytics permission
    const shouldShowAnalytics = isAdmin || canManageAnalytics;
    const allRoutes = [...filteredRoutes, ...(shouldShowAnalytics ? adminRoutes : [])];

    return (
        <ul className="flex flex-col gap-1">
            {allRoutes.map((item) => {
                // Special case for GitHub integration which is in standalone layout
                if (item.label === "GitHub") {
                    const isActive = pathname === "/github-integration";
                    const Icon = isActive ? item.activeIcon : item.icon;
                    
                    return (
                        <li key={item.href}>
                            <Link
                                href="/github-integration"
                                className={cn(
                                    "flex items-center gap-2.5 p-2.5 rounded-md font-medium transition-all duration-300 ease-in-out group text-muted-foreground hover:text-primary hover:bg-accent",
                                    isActive && "bg-card shadow-sm hover:opacity-100 text-primary"
                                )}
                            >
                               <Icon className={cn(
                                    "size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary group-hover:scale-110",
                                    isActive && "text-primary"
                                )} />
                                <span className="group-hover:translate-x-2 transition-transform duration-300">
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    );
                }
                
                // Regular workspace routes
                const fullHref = `/workspaces/${workspaceId}${item.href}`;
                const isActive = pathname === fullHref;
                const Icon = isActive ? item.activeIcon : item.icon;

                return (
                    <li key={item.href}>                        <Link
                            href={fullHref}
                            className={cn(
                                "flex items-center gap-2.5 p-2.5 rounded-md font-medium transition-all duration-300 ease-in-out group text-muted-foreground hover:text-primary hover:bg-accent",
                                isActive && "bg-card shadow-sm hover:opacity-100 text-primary",
                                item.adminOnly && !(item.label === "Roles" && memberPermissions.manageMembers) && "text-muted-foreground"
                            )}
                        >
                           <Icon className={cn(
                                "size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary group-hover:scale-110",
                                isActive && "text-primary",
                                item.adminOnly && !(item.label === "Roles" && memberPermissions.manageMembers) && "text-muted-foreground"
                            )} />
                            <span className="group-hover:translate-x-2 transition-transform duration-300">
                                {item.label}
                            </span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    );
};
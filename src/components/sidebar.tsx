"use client"

import Link from "next/link";
import Image from "next/image";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./Navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./Projects";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Sidebar = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Only render theme-specific components after mount to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Get the appropriate logo based on the current theme
    const getLogo = () => {
        if (!mounted) return "https://res.cloudinary.com/dixm4mirt/image/upload/v1750694924/logo_yqv0xk.svg"; // Default logo during SSR

        switch (theme) {
            case "dracula":
                return "https://res.cloudinary.com/dixm4mirt/image/upload/v1750694924/logo-dracula_clga8t.svg";
            case "nord":
                return "https://res.cloudinary.com/dixm4mirt/image/upload/v1750694924/logo-nord_sjet7p.svg";
            default:
                return "https://res.cloudinary.com/dixm4mirt/image/upload/v1750694924/logo_yqv0xk.svg";
        }
    };

    return (
        <aside className="h-full border-r p-4 w-full transition-colors duration-200" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
            <div className="flex items-center gap-2">
                <div className="w-[165px] flex-shrink-0">
                    <Link href="/">
                        <Image src={getLogo()} alt="logo" width={165} height={48} />
                    </Link>
                </div>
            </div>
            <DottedSeparator className="my-4" />
            <WorkspaceSwitcher />
            <DottedSeparator className="my-4" />
            <Navigation />
            <DottedSeparator className="my-4" />
            <Projects />
        </aside>
    )
};
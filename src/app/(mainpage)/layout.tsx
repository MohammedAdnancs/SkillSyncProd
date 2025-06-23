"use client"

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FooterAuroraGradient } from "@/components/fotter";
import { LandingNav } from "@/components/landing-nav";
import { ThemeProvider } from "@/components/theme-provider";

interface MainpageLayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: MainpageLayoutProps) {
    return (
        <main className="landing-page min-h-screen overflow-hidden">
            <div className="mx-auto max-w-screen-2xl">
                <div className="flex flex-col items-center justify-center">
                     <ThemeProvider 
                        attribute="class"
                        defaultTheme="system"
                        enableSystem={true}
                        disableTransitionOnChange
                     >
                        {children}
                     </ThemeProvider>
                </div>
            </div>
            <FooterAuroraGradient />
        </main>
    );  
}
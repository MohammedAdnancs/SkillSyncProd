"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { StarryBackground } from "@/components/starry-background";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
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
    <main className="auth-page bg-background min-h-screen">
      <StarryBackground starCount={200} minSize={0.5} maxSize={2.5} />
      <div className="w-full border-b">
        <nav className="flex justify-between items-center mx-auto max-w-screen-2xl p-4">
          <Image src={getLogo()} height={56} width={152} alt="Logo" />
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button asChild variant="secondary">
              <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
                {pathname === "/sign-in" ? "Sign up" : "Login"}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
      <div className="mx-auto max-w-screen-2xl p-4">
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
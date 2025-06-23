"use client";

import { usePathname } from "next/navigation";
import { useSearchParamsSafe } from "@/hooks/use-search-params-safe";
import NProgress from "nprogress";
import { useEffect } from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParamsSafe();

  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.1,
      speed: 300,
      easing: 'ease',
    });

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isNavigationElement = 
        target.tagName === 'A' || 
        target.closest('a')

      if (isNavigationElement) {
        NProgress.start();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      NProgress.done();
    };
  }, []);

  useEffect(() => {
   
    NProgress.done(); 
    NProgress.start(); 
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}
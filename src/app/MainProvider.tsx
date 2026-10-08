"use client";
import { store } from "@/redux/store";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Provider } from "react-redux";

const NextTopLoader = dynamic(() => import("nextjs-toploader"), { ssr: false });

function ScrollToTopOnNavigation() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    // Browser Back/Forward can restore the previous page's depth after a route change.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    // A destination hash is an explicit request to land on that section.
    if (window.location.hash) return;

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previousScrollBehavior;
    });

    return () => {
      window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [pathname]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NextTopLoader color="#0d7377" height={3} showSpinner={false} />
      <ScrollToTopOnNavigation />
      {children}
    </Provider>
  );
}

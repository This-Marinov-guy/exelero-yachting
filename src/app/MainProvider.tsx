"use client";
import { store } from "@/redux/store";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";

const NextTopLoader = dynamic(() => import("nextjs-toploader"), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NextTopLoader color="#0d7377" height={3} showSpinner={false} />
      {children}
    </Provider>
  );
}

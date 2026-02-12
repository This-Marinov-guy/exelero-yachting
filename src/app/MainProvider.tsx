"use client";
import { store } from "@/redux/store";
import NoSsr from "@/utils/NoSsr";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NoSsr>
      <NextTopLoader color="#0d7377" height={3} showSpinner={false} />
      <Provider store={store}>{children}</Provider>
    </NoSsr>
  );
}

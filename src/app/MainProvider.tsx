"use client";
import { store } from "@/redux/store";
import NoSsr from "@/utils/NoSsr";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NoSsr>
      <Provider store={store}>{children}</Provider>
    </NoSsr>
  );
}

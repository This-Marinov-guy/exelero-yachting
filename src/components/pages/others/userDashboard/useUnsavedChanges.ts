"use client";
import { createContext, useContext, useEffect } from "react";
export const UnsavedChangesContext = createContext<(dirty: boolean) => void>(() => {});
export function useUnsavedChanges(dirty: boolean) {
  const report = useContext(UnsavedChangesContext);
  useEffect(() => { report(dirty); }, [dirty, report]);
  useEffect(() => () => report(false), [report]);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
}

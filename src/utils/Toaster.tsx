import { Toaster } from "sonner";

export const CustomToaster = () => (
  <Toaster
    richColors
    position="top-right"
    duration={5000}
    toastOptions={{
      style: {
        fontWeight: 600,
      },
    }}
  />
);

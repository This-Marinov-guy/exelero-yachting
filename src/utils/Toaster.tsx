import { Toaster } from "sonner";

export const CustomToaster = () => (
  <Toaster
    richColors
    position="bottom-right"
    duration={1800}
    toastOptions={{
      style: {
        fontWeight: 600,
      },
    }}
  />
);

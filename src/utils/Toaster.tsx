import { Toaster } from "react-hot-toast";

export const CustomToaster = () => (
  <Toaster
    toastOptions={{
      duration: 1500,
      success: {
        style: {
          minWidth: 200,
          background: "rgb(229, 245, 227)",
          color: "rgba(var(--success), 1)",
          fontWeight: 700,
        },
      },
      error: {
        style: {
          minWidth: 200,
          background: "rgb(255, 238, 237)",
          fontWeight: 700,
          color: "rgba(var(--error), 1)",
        },
      },
    }}
  />
);

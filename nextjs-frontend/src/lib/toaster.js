import { toast } from "sonner";

export const successToast = (message) => {
  toast.success(message, {
    duration: 4000,
    style: {
      backgroundColor: "#ecfdf5",
      color: "#047857",
      border: "1px solid #a7f3d0",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    position: "top-right",
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    duration: 4000,
    style: {
      backgroundColor: "#fef2f2",
      color: "#f87171",
      border: "1px solid #fca5a5",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    position: "top-right",
  });
};

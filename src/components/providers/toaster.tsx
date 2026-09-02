"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function AppToaster() {
  const [position, setPosition] = useState<"top-center" | "bottom-right">(
    "bottom-right",
  );

  useEffect(() => {
    const updatePosition = () => {
      setPosition(window.innerWidth < 640 ? "top-center" : "bottom-right");
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <Toaster
      position={position}
      theme="dark"
      richColors
      closeButton
      expand={false}
      visibleToasts={3}
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "medipass-toast",
          title: "medipass-toast-title",
          description: "medipass-toast-description",
          closeButton: "medipass-toast-close",
          success: "medipass-toast-success",
          error: "medipass-toast-error",
          warning: "medipass-toast-warning",
          info: "medipass-toast-info",
          loading: "medipass-toast-loading",
          actionButton: "medipass-toast-action",
          cancelButton: "medipass-toast-cancel",
        },
      }}
    />
  );
}

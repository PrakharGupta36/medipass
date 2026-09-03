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
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "border-white/[0.08] bg-[#111712] text-white shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
          title: "text-sm font-semibold",
          description: "text-xs text-white/45",
        },
      }}
    />
  );
}

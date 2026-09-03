"use client";

import { bind } from "cuelume";
import { useEffect } from "react";

export default function CuelumeProvider() {
  useEffect(() => {
    bind();
  }, []);

  return null;
}

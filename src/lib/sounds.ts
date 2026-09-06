// src/lib/sounds.ts
import { play } from "cuelume";

export const playHoverSound = () => {
  play("tick", { volume: 1 });
};

export const playSelectSound = () => {
  play("release", { volume: 1 });
};

export const playToggleSound = (expanding: boolean) => {
  play(expanding ? "bloom" : "droplet", { volume: 1});
};

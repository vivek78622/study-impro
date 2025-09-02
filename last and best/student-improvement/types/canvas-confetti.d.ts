declare module "canvas-confetti" {
  export interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: ("square" | "circle")[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    resize?: boolean;
  }
  
  interface ConfettiOrigin {
    x?: number;
    y?: number;
  }
  
  function confetti(options?: Options): Promise<void>;
  function confetti(origin: ConfettiOrigin, options?: Options): Promise<void>;
  
  export default confetti;
}



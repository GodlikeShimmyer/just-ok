import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-muted group-hover:h-1.5 transition-all">
      <SliderPrimitive.Range className="absolute h-full bg-foreground group-hover:bg-primary transition-colors" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-0 w-0 group-hover:h-3 group-hover:w-3 rounded-full bg-foreground shadow-md ring-offset-background transition-all focus-visible:outline-none focus-visible:h-3 focus-visible:w-3 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

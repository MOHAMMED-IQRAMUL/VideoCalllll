"use client";

import type { ReactNode, SVGProps } from "react";

type IconName = "call" | "incoming" | "outgoing" | "end" | "mic" | "mic-off" | "camera" | "camera-off" | "panel-open" | "panel-close";

const paths: Record<IconName, ReactNode> = {
  call: <path d="M7.2 3.5 4.8 5.9c-.7.7-.9 1.8-.5 2.7 1.8 4.3 5.3 7.8 9.6 9.6.9.4 2 .2 2.7-.5l2.4-2.4-3.3-2.5-2 1.4a12.2 12.2 0 0 1-4.2-4.2l1.4-2-2.5-3.3Z" />,
  incoming: <><path d="m15 4 5 5" /><path d="M20 4v5h-5" /><path d="M7.2 3.5 4.8 5.9c-.7.7-.9 1.8-.5 2.7 1.8 4.3 5.3 7.8 9.6 9.6.9.4 2 .2 2.7-.5l1.2-1.2" /></>,
  outgoing: <><path d="m9 20-5-5" /><path d="M4 20v-5h5" /><path d="M16.8 20.5 19.2 18c.7-.7.9-1.8.5-2.7a18.5 18.5 0 0 0-9.6-9.6c-.9-.4-2-.2-2.7.5L6.2 7.4" /></>,
  end: <><path d="M4.5 10.5c4.9-2.7 10.1-2.7 15 0" /><path d="M6 10.8 4.2 16l4.2 1.2 1.3-3.1M18 10.8l1.8 5.2-4.2 1.2-1.3-3.1" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" /></>,
  "mic-off": <><path d="m3 3 18 18M9 5.5v5.2a3 3 0 0 0 4.5 2.6M15 9V6a3 3 0 0 0-5.5-1.7M5.5 11a6.5 6.5 0 0 0 10.2 5.3M12 17.5V21M9 21h6" /></>,
  camera: <><path d="M14 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z" /><path d="m16 10 5-3v10l-5-3" /></>,
  "camera-off": <><path d="m3 3 18 18M10 6h4a2 2 0 0 1 2 2v1M16 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1M16 10l5-3v10l-5-3" /></>,
  "panel-open": <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 4v16M13 12h4M15 10l2 2-2 2" /></>,
  "panel-close": <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 4v16M17 12h-4M15 10l-2 2 2 2" /></>,
};

export default function CallIcon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}

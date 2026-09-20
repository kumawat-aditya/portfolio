"use client";

import type { CursorId, CursorState } from "@/lib/cursors";

/* drawings stay in a 32 viewBox and get scaled by the family size */

export function CursorMark({
  family,
  state,
}: {
  family: Exclude<CursorId, "system">;
  state: CursorState;
}) {
  const marks = {
    "carpenter-pencil": <Pencil />,
    "ruling-pen": <Ruling />,
    "eraser-crumb": <Crumb />,
    "torn-paper": <Torn />,
  } as const;

  return (
    <svg
      viewBox="0 0 32 32"
      className="cursor-mark overflow-visible"
      data-family={family}
      data-state={state}
      aria-hidden="true"
    >
      <circle
        className="cursor-orbit"
        cx="16"
        cy="16"
        r="14.5"
        fill="none"
        strokeWidth="0.9"
        strokeDasharray="1.8 2.6"
      />
      {marks[family]}
    </svg>
  );
}

function Pencil() {
  return (
    <g className="cursor-body">
      <path
        className="cursor-fill cursor-stroke"
        d="M7 25 L18 7 L21.2 9.1 L10.2 27.2 Z"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        className="cursor-lead cursor-stroke"
        d="M18.1 7.1 L23.6 3.2 L25.6 6.2 L21.2 9.1 Z"
        strokeWidth="1"
      />
      <path
        className="cursor-stroke"
        d="M9.4 23.2 L20.2 8.4"
        strokeWidth=".55"
        opacity=".4"
      />
      <circle className="cursor-deposit" cx="26" cy="4" r="1.4" />
      <path className="cursor-slash" d="M8 8 L24 24" strokeWidth="1.3" />
      <g className="cursor-text-i" strokeWidth="1.3" strokeLinecap="round">
        <path d="M11 5h10M16 5v22M11 27h10" />
      </g>
    </g>
  );
}

function Ruling() {
  return (
    <g className="cursor-body">
      <path
        className="cursor-stroke cursor-blade-a"
        d="M7 26 L22 7"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        className="cursor-stroke cursor-blade-b"
        d="M9.2 27 L24.2 8"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        className="cursor-stroke"
        d="M6.2 23.5h5.5M8.4 26.4h4"
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      <circle className="cursor-tip" cx="23.6" cy="6.4" r="1.5" />
      <path className="cursor-slash" d="M8 8 L24 24" strokeWidth="1.3" />
      <g className="cursor-text-i" strokeWidth="1.15" strokeLinecap="round">
        <path d="M12 5v22M20 5v22M10 5h6M12 27h6M18 5h6M20 27h6" />
      </g>
    </g>
  );
}

function Crumb() {
  return (
    <g className="cursor-body">
      <path
        className="cursor-fill cursor-stroke cursor-chunk"
        d="M12 13 l3.4-3.4 4.3 1.3 2.5 4.2-1.7 3.8-4.7.9-3.8-2.5z"
        strokeWidth="1"
      />
      <circle className="cursor-speck cursor-speck-a" cx="9.4" cy="21.2" r="1.1" />
      <circle className="cursor-speck cursor-speck-b" cx="22.6" cy="11.4" r=".85" />
      <circle className="cursor-speck cursor-speck-c" cx="21.2" cy="22.4" r="1" />
      <path className="cursor-slash" d="M8 8 L24 24" strokeWidth="1.3" />
      <g className="cursor-text-i">
        <rect x="11" y="5" width="10" height="2.2" />
        <rect x="14.2" y="5" width="2.4" height="22" />
        <rect x="11" y="24.8" width="10" height="2.2" />
      </g>
    </g>
  );
}

function Torn() {
  return (
    <g className="cursor-body">
      <g className="cursor-tear">
        <path
          className="cursor-fill cursor-stroke"
          d="M9 9.5 L22 7.4 l2.4 3.2-1.6 4 3.2 2.4-4 3.2.8 4-6.4 1.6-3.2-4.8 1.6-4-4-2.4z"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          className="cursor-stroke"
          d="M11.4 11.2 l7.2-.8M10.6 15.2 l8.8 1.6M12.2 20 l6.4.8"
          strokeWidth=".55"
          opacity=".45"
        />
      </g>
      <path className="cursor-slash" d="M8 8 L24 24" strokeWidth="1.3" />
      <g className="cursor-text-i">
        <path d="M12 5h2l.8 22h-2z" />
        <path d="M18 5h2l.8 22h-2z" />
      </g>
    </g>
  );
}

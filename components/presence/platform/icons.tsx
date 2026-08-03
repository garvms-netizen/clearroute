/**
 * Interface icons for the platform mockups.
 *
 * Every glyph here is drawn from scratch. These are the generic UI shapes the
 * whole industry shares — a heart for a reaction, a speech bubble for a
 * comment, a paper plane for a share, a bookmark for a save — not any
 * platform's proprietary icon set.
 *
 * What is deliberately absent: no platform logo or wordmark appears anywhere
 * in these mockups. A real profile screen shows the account's own name in its
 * top bar rather than the app's logo, so the mockups stay convincing without
 * reproducing a trademark. The only brand mark shown is Clear Route's own.
 */

type P = { size?: number; filled?: boolean; className?: string; color?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  "aria-hidden": true as const,
});

export const HeartIcon = ({ size = 24, filled, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path
      d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5.1-7.5 9.7-7.5 9.7Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
  </svg>
);

export const CommentIcon = ({ size = 24, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path
      d="M20.5 11.7c0 4.1-3.8 7.4-8.5 7.4a9.6 9.6 0 0 1-2.6-.35L4.5 20.5l1.3-3.6A7 7 0 0 1 3.5 11.7c0-4.1 3.8-7.4 8.5-7.4s8.5 3.3 8.5 7.4Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareIcon = ({ size = 24, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path
      d="M21.5 3.5 10.8 14.2M21.5 3.5l-6.9 17.6-3.8-6.9-6.9-3.8L21.5 3.5Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const SaveIcon = ({ size = 24, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path
      d="M6 3.5h12v17l-6-4.6-6 4.6v-17Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const GridIcon = ({ size = 22, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path d="M3.5 3.5h17v17h-17zM9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const TagIcon = ({ size = 22, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path d="M3.5 6.5h17v11h-17z" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="10.5" r="2" stroke={color} strokeWidth="1.5" />
    <path d="M7.5 15.5c1-1.8 2.6-2.6 4.5-2.6s3.5.8 4.5 2.6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ReelIcon = ({ size = 22, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path d="M3.5 3.5h17v17h-17zM3.5 8.5h17M8.8 3.5 11.5 8.5M14.2 3.5 16.9 8.5" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10.5 12v5l4.5-2.5-4.5-2.5Z" fill={color} />
  </svg>
);

export const ChevronLeft = ({ size = 22, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path d="M15 4.5 7.5 12l7.5 7.5" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DotsIcon = ({ size = 22, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <circle cx="5" cy="12" r="1.6" fill={color} />
    <circle cx="12" cy="12" r="1.6" fill={color} />
    <circle cx="19" cy="12" r="1.6" fill={color} />
  </svg>
);

export const HomeIcon = ({ size = 22, color = "currentColor", filled }: P) => (
  <svg {...base(size)}>
    <path d="M3.5 10.5 12 3.5l8.5 7v9.5h-6v-6h-5v6h-6v-9.5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill={filled ? color : "none"} />
  </svg>
);

export const SearchIcon = ({ size = 22, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <circle cx="10.8" cy="10.8" r="6.3" stroke={color} strokeWidth="1.7" />
    <path d="m15.6 15.6 4.4 4.4" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const GlobeIcon = ({ size = 14, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.6" />
    <path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const RepostIcon = ({ size = 20, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path d="M4.5 9.5V8a2.5 2.5 0 0 1 2.5-2.5h9.5M16.5 3l3 2.5-3 2.5M19.5 14.5V16a2.5 2.5 0 0 1-2.5 2.5H7.5M7.5 21l-3-2.5 3-2.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SendIcon = ({ size = 20, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path d="M3.5 12 20.5 4.5 16 20.5l-4.2-5.3L3.5 12Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

export const ThumbIcon = ({ size = 20, color = "currentColor" }: P) => (
  <svg {...base(size)}>
    <path d="M7 10.5v9H4.5v-9H7Zm0 0 4-7a2 2 0 0 1 2.8 2.4l-1 3.6h4.4a2 2 0 0 1 2 2.5l-1.6 6a2 2 0 0 1-2 1.5H7v-9Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

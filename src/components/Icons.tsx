import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P): P => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...p,
});

export const InstagramIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
export const FacebookIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.9v3h2.6V21" />
  </svg>
);
export const TikTokIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 3v11.2a3.8 3.8 0 1 1-3.8-3.8" />
    <path d="M14 3c.3 2.6 1.9 4.3 5 4.5" />
  </svg>
);
export const YouTubeIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10.5 9.5 4.5 2.5-4.5 2.5z" fill="currentColor" />
  </svg>
);
export const ArrowIcon = (p: P) => (
  <svg {...base({ strokeWidth: 2, ...p })}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base({ strokeWidth: 2, ...p })}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base({ strokeWidth: 2, ...p })}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base({ strokeWidth: 2.2, ...p })}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const LockIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);
export const PinIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const UserIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" />
  </svg>
);
export const PlayIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);
export const MailIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);
export const PhoneIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

export const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
} as const;

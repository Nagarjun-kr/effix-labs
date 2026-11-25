import type { ReactNode } from "react";

type SocialProfile = { name: string; href: string; icon: ReactNode };

const profiles: SocialProfile[] = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/effix-labs/posts/?viewAsMember=true",
    icon: <><path fill="#0A66C2" d="M5.4 9.1h3.2v10.3H5.4zM7 4.1a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7Zm3.5 5h3.1v1.4h.04c.43-.82 1.48-1.68 3.04-1.68 3.25 0 3.85 2.14 3.85 4.92v5.66h-3.23v-5.02c0-1.2-.02-2.73-1.67-2.73-1.68 0-1.94 1.3-1.94 2.65v5.1H10.5V9.1Z" /></>,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61596665678362",
    icon: <path fill="#0866FF" d="M13.7 21.6v-8h2.7l.4-3.1h-3.1V8.5c0-.9.3-1.5 1.6-1.5H17V4.2c-.3 0-1.4-.2-2.7-.2-2.7 0-4.5 1.6-4.5 4.7v1.8h-3v3.1h3v8h3.9Z" />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/effixlabs/",
    icon: <>
      <defs><linearGradient id="effix-instagram-gradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse"><stop stopColor="#FFDC80" /><stop offset=".32" stopColor="#F77737" /><stop offset=".65" stopColor="#E1306C" /><stop offset="1" stopColor="#833AB4" /></linearGradient></defs>
      <path fill="url(#effix-instagram-gradient)" d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
    </>,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UC5LO8LT7fJ-__CEfCIMAIHw",
    icon: <><path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.56 12 3.56 12 3.56s-7.55 0-9.4.52A3 3 0 0 0 .5 6.2C0 8.06 0 12 0 12s0 3.94.5 5.8a3 3 0 0 0 2.1 2.12c1.85.52 9.4.52 9.4.52s7.55 0 9.4-.52a3 3 0 0 0 2.1-2.12c.5-1.86.5-5.8.5-5.8s0-3.94-.5-5.8Z" /><path fill="#fff" d="m9.55 15.56 6.27-3.56-6.27-3.56v7.12Z" /></>,
  },
];

export default function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Social media">
      {profiles.map(({ name, href, icon }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{icon}</svg>
        </a>
      ))}
    </nav>
  );
}

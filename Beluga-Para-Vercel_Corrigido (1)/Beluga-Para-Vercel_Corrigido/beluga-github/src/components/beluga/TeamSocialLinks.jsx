import { Github, Instagram, Linkedin } from "lucide-react";

const networks = [
  { key: "github", label: "GitHub", Icon: Github },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "instagram", label: "Instagram", Icon: Instagram },
];

export function TeamSocialLinks({ name, profiles }) {
  if (!profiles) return null;

  return (
    <div className="team-socials">
      {networks.map(({ key, label, Icon }) =>
        profiles[key] ? (
          <a
            key={key}
            href={profiles[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} de ${name} (abre em nova aba)`}
          >
            <Icon size={15} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ) : null,
      )}
    </div>
  );
}

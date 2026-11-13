import { TeamAvatar } from "../components/beluga/TeamAvatar";
import { TeamSocialLinks } from "../components/beluga/TeamSocialLinks";
import { media, teamProfiles } from "../config/content";
import { team } from "../config/originalContent";

export function Team() {
  return (
    <>
      <section id="equipe" className="team-section section-space">
        <div className="page-width">
          <div className="section-top reveal">
            <span className="eyebrow">A equipe</span>
          </div>
          <div className="section-heading reveal">
            <h2 data-text-reveal>
              Quem fez <span className="text-primary">o Beluga.</span>
            </h2>
            <p>
              Entre fotos, código e documentação, cada um contribuiu de um
              jeito. Este é o trabalho dos quatro estudantes que desenvolveram o
              projeto.
            </p>
          </div>
          <div className="team-grid reveal">
            {team.map((member, index) => (
              <article
                key={member.name}
                className={`team-member member-${index}`}
              >
                <div
                  className={
                    media.team[member.name]
                      ? media.team[member.name].type === "photo"
                        ? "team-photo team-portrait"
                        : "team-photo team-avatar"
                      : "team-photo"
                  }
                >
                  {media.team[member.name]?.type === "photo" ? (
                    <img
                      src={media.team[member.name].src}
                      alt={`Foto de ${member.name}`}
                      loading="lazy"
                      width="150"
                      height="150"
                    />
                  ) : media.team[member.name] ? (
                    <TeamAvatar
                      name={member.name}
                      src={media.team[member.name].src}
                    />
                  ) : (
                    <>
                      <span className="team-initials">{member.initials}</span>
                      <span className="photo-label">Retrato em breve</span>
                    </>
                  )}
                </div>
                <div className="team-name">
                  <h3>{member.name}</h3>
                </div>
                <p>{member.role}</p>
                <p className="team-contribution">{member.contribution}</p>
                <TeamSocialLinks
                  name={member.name}
                  profiles={teamProfiles[member.name]}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

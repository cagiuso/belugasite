// Enquadra a parte visível dos PNGs sem alterar os arquivos ou esticar o desenho.
// Os quatro enquadramentos são quadrados e vão da antena até os pés.
const avatarFrames = {
  "Eduarda Mazzari": { width: 1246, height: 1262, viewBox: "57.5 66 1137 1137" },
  "Guilherme Hideki": { width: 1186, height: 1326, viewBox: "9 97 1132 1132" },
  "Carlos Vicente": { width: 1194, height: 1317, viewBox: "-7.5 59 1149 1149" },
  "Henzo Montanari": { width: 1057, height: 1488, viewBox: "-76.5 115 1251 1251" },
};

export function TeamAvatar({ name, src }) {
  const frame = avatarFrames[name];

  if (!frame) {
    return <img src={src} alt={`Avatar de ${name}`} loading="lazy" />;
  }

  return (
    <svg
      className="team-avatar-portrait"
      viewBox={frame.viewBox}
      role="img"
      aria-label={`Avatar de ${name}`}
      preserveAspectRatio="xMidYMax meet"
    >
      <image href={src} width={frame.width} height={frame.height} />
    </svg>
  );
}

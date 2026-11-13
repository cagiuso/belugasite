function Words({ text }) {
  return text.split(" ").map((word, index) => (
    <span className="tour-word" key={`${word}-${index}`}>
      {index > 0 ? " " : ""}
      <span className="tour-word-inner">
        {Array.from(word).map((character, i) => (
          <span className="tour-char" key={i}>
            {character}
          </span>
        ))}
      </span>
    </span>
  ));
}

export function AnimatedPurposeTitle() {
  return (
    <h2
      className="purpose-title"
      aria-label="A tecnologia só avança quando todos avançam juntos."
    >
      <span aria-hidden="true">
        <Words text="A tecnologia só avança" />
        <br />
        <Words text="quando" />{" "}
        <span className="text-primary">
          <Words text="todos" />
          <br />
          <Words text="avançam juntos." />
        </span>
      </span>
    </h2>
  );
}

import { useState } from "react";

const films = [
  { id: "Foundation", label: "Foundation", title: "Access. Assurance. Intelligence.", description: "Platforms for better health and public systems." },
  { id: "Health", label: "SozoRock Health", title: "A clearer path to care.", description: "Health Equity Hubs and Health Access Day connect communities around local access needs." },
  { id: "PlaceIntelligence", label: "Place Intelligence", title: "Start with a place. Follow the evidence.", description: "Read public evidence with its geography, source, date, and limits." },
  { id: "CBCAP", label: "CB-CAP", title: "From local evidence to planning questions.", description: "Compare county context. Test a scenario. Build a stakeholder brief." },
];

export function PlatformFilms() {
  const [selected, setSelected] = useState("Foundation");
  const film = films.find(({ id }) => id === selected);
  return <section className="section platform-films" id="introductions" aria-labelledby="films-heading">
    <div className="shell">
      <div className="section-heading"><div><p className="eyebrow">Watch</p><h2 id="films-heading">Meet the platforms.</h2></div></div>
      <div className="platform-films-grid">
        <div>
          <div className="film-selector" role="group" aria-label="Choose an introduction">
            {films.map(({ id, label }) => <button key={id} type="button" aria-pressed={selected === id} onClick={() => setSelected(id)}>{label}</button>)}
          </div>
          <div className="film-transcript" aria-live="polite">
            <h3>{film.title}</h3>
            <p>{film.description}</p>
            <p className="film-duration">12 seconds · All text is on screen · No audio required</p>
          </div>
        </div>
        <video key={film.id} controls playsInline preload="none" poster={`/media/introductions/${film.id}.png`} aria-label={`${film.label} introduction`}>
          <source src={`/media/introductions/${film.id}.mp4`} type="video/mp4" />
          <a href={`/media/introductions/${film.id}.mp4`}>Download the {film.label} introduction</a>
        </video>
      </div>
    </div>
  </section>;
}

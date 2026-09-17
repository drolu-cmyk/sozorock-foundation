import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const routes = [
  {
    title: "Health access",
    copy: "Understand where access breaks, then test a nonclinical path into ongoing care.",
    proof: "2025 roundtable evidence informs a planned 2027 New York pilot.",
    href: "/platforms/health",
  },
  {
    title: "Applied learning",
    copy: "Move graduate cybersecurity learners from academic knowledge into practical work.",
    proof: "Two Capella University cohorts, 11 learners, six months per cohort.",
    href: "/platforms/applied-learning",
  },
  {
    title: "Research",
    copy: "Turn field questions into citable frameworks that institutions can examine and use.",
    proof: "Research on health access, rural governance and digital health assurance.",
    href: "/publications",
  },
  {
    title: "AI and Society",
    copy: "Make participation, human review and accountability visible when AI affects people.",
    proof: "Public process design for consequential decisions in learning and work.",
    href: "/ai-society",
  },
];

export function WorkPage() {
  return (
    <>
      <section className="experience-page-hero work-experience-hero final-page-hero" aria-labelledby="work-page-title">
        <div className="shell experience-page-hero-inner">
          <h1 id="work-page-title">Start with the problem.</h1>
          <p>Access to care. Practical technology capability. Evidence behind a decision. Human accountability in AI. SozoRock builds around the question, not a program catalog.</p>
        </div>
      </section>

      <section className="work-route-section final-work-routes" aria-label="What SozoRock does">
        <div className="shell work-route-list">
          {routes.map((route) => (
            <Link href={route.href} className="work-route" key={route.title}>
              <div>
                <h2>{route.title}</h2>
                <p>{route.copy}</p>
                <small>{route.proof}</small>
              </div>
              <ArrowRight size={34} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="experience-close">
        <div className="shell experience-close-inner">
          <h2>Have a problem that crosses these lines?</h2>
          <p>Bring the people affected, the decision ahead and the result you need. We will determine whether the Foundation has a useful role.</p>
          <Link href="/partner" className="experience-link">Start a conversation<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}

import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const routes = [
  {
    title: "Health access",
    copy: "Design and test nonclinical pathways that help residents reach ongoing care, supported by place-based evidence.",
    note: "Current focus: 2027 New York health-access pilot",
    href: "/platforms/health",
  },
  {
    title: "Applied learning",
    copy: "Build technology capability through real problems, practitioner guidance and evidence-based review.",
    note: "Graduate cybersecurity engagement documented across 2025–26",
    href: "/platforms/applied-learning",
  },
  {
    title: "Research & assurance",
    copy: "Produce public-interest research that helps institutions examine evidence, governance and accountable implementation.",
    note: "Publications and research records",
    href: "/publications",
  },
  {
    title: "AI & Society",
    copy: "Create practical routes for participation, human review and accountability when AI affects people and institutions.",
    note: "Public-interest research and convening",
    href: "/ai-society",
  },
];

export function WorkPage() {
  return (
    <>
      <section className="experience-page-hero work-experience-hero" aria-labelledby="work-page-title">
        <div className="shell experience-page-hero-inner">
          <h1 id="work-page-title">Different problems. Clear routes into the work.</h1>
          <p>Start with the outcome you need: improve access to care, build applied capability, strengthen the evidence behind a decision, or examine how AI should be governed.</p>
        </div>
      </section>

      <section className="work-route-section" aria-label="Foundation work">
        <div className="shell work-route-list">
          {routes.map((route) => (
            <Link href={route.href} className="work-route" key={route.title}>
              <div>
                <h2>{route.title}</h2>
                <p>{route.copy}</p>
                <small>{route.note}</small>
              </div>
              <ArrowRight size={34} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="experience-close">
        <div className="shell experience-close-inner">
          <h2>Not sure where the problem fits?</h2>
          <p>Bring the question, the people affected and the decision ahead. We will determine whether there is a useful role for the Foundation.</p>
          <Link href="/partner" className="experience-link">Start a conversation<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}

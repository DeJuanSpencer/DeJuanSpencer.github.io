import {
  ABOUT_BODY,
  EMAIL,
  EXPLORING_BODY,
  FOOTER_LABELS,
  GITHUB_URL,
  LABELS,
  LINKEDIN_URL,
  MASTHEAD,
  PERSON,
  PROJECTS,
  SITE_URL,
  STANZIX_URL,
  type Project,
} from "../content";

const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: MASTHEAD.name,
  jobTitle: PERSON.jobTitle,
  worksFor: { "@type": "Organization", name: PERSON.worksFor },
  url: SITE_URL,
  sameAs: [GITHUB_URL, LINKEDIN_URL, STANZIX_URL].filter(Boolean),
});

function ProjectRow({ project }: { project: Project }) {
  const classes = [
    "project",
    project.lead ? "lead" : "",
    project.hairline ? "hairline" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (project.lead) {
    return (
      <article className={classes}>
        <div className="title-row">
          <h2>{project.title}</h2>
          {project.live && (
            <>
              <span className="dot" aria-hidden="true" />
              <span className="label">{LABELS.live}</span>
            </>
          )}
        </div>
        <p className="body">{project.body}</p>
        {project.link && (
          <p className="link-row">
            <a href={project.link.href}>{project.link.label}</a>
          </p>
        )}
        <p className="label tags tags-right">{project.tags}</p>
      </article>
    );
  }

  return (
    <article className={classes}>
      <h2>{project.title}</h2>
      <p className="label tags">{project.tags}</p>
      <p className="body">{project.body}</p>
      {project.link && (
        <p className="link-row">
          <a href={project.link.href}>{project.link.label}</a>
        </p>
      )}
    </article>
  );
}

export default function Page() {
  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd }}
      />
      <header className="masthead">
        <h1>{MASTHEAD.name}</h1>
        <p className="subline">{MASTHEAD.subline}</p>
      </header>
      <main>
        <section className="section">
          <p className="label">{LABELS.work}</p>
          {PROJECTS.map((project) => (
            <ProjectRow key={project.title} project={project} />
          ))}
        </section>
        <section className="section">
          <p className="label">{LABELS.exploring}</p>
          <p className="body">{EXPLORING_BODY}</p>
        </section>
        <section className="section">
          <p className="label">{LABELS.about}</p>
          <p className="body">{ABOUT_BODY}</p>
        </section>
      </main>
      <footer>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        {GITHUB_URL && <a href={GITHUB_URL}>{FOOTER_LABELS.github}</a>}
        {LINKEDIN_URL && <a href={LINKEDIN_URL}>{FOOTER_LABELS.linkedin}</a>}
      </footer>
    </div>
  );
}

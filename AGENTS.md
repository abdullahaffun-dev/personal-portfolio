# Website Agent Operating Rules

## Mission

Maintain Abdullah Affun's existing portfolio at https://abdullahaffun.pages.dev/ as a reliable, polished, secure, accessible, and discoverable static website. Improve it incrementally without changing its identity or making decisions on the owner's behalf.

## Understand the project before editing

- This is a custom static website, not a framework-generated app.
- The main source files are `src/content.js`, `src/base.html`, `src/styles.css`, `src/site.js`, and `src/theme-preload.js`.
- `scripts/build.mjs` generates the deployable website in `dist/`.
- Run `npm run build` to validate and regenerate the site. The repository currently tracks generated `dist/` output: when source changes require generated files to change, regenerate them through the build script and inspect the diff. Never hand-edit generated files in `dist/` as a substitute for editing their source.
- The production hostname is `https://abdullahaffun.pages.dev`. Keep canonical URLs, Open Graph URLs, and sitemap URLs consistent with the actual production hostname. Do not change the domain or production environment without approval.

## Preserve the site's identity

- Brand: "Abdullah Affun" and "CURIOSITY OUT OF BOUNDS".
- Design direction: premium, minimal, technically curious, distinctive, and carefully composed. Preserve the existing dark/light themes, responsive layouts, interaction quality, and custom visual system.
- Do not introduce brown. Keep colors consistent with the existing restrained black, white/off-white, and blue-accent palette.
- Offensive security is currently a leading interest, but the site should remain open to other disciplines.
- Do not add generic portfolio copy, invented projects, fabricated metrics, testimonials, experience, qualifications, awards, clients, employment, or credentials.
- Do not rewrite the owner's public identity, biography, service claims, or major page content without explicit approval.

## Autonomy and approval policy

The owner wants mostly autonomous management, with approval reserved for consequential decisions.

May handle independently when the change is small, objective, reversible, and supported by checks:
- Fix reproducible bugs and broken internal links.
- Correct invalid markup, obvious accessibility defects, and responsive regressions.
- Make low-risk performance improvements that preserve appearance and behavior.
- Fix incorrect technical metadata when the correct value is unambiguous.
- Run regular site health, link, build, security-configuration, and technical SEO audits; report evidence and unresolved issues.

Create a branch and pull request, and request approval before:
- Significant visual redesigns, new sections/features, navigation changes, or changes to the site's conceptual direction.
- Changes to biography, claims, services, projects, public profiles, or other owner-specific content.
- Changes to the domain, Cloudflare configuration, deployment settings, DNS, secrets, authentication/access controls, response security headers, or permissions.
- Adding/removing dependencies, analytics or tracking, third-party scripts, external integrations, or paid services.
- Deleting pages/assets or making changes whose effects are difficult to reverse.
- Any change where intended behavior or truthfulness is uncertain.

Never commit straight to `main`, force-push, delete production data, expose credentials, or store API keys/tokens in the repository. Do not bypass required checks or approval safeguards. Routine fixes can be considered for unattended deployment only when repository policy explicitly allows it, the change meets the low-risk criteria above, and all relevant checks pass. Otherwise, stop at a pull request.

## Required workflow for code changes

1. Inspect the relevant source, build process, and current behavior before editing.
2. Explain the problem briefly and choose the smallest safe change.
3. Use a separate, descriptively named branch.
4. Edit source files first; do not patch generated output by hand.
5. Run `npm run build` and any available relevant checks. If a check cannot be run, say so explicitly.
6. Inspect the diff for unintended generated output, broken links, accidental content changes, leaked secrets, and unrelated edits.
7. Use a pull request with a concise summary, risks, tests actually run, and a rollback note for non-trivial changes.
8. Verify preview/prod behavior when a preview URL is available. Never claim a deployment or visual verification occurred unless it was actually checked.
9. Report what changed, the evidence that it works, anything not verified, and any action still requiring the owner's approval.

## Audit standards

- Separate confirmed findings from hypotheses.
- Prefer primary documentation and direct observations; include URLs/evidence for findings.
- Do not treat an automated scan as proof that a site is secure or that a page ranks well.
- For SEO, check titles/descriptions, canonical consistency, sitemap and robots behavior, status codes, internal links, structured-data validity, and mobile/accessibility basics where tools permit.
- For security, report risk and remediation without making intrusive tests against systems outside the owner's control.
- Minimize collected data. Do not add user tracking unless explicitly approved.
- Never conceal a failed check. When uncertain, stop at a proposal rather than guessing.

## Definition of done

A task is complete only when the requested result exists, relevant checks have been run and reported accurately, generated output is consistent with its source, and any required preview or owner approval has been handled.

# CMS Blog SEO Audit - 2026-07-10

Scope: published rows in `blog_posts`.

Rows checked: 90

Code-source consistency:
- Public blog article metadata title uses `post.title`.
- Public blog article H1 uses `post.title`.
- Public blog article metadata and visible excerpt use `post.description`.
- Public blog article metadata and visible keyword strip use `post.keywords`.
- `BlogPostJsonLd` uses the same `post.title`, `post.description`, and `post.keywords`.

Live CMS content findings:
- 0 published posts have keyword phrases that do not match the meta description topic by the local topic-overlap check.
- 0 published posts have title/H1 that does not sufficiently match the meta description topic.

Notes:
- The original audit check was read-only. The rows listed under `### de`, `### en`, `### es`, `### fr`, and `### ja` were updated on 2026-07-10.
- `application/ld+json` is generated from the same CMS `post.title`, `post.description`, and `post.keywords` fields, so these updates also change JSON-LD after the affected pages are revalidated or rebuilt.
- The topic check is conservative: it expects the title/H1 and keyword phrases to share meaningful tokens or close phrases with the meta description.
- Existing code has now been strengthened so future CMS saves reject title/H1 or keyword phrases that do not match the meta description topic.

## Issues

### de

Resolved on 2026-07-10. No published German CMS blog SEO issues remain in the automated check.

Updated rows:
- `de/ki-bewerbungsfoto-erstellen`
- `de/ki-selfie-in-avatar-stil-umwandeln`
- `de/magic-headshot-bewerbungsfoto-ki-kostenlos`
- `de/magic-headshot-ki-avatar-headshot-styles`
- `de/magic-headshot-ki-headshot-erstellen`
- `de/magic-headshot-ki-professionelle-portraetfotos`
- `de/passbilder-layout-zum-drucken`
- `de/passfoto-hintergrundfarbe-aendern`

### en

Resolved on 2026-07-10. No published English CMS blog SEO issues remain in the automated check.

Updated rows:
- `en/ai-headshot-generator-magic-headshot`
- `en/ai-headshots-for-college-admissions`
- `en/ai-selfie-to-professional-headshot`
- `en/free-document-photo-editor-online`
- `en/free-id-photo-print-sheet-maker-online`
- `en/free-id-photo-tool-online`
- `en/free-online-id-photo-maker-with-background-color-change`
- `en/free-passport-photo-editor-online-printable`
- `en/free-photo-utility-for-document-style-photos`
- `en/free-printable-photo-sheet-maker-online`
- `en/headshots-near-me-magic-headshot`
- `en/how-to-prepare-a4-photo-print`
- `en/magic-headshot-ai-headshot-generator`
- `en/magic-headshot-ai-resume-photo-editor`
- `en/online-headshot-generator`
- `en/professional-headshot-for-job-application`
- `en/professional-headshot-for-resume-ai-headshot-generator`
- `en/professional-headshots-without-studio-ai`
- `en/resize-image-to-passport-size-online`
- `en/selfie-to-professional-headshot-online-free`
- `en/what-kind-of-headshot-for-resume`

### es

Resolved on 2026-07-10. No published Spanish CMS blog SEO issues remain in the automated check.

Updated rows:
- `es/cambio-foto-curriculum-ia`
- `es/como-maquetar-fotos-carnet-para-imprimir`
- `es/foto-carnet-gratis-online`
- `es/foto-de-perfil-profesional-con-ia-gratis`
- `es/foto-para-curriculum-ai-gratis`
- `es/foto-profesional-para-curriculum-con-ia`
- `es/generar-foto-carnet-cambiar-fondo-imprimir`

### fr

Resolved on 2026-07-10. No published French CMS blog SEO issues remain in the automated check.

Updated rows:
- `fr/comment-mettre-en-page-photos-identite`
- `fr/creer-photo-profil-professionnelle-ia`
- `fr/generer-photo-identite-changer-fond-imprimer`
- `fr/magic-headshot-ai-photo-profil-professionnelle`
- `fr/photo-cv-ia-conseils`
- `fr/photo-de-profil-pour-cv-avec-intelligence-artificielle`
- `fr/photo-identite-ia-gratuite`

### ja

Resolved on 2026-07-10. No published Japanese CMS blog SEO issues remain in the automated check.

Updated rows:
- `ja/ai-avatar-headshot-selfie-to-professional`
- `ja/ai-headshot-for-resume-japan`
- `ja/ai-headshot-for-student-id-photo`
- `ja/ai-headshot-selfie-to-professional`
- `ja/ai-headshot-styles-from-selfies`
- `ja/ai-hedshot-selfie-kara-purofesshonaru-na-satsuei`
- `ja/create-document-photos-free-magic-headshot`
- `ja/rirekisho-shashin-app-muryo-osusume`
- `ja/rirekisho-shashin-sakusei-ai-headshot-guide`
- `ja/shomei-shashin-haikei-iro-henko`
- `ja/shomei-shashin-print-layout`
- `ja/shomei-shashin-sakusei-haikei-print`
- `ja/student-id-photo-ai`
- `ja/student-resume-photo-ai-guide`

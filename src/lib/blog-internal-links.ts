import type { BlogPostWithMeta } from '@/lib/blog-store'

export type BlogCtaContent = {
  photoTools: {
    heading: string
    description: string
    linkLabel: string
    href: string
  }
  workflow: {
    heading: string
    description: string
    linkLabel: string
    href: string
  }
  pricing: {
    heading: string
    description: string
    linkLabel: string
    href: string
  }
}

type InternalLink = {
  href: string
  label: string
  reason: string
}

type ToolTarget = {
  href: string
  label: string
  heading: string
  description: string
  linkLabel: string
  terms: string[]
}

const toolTargets: ToolTarget[] = [
  {
    href: '/photo-tools/remove-background',
    label: 'Remove background from a photo',
    heading: 'Remove or clean up the photo background',
    description:
      'Use the remove background tool when the guide mentions transparent PNGs, white backgrounds, product photos, ID photos, or cleaning up a profile image before publishing.',
    linkLabel: 'Open background remover',
    terms: [
      'remove background',
      'background remover',
      'delete background',
      'erase background',
      'transparent',
      'png',
      'cutout',
      'cut out',
      'no background',
      'white background',
      'signature',
      'product background',
    ],
  },
  {
    href: '/photo-tools/background-color-tool',
    label: 'Change photo background color',
    heading: 'Change the photo background color',
    description:
      'Use the background color tool to make a white, blue, red, or grey background for ID photos, resume photos, profile photos, and document-style images.',
    linkLabel: 'Open background color tool',
    terms: [
      'background color',
      'background colour',
      'change background',
      'white background',
      'blue background',
      'red background',
      'grey background',
      'gray background',
      'passport background',
      'id photo background',
    ],
  },
  {
    href: '/photo-tools/id-photo-crop',
    label: 'Crop an ID photo',
    heading: 'Crop an ID photo or resume photo',
    description:
      'Use the ID photo crop tool when the article is about passport-style photos, resume photos, student ID photos, exam photos, employee badges, or document photo framing.',
    linkLabel: 'Open ID photo crop',
    terms: [
      'id photo',
      'passport photo',
      'document photo',
      'student id',
      'exam photo',
      'employee badge',
      'resume photo',
      'cv photo',
      'one inch',
      'two inch',
    ],
  },
  {
    href: '/photo-tools/resize-image-to-kb',
    label: 'Resize image to KB',
    heading: 'Reduce image file size for upload',
    description:
      'Use the resize-to-KB tool when the guide is about upload limits, application forms, compressed images, KB requirements, or smaller JPG files.',
    linkLabel: 'Open KB resize tool',
    terms: [
      'kb',
      'compress',
      'file size',
      'reduce image size',
      'reduce photo size',
      'small size',
      'upload limit',
      'jpg size',
      'image size reducer',
    ],
  },
  {
    href: '/photo-tools/resize-image',
    label: 'Resize image dimensions',
    heading: 'Resize photo dimensions',
    description:
      'Use the image resize tool to change pixels, dimensions, width, height, or resolution before uploading a profile photo, resume photo, or document image.',
    linkLabel: 'Open image resizer',
    terms: [
      'resize image',
      'photo resizer',
      'picture resizer',
      'image dimensions',
      'photo size',
      'pixel',
      'resolution',
      'width',
      'height',
    ],
  },
  {
    href: '/photo-tools/print-layout-builder',
    label: 'Make a printable photo sheet',
    heading: 'Create a printable photo sheet',
    description:
      'Use the print layout builder when the guide is about passport photo sheets, 6 inch prints, A4 layouts, home printing, or preparing several ID photos on one page.',
    linkLabel: 'Open print layout builder',
    terms: [
      'print layout',
      'photo sheet',
      'print sheet',
      'passport photo sheet',
      '6 inch',
      'six inch',
      'a4',
      'print at home',
      'printing',
    ],
  },
  {
    href: '/photo-tools/aspect-ratio-crop',
    label: 'Crop by common aspect ratio',
    heading: 'Crop by common aspect ratio',
    description:
      'Use the aspect ratio crop tool when the article mentions profile image framing, social post sizes, fixed ratios, screenshots, or platform upload crops.',
    linkLabel: 'Open ratio crop tool',
    terms: [
      'aspect ratio',
      'ratio crop',
      'crop photo',
      'crop image',
      'crop picture',
      'profile picture size',
      'post size',
      'screenshot',
    ],
  },
  {
    href: '/photo-tools/shape-crop',
    label: 'Crop a round or shaped avatar',
    heading: 'Crop a round or shaped avatar',
    description:
      'Use the shape crop tool to make a circular avatar, heart crop, rounded profile icon, badge image, or transparent PNG for social profiles.',
    linkLabel: 'Open shape crop tool',
    terms: [
      'circle',
      'round',
      'shape crop',
      'avatar',
      'profile icon',
      'badge',
      'heart',
      'rounded',
    ],
  },
]

const professionalTerms = [
  'headshot',
  'professional photo',
  'professional picture',
  'linkedin',
  'resume',
  'cv',
  'business portrait',
  'business headshot',
  'corporate headshot',
  'team headshot',
  'profile photo',
  'profile picture',
  'job application',
  'founder',
  'consultant',
]

const linkedinTerms = ['linkedin', 'profile photo', 'profile picture']
const resumeTerms = ['resume', 'cv', 'job application']
const corporateTerms = ['corporate', 'business headshot', 'business portrait', 'team', 'company']

export function getEnglishBlogInternalLinks(post: BlogPostWithMeta, existingLinks?: InternalLink[]) {
  const text = searchablePostText(post)
  const tool = pickToolTarget(text)
  const workflow = pickWorkflowTarget(text)

  const links: InternalLink[] = [
    {
      href: tool.href,
      label: 'Edit this photo with a tool',
      reason: `Open ${tool.label.toLowerCase()} when this guide points to a crop, background, file size, PNG, or print-layout task.`,
    },
    {
      href: workflow.href,
      label: 'Generate a professional headshot',
      reason: workflow.reason,
    },
    {
      href: '/sample',
      label: 'Compare before-and-after samples',
      reason: 'Review before-and-after examples before choosing a profile photo direction.',
    },
    {
      href: '/pricing',
      label: 'Check credit pricing',
      reason: 'Compare one-time credit packs when the guide leads to final AI headshot generation.',
    },
  ]

  return dedupeLinks([...links, ...(existingLinks || [])]).slice(0, 4)
}

export function getEnglishBlogCtaContent(post: BlogPostWithMeta): BlogCtaContent {
  const text = searchablePostText(post)
  const tool = pickToolTarget(text)
  const workflow = pickWorkflowTarget(text)
  const toolFirst = hasToolIntent(text) || !hasProfessionalIntent(text)

  return {
    photoTools: {
      heading: 'Need to edit the photo now?',
      description: toolFirst
        ? `Open ${tool.label.toLowerCase()} to finish the crop, background, file size, PNG, or print-layout step from this guide.`
        : 'After reading this guide, use the photo tools to refine the crop, background, file size, or print layout before publishing a profile, resume, or ID-style photo.',
      linkLabel: tool.linkLabel,
      href: tool.href,
    },
    workflow: {
      heading: 'Need a polished profile photo?',
      description: workflow.description,
      linkLabel: workflow.linkLabel,
      href: workflow.href,
    },
    pricing: {
      heading: 'Ready to generate final images?',
      description:
        'Compare one-time credit packs before producing final images for a profile refresh, job application, team page, or photo workflow.',
      linkLabel: 'View pricing',
      href: '/pricing',
    },
  }
}

function pickToolTarget(text: string) {
  let best = toolTargets[0]
  let bestScore = -1

  for (const target of toolTargets) {
    const score = target.terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0)
    if (score > bestScore) {
      best = target
      bestScore = score
    }
  }

  return best
}

function pickWorkflowTarget(text: string) {
  if (linkedinTerms.some((term) => text.includes(term))) {
    return {
      href: '/ai-headshot-linkedin',
      label: 'Generate LinkedIn headshots',
      heading: 'Generate a professional LinkedIn headshot',
      description:
        'Upload a selfie and generate realistic professional headshots for LinkedIn, business profiles, resumes, and personal branding.',
      linkLabel: 'Generate LinkedIn headshots',
      reason: 'Use this page when the guide points toward a stronger LinkedIn profile photo.',
    }
  }

  if (resumeTerms.some((term) => text.includes(term))) {
    return {
      href: '/ai-headshot-resume',
      label: 'Generate resume photos',
      heading: 'Generate a resume-ready headshot',
      description:
        'Create a clean professional photo for resumes, job applications, CV pages, and profile updates after checking the image requirements.',
      linkLabel: 'Generate resume photos',
      reason: 'Use this page when the guide is about job applications, resumes, or CV profile photos.',
    }
  }

  if (corporateTerms.some((term) => text.includes(term))) {
    return {
      href: '/ai-headshot-corporate',
      label: 'Generate business headshots',
      heading: 'Generate business headshots',
      description:
        'Create consistent professional headshots for team pages, company profiles, founder bios, and business directories.',
      linkLabel: 'Generate business headshots',
      reason: 'Use this page when the guide is about teams, corporate portraits, or business profile images.',
    }
  }

  return {
    href: '/ai-headshot-professional-photo',
    label: 'Generate professional headshots',
    heading: 'Generate professional headshots',
    description:
      'Turn a clear selfie into a polished professional headshot for profiles, resumes, team pages, and public bios.',
    linkLabel: 'Generate professional headshots',
    reason: 'Use this page when the guide leads to a more polished profile photo.',
  }
}

function hasProfessionalIntent(text: string) {
  return professionalTerms.some((term) => text.includes(term))
}

function hasToolIntent(text: string) {
  return toolTargets.some((target) => target.terms.some((term) => text.includes(term)))
}

function searchablePostText(post: BlogPostWithMeta) {
  return [
    post.title,
    post.description,
    post.category,
    post.intro,
    ...(post.keywords || []),
    ...(post.sections || []).map((section) => `${section.heading} ${section.body}`),
    post.enhancement?.searchIntent,
    post.enhancement?.uniqueAngle,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .normalize('NFKC')
}

function dedupeLinks(links: InternalLink[]) {
  const seen = new Set<string>()
  const result: InternalLink[] = []

  for (const link of links) {
    if (!link.href || seen.has(link.href)) continue
    seen.add(link.href)
    result.push(link)
  }

  return result
}

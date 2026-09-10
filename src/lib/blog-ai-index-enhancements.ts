export type BlogAiIndexEnhancement = {
  answerLabel: string
  answerHeading: string
  directAnswer: string
  quickFacts: { label: string; value: string }[]
  table: {
    title: string
    headers: string[]
    rows: string[][]
    note: string
  }
  faqTitle: string
  faq: { question: string; answer: string }[]
  cta: { heading: string; description: string; label: string; href: string }
  links: { label: string; href: string }[]
}

const englishEnhancements: Record<string, BlogAiIndexEnhancement> = {
  resume: {
    answerLabel: 'Direct answer',
    answerHeading: 'What makes a resume photo work?',
    directAnswer: 'A good resume photo is current, recognizable, and calm enough to sit beside your name without distracting from your experience. If a photo is requested and no size is given, start with a clean square crop around 600 x 600 pixels or a 5 x 5 cm print version.',
    quickFacts: [
      { label: 'Best default crop', value: '1:1 square portrait' },
      { label: 'Digital starting point', value: '600 x 600 px or larger' },
      { label: 'Print starting point', value: '5 x 5 cm' },
      { label: 'Tone', value: 'Clean, current, restrained' },
    ],
    table: {
      title: 'Resume photo format guide',
      headers: ['Situation', 'Suggested format', 'Why it works'],
      rows: [
        ['No size requirement', '600 x 600 px, 1:1', 'Fits many digital resume and profile layouts'],
        ['Printed resume', '5 x 5 cm, 1:1', 'Visible without taking over the page'],
        ['Application form gives a size', 'Use the exact required size', 'The upload rule takes priority'],
        ['Country or employer discourages photos', 'Leave the photo out', 'Local hiring norms matter more than a generic template'],
      ],
      note: 'Resume photo expectations vary by country, role, and employer. Treat these as practical defaults, not universal rules.',
    },
    faqTitle: 'Resume photo FAQ',
    faq: [
      { question: 'Does every resume need a photo?', answer: 'No. Some countries and employers expect one, while others discourage it. Follow the job posting, local hiring norms, and application instructions.' },
      { question: 'What size should a resume photo be?', answer: 'If no size is provided, a square 600 x 600 pixel image or a 5 x 5 cm print version is a practical starting point.' },
      { question: 'Can I use an AI-generated resume photo?', answer: 'Yes, if it still looks like you, uses a natural crop, and avoids heavy retouching or an overproduced style.' },
      { question: 'Should my resume photo match LinkedIn?', answer: 'It can, but the resume version should usually be calmer. LinkedIn can tolerate a little more personality and profile visibility.' },
    ],
    cta: { heading: 'Create a resume-ready photo', description: 'Generate a professional portrait, then crop or resize it for the resume format you need.', label: 'Start with Magic-Headshot', href: '/upload' },
    links: [
      { label: 'Compare resume and LinkedIn photo choices', href: '/blog/resume-linkedin' },
      { label: 'Choose a professional profile photo', href: '/blog/profile-photo' },
      { label: 'Review AI headshot samples', href: '/sample' },
    ],
  },
  'resume-linkedin': {
    answerLabel: 'Direct answer',
    answerHeading: 'Should your resume photo and LinkedIn headshot be the same?',
    directAnswer: 'They can be the same if the photo is current, recognizable, and appropriately formal. Use a calmer crop for the resume and a profile-friendly square crop for LinkedIn when one image does not fit both contexts equally well.',
    quickFacts: [
      { label: 'Resume priority', value: 'Quiet document fit' },
      { label: 'LinkedIn priority', value: 'Small circular visibility' },
      { label: 'Shared requirement', value: 'High likeness' },
      { label: 'Useful export', value: 'Square high-resolution original' },
    ],
    table: {
      title: 'Resume photo vs LinkedIn headshot',
      headers: ['Use', 'Best crop', 'Style note', 'Check before publishing'],
      rows: [
        ['Resume', 'Small square or portrait crop', 'Calm, neutral, document-friendly', 'Does it support the layout without dominating it?'],
        ['LinkedIn', 'Square source for circular display', 'Clear face, warmer expression, visible at small size', 'Does the face still read in a feed or comment?'],
        ['Company bio', 'Consistent team crop', 'Matches the team page style', 'Does it fit beside other team portraits?'],
        ['Portfolio', 'Flexible crop', 'Can show slightly more personality', 'Does it match the work you want to attract?'],
      ],
      note: 'The same source portrait can produce multiple exports. Crop for the destination instead of forcing one file everywhere.',
    },
    faqTitle: 'Resume and LinkedIn photo FAQ',
    faq: [
      { question: 'Can I use my LinkedIn photo on my resume?', answer: 'Yes, if it is current, professional, and not too dramatic for the resume layout. Make a separate crop when the document needs it.' },
      { question: 'Which photo should be more formal?', answer: 'The resume photo usually benefits from a calmer, more restrained look. LinkedIn can be slightly warmer while still looking professional.' },
      { question: 'What crop works best for LinkedIn?', answer: 'Start with a high-resolution square image and leave enough room around the head so the circular crop does not cut off the face.' },
      { question: 'Should both photos show the same background?', answer: 'They do not have to, but both should feel believable for your industry and should not pull attention away from your face.' },
    ],
    cta: { heading: 'Make one portrait work in more places', description: 'Generate a realistic headshot, then choose calmer and warmer versions for different professional profiles.', label: 'Generate headshots', href: '/upload' },
    links: [
      { label: 'Resume photo generator guidance', href: '/blog/resume' },
      { label: 'LinkedIn headshot guidance', href: '/blog/linkedin' },
      { label: 'View credit packs', href: '/pricing' },
    ],
  },
  'profile-photo': {
    answerLabel: 'Direct answer',
    answerHeading: 'What makes a professional profile photo look trustworthy?',
    directAnswer: 'A trustworthy professional profile photo should make your face easy to recognize, keep the background simple, and match the tone of the platform where it appears. Start with a square, high-resolution crop so it works across LinkedIn, resumes, bios, and team pages.',
    quickFacts: [
      { label: 'Best source crop', value: 'Square, high resolution' },
      { label: 'Face priority', value: 'Recognizable at small size' },
      { label: 'Background', value: 'Simple and believable' },
      { label: 'Review test', value: 'Preview in final placement' },
    ],
    table: {
      title: 'Professional profile photo checklist',
      headers: ['Element', 'Good signal', 'Problem to avoid'],
      rows: [
        ['Expression', 'Relaxed and alert', 'A forced smile or blank studio stare'],
        ['Crop', 'Head and shoulders with breathing room', 'Face too small or chin clipped'],
        ['Background', 'Neutral office, studio, or clean color', 'A scene that competes with the face'],
        ['Lighting', 'Even and natural', 'Harsh shadows or over-smoothed skin'],
      ],
      note: 'Profile photos are judged in context. Always preview the image at the size and shape used by the platform.',
    },
    faqTitle: 'Professional profile photo FAQ',
    faq: [
      { question: 'What is the best size for a profile photo?', answer: 'A square high-resolution image is the safest source because many platforms crop profile photos into a square or circle.' },
      { question: 'Should a profile photo have a plain background?', answer: 'Usually yes. A simple background keeps attention on your face and makes the photo easier to reuse across professional contexts.' },
      { question: 'Can AI improve a profile photo?', answer: 'AI can help create a cleaner professional portrait, but the result should still preserve your face, age cues, and natural expression.' },
      { question: 'How do I choose between several headshots?', answer: 'Pick the one that looks most recognizable and believable in the final platform preview, not only the most polished full-size image.' },
    ],
    cta: { heading: 'Create a reusable profile photo', description: 'Generate several professional looks and keep the version that stays recognizable across platforms.', label: 'Create profile photos', href: '/upload' },
    links: [
      { label: 'Choose a LinkedIn headshot', href: '/blog/linkedin' },
      { label: 'Avoid common AI headshot mistakes', href: '/blog/mistakes' },
      { label: 'Compare sample results', href: '/sample' },
    ],
  },
  linkedin: {
    answerLabel: 'Direct answer',
    answerHeading: 'What kind of AI headshot works best for LinkedIn?',
    directAnswer: 'The best AI headshot for LinkedIn is recognizable, clear in a small circular crop, and polished without looking like a different person. Use a square source image, keep the eyes readable, and choose a background that supports your professional role.',
    quickFacts: [
      { label: 'Source crop', value: 'Square image' },
      { label: 'Display crop', value: 'Circular profile photo' },
      { label: 'Main test', value: 'Recognizable in comments' },
      { label: 'Style', value: 'Polished but believable' },
    ],
    table: {
      title: 'LinkedIn headshot selection guide',
      headers: ['Check', 'What to choose', 'Why'],
      rows: [
        ['Face visibility', 'Eyes and expression clear at small size', 'Most people see the image in feeds and comments'],
        ['Crop', 'Head and shoulders with margin', 'The circular crop needs extra space'],
        ['Background', 'Clean professional setting', 'It should not be more memorable than your face'],
        ['Likeness', 'Current, recognizable face', 'Trust drops when the image feels synthetic or outdated'],
      ],
      note: 'LinkedIn crops profile photos visually, so preview the result in a circular frame before publishing.',
    },
    faqTitle: 'LinkedIn AI headshot FAQ',
    faq: [
      { question: 'Can I use an AI headshot on LinkedIn?', answer: 'Yes, if it looks like you and presents a realistic professional version of your current appearance.' },
      { question: 'What size should I prepare for LinkedIn?', answer: 'Use a square high-resolution image as the source. The platform will display it in a circular profile crop.' },
      { question: 'What background works best for LinkedIn?', answer: 'A clean office, studio, or soft neutral background usually works better than a dramatic or busy scene.' },
      { question: 'How do I know if the headshot is too edited?', answer: 'Compare it with a recent selfie and ask whether a colleague would immediately recognize you on a call.' },
    ],
    cta: { heading: 'Generate LinkedIn-ready headshots', description: 'Create several realistic options and choose the one that still looks like you in a small profile crop.', label: 'Create LinkedIn headshots', href: '/upload' },
    links: [
      { label: 'Professional profile photo guide', href: '/blog/profile-photo' },
      { label: 'Resume versus LinkedIn photo', href: '/blog/resume-linkedin' },
      { label: 'See examples', href: '/sample' },
    ],
  },
  backgrounds: {
    answerLabel: 'Direct answer',
    answerHeading: 'What background is best for a professional headshot?',
    directAnswer: 'A professional headshot background should be simple, believable, and less noticeable than your face. Neutral studio colors, soft office scenes, and clean light backgrounds usually work better than dramatic locations or heavy visual effects.',
    quickFacts: [
      { label: 'Safest choices', value: 'White, gray, soft office' },
      { label: 'Avoid', value: 'Busy or theatrical scenes' },
      { label: 'Resume fit', value: 'Calm and low contrast' },
      { label: 'LinkedIn fit', value: 'Clear face first' },
    ],
    table: {
      title: 'Headshot background choices',
      headers: ['Background', 'Best for', 'Watch out for'],
      rows: [
        ['Light gray studio', 'Resumes, LinkedIn, company bios', 'Can feel flat if lighting is dull'],
        ['Soft office', 'Business profiles and team pages', 'Avoid clutter or fake-looking depth'],
        ['White or off-white', 'Clean profile and document use', 'Do not overexpose the face or shirt'],
        ['Dark studio', 'Executive or speaker profiles', 'Can look too dramatic for a resume'],
      ],
      note: 'Choose the background for the final destination, not just for how impressive it looks full screen.',
    },
    faqTitle: 'Professional headshot background FAQ',
    faq: [
      { question: 'Is a white background always best?', answer: 'No. White is versatile, but gray, soft office, or muted studio backgrounds can look more natural depending on the profile use.' },
      { question: 'Should a resume photo use a plain background?', answer: 'Usually yes. A quiet background helps the photo support the document instead of competing with the resume content.' },
      { question: 'Can the background look too artificial?', answer: 'Yes. Overly dramatic scenes, fake depth, or strong effects can make an AI headshot feel less trustworthy.' },
      { question: 'Should team photos use the same background?', answer: 'They should use a consistent style family, but not every image has to be identical. Consistency matters more than exact sameness.' },
    ],
    cta: { heading: 'Try cleaner headshot styles', description: 'Generate portraits with professional backgrounds that fit resumes, LinkedIn, and company pages.', label: 'Create headshots', href: '/upload' },
    links: [
      { label: 'Choose resume photo styling', href: '/blog/resume' },
      { label: 'Professional profile photo checklist', href: '/blog/profile-photo' },
      { label: 'Team photo consistency', href: '/blog/teams' },
    ],
  },
}

export function getBlogAiIndexEnhancement(slug: string) {
  return englishEnhancements[slug]
}


export type BlogEnhancement = {
  category: string
  audience: string
  searchIntent: string
  uniqueAngle: string
  actionSteps: string[]
  qualityChecks: { label: string; detail: string }[]
  avoid: string[]
  internalLinks: { href: string; label: string; reason: string }[]
  relatedSlugs: string[]
}

export const blogEnhancements: Record<string, BlogEnhancement> = {
  linkedin: {
    category: 'LinkedIn profile',
    audience: 'job seekers, founders, consultants, and operators refreshing a public professional profile',
    searchIntent: 'The reader wants a LinkedIn photo that looks credible in a small circular crop without feeling fake.',
    uniqueAngle: 'Treat the image as a trust signal inside LinkedIn, not as a standalone portrait contest.',
    actionSteps: [
      'Preview the image at comment-size before making it your main profile photo.',
      'Choose a crop where the eyes and expression stay readable in a circle.',
      'Match the outfit and background to the roles or clients you want to attract.',
      'Keep one warmer option for LinkedIn and one calmer version for resumes or bios.',
    ],
    qualityChecks: [
      { label: 'Circle crop', detail: 'The face should not be clipped at the chin, hair, or shoulders.' },
      { label: 'Recognition', detail: 'A colleague should recognize you immediately on a video call.' },
      { label: 'Profile context', detail: 'The headshot should still feel natural beside your headline and experience.' },
    ],
    avoid: [
      'Overly cinematic lighting that looks strange in LinkedIn comments.',
      'A background that is more memorable than your face.',
      'Choosing the most flattering result if it no longer looks like you.',
    ],
    internalLinks: [
      { href: '/sample', label: 'Compare LinkedIn-style samples', reason: 'Use examples to judge crop, expression, and realism.' },
      { href: '/questions', label: 'Read upload guidance', reason: 'Better source photos usually produce better likeness.' },
      { href: '/pricing', label: 'View one-time credit packs', reason: 'Generate a few LinkedIn-ready options without a subscription.' },
    ],
    relatedSlugs: ['profile-photo', 'mistakes', 'resume-linkedin'],
  },
  'no-photographer': {
    category: 'Studio alternative',
    audience: 'people who need a usable professional image quickly but do not want to book a photo session',
    searchIntent: 'The reader is comparing AI headshots with the time, cost, and friction of hiring a photographer.',
    uniqueAngle: 'Position AI as a practical middle path for routine profile updates, not as a total replacement for every shoot.',
    actionSteps: [
      'Use recent selfies with neutral light and no heavy filters.',
      'Pick backgrounds that could plausibly appear in your actual work life.',
      'Generate several levels of formality before choosing one.',
      'Use a studio later for campaigns, press kits, or highly directed brand work.',
    ],
    qualityChecks: [
      { label: 'Time saved', detail: 'The workflow should solve the immediate profile blocker in one sitting.' },
      { label: 'Authenticity', detail: 'The result should not look like a different person after retouching.' },
      { label: 'Use case fit', detail: 'A routine LinkedIn update needs different polish than a major launch campaign.' },
    ],
    avoid: [
      'Pretending AI is always better than a professional photographer.',
      'Using blurry or old selfies because the workflow feels fast.',
      'Selecting a luxury-ad style for a normal work profile.',
    ],
    internalLinks: [
      { href: '/landing', label: 'See the quick workflow', reason: 'The landing page shows the fast upload-to-download path.' },
      { href: '/sample', label: 'Inspect generated portraits', reason: 'Samples help decide if AI quality is enough for the job.' },
      { href: '/pricing', label: 'Compare credit packs', reason: 'One-time credits are easier for occasional profile updates.' },
    ],
    relatedSlugs: ['virtual', 'pricing', 'selfies'],
  },
  resume: {
    category: 'Resume photo',
    audience: 'job applicants who need a clean photo for a CV, portfolio, or application profile',
    searchIntent: 'The reader wants a resume-ready image that feels professional without looking overproduced.',
    uniqueAngle: 'A resume photo should support the document quietly instead of becoming the loudest element on the page.',
    actionSteps: [
      'Choose a neutral background and straightforward expression.',
      'Place the photo beside your name in the actual resume layout before publishing.',
      'Use less dramatic lighting than you might choose for LinkedIn.',
      'Keep a second version ready for portfolio or applicant-tracking profiles.',
    ],
    qualityChecks: [
      { label: 'Document fit', detail: 'The image should not overpower your experience or summary.' },
      { label: 'Calm expression', detail: 'Approachable usually works better than intense or glamorous.' },
      { label: 'Layout test', detail: 'Check the photo at the final resume size, not only full screen.' },
    ],
    avoid: [
      'Movie-poster lighting inside a simple CV template.',
      'Heavy retouching that makes the face look less current.',
      'Using a cropped social photo with distracting background details.',
    ],
    internalLinks: [
      { href: '/sample', label: 'Review resume-style examples', reason: 'Compare calm, document-friendly portraits.' },
      { href: '/blog/resume-linkedin', label: 'Compare resume and LinkedIn photos', reason: 'The same image is not always best for both contexts.' },
      { href: '/questions', label: 'Check upload tips', reason: 'Clear selfies reduce strange artifacts in final images.' },
    ],
    relatedSlugs: ['resume-linkedin', 'clothing', 'backgrounds'],
  },
  realistic: {
    category: 'Realism and likeness',
    audience: 'users worried that AI portraits may look glossy, stiff, or unlike the real person',
    searchIntent: 'The reader wants to understand what makes an AI headshot believable.',
    uniqueAngle: 'Realism is mostly built from small boring details: light direction, skin texture, crop, and expression.',
    actionSteps: [
      'Compare the generated photo against a recent selfie before checking style.',
      'Zoom in on eyes, teeth, hairline, glasses, and collars.',
      'Prefer simple backgrounds when realism matters more than drama.',
      'Ask whether the result would feel normal on a client call profile.',
    ],
    qualityChecks: [
      { label: 'Face continuity', detail: 'Age, face shape, and expression should still feel like the same person.' },
      { label: 'Lighting logic', detail: 'Highlights and shadows should point in a believable direction.' },
      { label: 'Texture', detail: 'Skin should not become waxy or overly smooth.' },
    ],
    avoid: [
      'Perfect skin that makes the portrait feel synthetic.',
      'Backgrounds with odd depth or impossible lighting.',
      'Tiny artifacts around glasses, teeth, earrings, or hair edges.',
    ],
    internalLinks: [
      { href: '/sample', label: 'Inspect realism examples', reason: 'Use side-by-side samples to judge likeness.' },
      { href: '/blog/likeness', label: 'Read why likeness matters', reason: 'Likeness is often more valuable than maximum polish.' },
      { href: '/questions', label: 'Review quality tips', reason: 'Input photo quality strongly affects realism.' },
    ],
    relatedSlugs: ['likeness', 'mistakes', 'backgrounds'],
  },
  'profile-photo': {
    category: 'Profile photo checklist',
    audience: 'professionals choosing one image for LinkedIn, directories, bios, or portfolio cards',
    searchIntent: 'The reader wants a practical checklist for choosing a profile photo that makes a good first impression.',
    uniqueAngle: 'Judge the image inside the places people actually see it: tiny avatar, card, byline, and search result.',
    actionSteps: [
      'Test square, circle, and small-card crops.',
      'Choose a background that does not fight your headline or bio.',
      'Pick a version that feels easy to talk to, not just technically sharp.',
      'Use the same portrait family across platforms for recognition.',
    ],
    qualityChecks: [
      { label: 'Small-size clarity', detail: 'Eyes and expression should stay readable at avatar size.' },
      { label: 'Tone match', detail: 'The portrait should match your role and audience.' },
      { label: 'Cross-platform reuse', detail: 'The image should work beyond one profile page.' },
    ],
    avoid: [
      'Choosing a photo that only works when viewed large.',
      'Loud backgrounds that clash with profile UI.',
      'A pose that feels colder than your actual communication style.',
    ],
    internalLinks: [
      { href: '/blog/linkedin', label: 'Choose for LinkedIn specifically', reason: 'LinkedIn has its own crop and context.' },
      { href: '/sample', label: 'Compare profile examples', reason: 'Samples make crop and tone easier to judge.' },
      { href: '/pricing', label: 'Generate profile options', reason: 'Multiple styles help you choose the right tone.' },
    ],
    relatedSlugs: ['linkedin', 'professional', 'consultants'],
  },
  professional: {
    category: 'Founder and consultant profiles',
    audience: 'founders, consultants, advisors, and solo operators who sell trust before a meeting happens',
    searchIntent: 'The reader wants a professional profile photo that supports conversion without feeling cold.',
    uniqueAngle: 'For trust-led work, warmth and reuse value often matter more than maximum formality.',
    actionSteps: [
      'Choose a result that would feel natural beside a booking link or speaker bio.',
      'Keep the outfit polished but believable for your market.',
      'Avoid backgrounds that imply a company or location you do not represent.',
      'Save a consistent version for decks, bios, newsletters, and LinkedIn.',
    ],
    qualityChecks: [
      { label: 'Approachability', detail: 'The expression should make a first message feel easier.' },
      { label: 'Brand fit', detail: 'The styling should match your offer and client expectations.' },
      { label: 'Reuse value', detail: 'A strong portrait should survive many formats without explanation.' },
    ],
    avoid: [
      'Looking so formal that the image feels distant.',
      'Overly casual crops that reduce trust on sales pages.',
      'Changing style dramatically between your website and LinkedIn.',
    ],
    internalLinks: [
      { href: '/blog/consultants', label: 'Consultant photo tips', reason: 'Consultants need profile photos that support conversion.' },
      { href: '/blog/founders', label: 'Founder headshot guide', reason: 'Founders reuse portraits across many public surfaces.' },
      { href: '/pricing', label: 'Create reusable portraits', reason: 'Credit packs let you test several professional tones.' },
    ],
    relatedSlugs: ['consultants', 'founders', 'business'],
  },
  business: {
    category: 'Company pages',
    audience: 'marketing, HR, and operations teams cleaning up company profile grids',
    searchIntent: 'The reader wants business portrait styles that make a team page feel consistent.',
    uniqueAngle: 'Consistency comes from shared rules, not making every person look identical.',
    actionSteps: [
      'Define a shared crop, brightness range, and attire level before generating.',
      'Let each person keep natural expression and age cues.',
      'Review the full team grid before publishing individual images.',
      'Use one style family for departments or leadership pages.',
    ],
    qualityChecks: [
      { label: 'Grid harmony', detail: 'No single portrait should feel too bright, too close, or too stylized.' },
      { label: 'Individuality', detail: 'People should still look like themselves, not copied into one template.' },
      { label: 'Background family', detail: 'Backgrounds can vary slightly while staying visually related.' },
    ],
    avoid: [
      'Making every portrait look cloned.',
      'Mixing casual selfie crops with polished executive portraits.',
      'Using dramatic scenes that will age quickly on a company page.',
    ],
    internalLinks: [
      { href: '/blog/teams', label: 'Team photo consistency', reason: 'Team grids need rules that people can follow.' },
      { href: '/sample', label: 'Review business portrait samples', reason: 'Examples help define the acceptable style range.' },
      { href: '/contact', label: 'Contact support', reason: 'Team workflows may need help with usage or billing questions.' },
    ],
    relatedSlugs: ['teams', 'remote-teams', 'backgrounds'],
  },
  likeness: {
    category: 'Likeness',
    audience: 'people who care more about being recognized than looking artificially perfect',
    searchIntent: 'The reader wants to know why likeness matters in AI portraits.',
    uniqueAngle: 'A professional headshot is a promise that the same person will show up in the meeting.',
    actionSteps: [
      'Compare the result with how you look this month, not years ago.',
      'Choose recognizable facial structure over the most flattering variant.',
      'Check glasses, hairline, smile shape, and age cues carefully.',
      'Reject any image that makes you hesitate before sending it to a colleague.',
    ],
    qualityChecks: [
      { label: 'Recognition test', detail: 'A coworker should not need a second look to identify you.' },
      { label: 'Age honesty', detail: 'The portrait should look polished but current.' },
      { label: 'Expression continuity', detail: 'Your normal expression should not become a synthetic smile.' },
    ],
    avoid: [
      'Trading identity for sharper cheekbones or smoother skin.',
      'Publishing a portrait that surprises people on video calls.',
      'Accepting subtle face-shape changes because the image looks expensive.',
    ],
    internalLinks: [
      { href: '/blog/realistic', label: 'Realism checklist', reason: 'Realism and likeness overlap but are not identical.' },
      { href: '/blog/mistakes', label: 'Avoid publishing mistakes', reason: 'Small artifacts can undermine trust.' },
      { href: '/sample', label: 'Compare before and after examples', reason: 'Side-by-side review makes likeness easier to judge.' },
    ],
    relatedSlugs: ['realistic', 'mistakes', 'selfies'],
  },
  fast: {
    category: 'Urgent updates',
    audience: 'people with a deadline for a profile, application, speaker page, or team launch',
    searchIntent: 'The reader needs a better headshot quickly and wants to avoid rushing into a bad choice.',
    uniqueAngle: 'Speed helps most when the final review step is still deliberate.',
    actionSteps: [
      'Spend two minutes choosing the clearest input selfies.',
      'Generate both conservative and warmer styles.',
      'Check the chosen image at its final crop size before publishing.',
      'Save one alternate for a resume, bio, or company page.',
    ],
    qualityChecks: [
      { label: 'Deadline fit', detail: 'The image should be good enough for today without creating future cleanup.' },
      { label: 'Final crop', detail: 'Review the photo where it will actually appear.' },
      { label: 'Artifact scan', detail: 'Urgent does not mean skipping teeth, glasses, hair, and collar checks.' },
    ],
    avoid: [
      'Using the first result without comparing alternatives.',
      'Uploading the fastest available selfie instead of the clearest one.',
      'Publishing a dramatic image because it feels more finished.',
    ],
    internalLinks: [
      { href: '/pricing', label: 'Choose credits quickly', reason: 'One-time packs support urgent profile updates.' },
      { href: '/questions', label: 'Check upload requirements', reason: 'Better inputs prevent wasted generations.' },
      { href: '/blog/selfies', label: 'Pick better selfies', reason: 'Input quality is the fastest quality improvement.' },
    ],
    relatedSlugs: ['selfies', 'pricing', 'linkedin'],
  },
  virtual: {
    category: 'AI vs studio',
    audience: 'professionals deciding between a virtual headshot generator and a photographer',
    searchIntent: 'The reader wants a balanced comparison, not a sales pitch pretending one option always wins.',
    uniqueAngle: 'AI and studios solve different levels of direction, urgency, and brand specificity.',
    actionSteps: [
      'Use AI for routine updates, quick bios, and profile consistency.',
      'Use a studio when posture, art direction, wardrobe, or campaign mood matter deeply.',
      'Compare hidden costs such as scheduling, travel, and proof selection.',
      'Keep a studio shoot for brand launches and AI for maintenance updates.',
    ],
    qualityChecks: [
      { label: 'Direction needed', detail: 'If you need coaching on pose and wardrobe, a photographer may be better.' },
      { label: 'Timeline', detail: 'AI helps when the photo is blocking a near-term task.' },
      { label: 'Specificity', detail: 'A custom campaign needs more control than a profile refresh.' },
    ],
    avoid: [
      'Treating cost as the only difference.',
      'Using AI for a campaign that needs human creative direction.',
      'Booking a full shoot for a simple profile update if time is the main problem.',
    ],
    internalLinks: [
      { href: '/blog/no-photographer', label: 'No-photographer workflow', reason: 'See where AI fits routine updates.' },
      { href: '/sample', label: 'Inspect AI output', reason: 'Quality expectations should be based on visible examples.' },
      { href: '/pricing', label: 'Compare one-time cost', reason: 'Credit packs make the AI option easier to evaluate.' },
    ],
    relatedSlugs: ['no-photographer', 'pricing', 'realistic'],
  },
  teams: {
    category: 'Team photos',
    audience: 'remote teams and company admins trying to make profile photos consistent',
    searchIntent: 'The reader wants team photos online to look unified without coordinating a photo day.',
    uniqueAngle: 'The best team-photo system is simple enough that everyone actually follows it.',
    actionSteps: [
      'Write a short selfie request with lighting, crop, and no-filter guidance.',
      'Choose one or two style families instead of a single identical look.',
      'Review portraits together before updating the team page.',
      'Document the rules for future hires.',
    ],
    qualityChecks: [
      { label: 'Compliance', detail: 'Instructions should be short enough for busy teammates.' },
      { label: 'Page scan', detail: 'The full grid should feel intentional at a glance.' },
      { label: 'Future use', detail: 'The same rules should work for new team members later.' },
    ],
    avoid: [
      'Sending a complicated photo guide that people ignore.',
      'Allowing one portrait style to dominate the entire page.',
      'Publishing team images one by one without checking the grid.',
    ],
    internalLinks: [
      { href: '/blog/remote-teams', label: 'Remote team workflow', reason: 'Remote teams need a low-friction process.' },
      { href: '/blog/business', label: 'Business portrait styles', reason: 'Style families matter for company pages.' },
      { href: '/sample', label: 'Review sample consistency', reason: 'Samples help define visual rules.' },
    ],
    relatedSlugs: ['remote-teams', 'business', 'professional'],
  },
  backgrounds: {
    category: 'Background selection',
    audience: 'users comparing studio, office, outdoor, and neutral AI headshot backgrounds',
    searchIntent: 'The reader wants to choose a background that looks professional and believable.',
    uniqueAngle: 'Backgrounds should reduce friction, not become the reason someone notices the photo.',
    actionSteps: [
      'Start with neutral studio if the image must work everywhere.',
      'Use soft office backgrounds when context helps your role.',
      'Keep outdoor backgrounds simple and composed.',
      'Avoid scenes that imply a place or lifestyle that feels false.',
    ],
    qualityChecks: [
      { label: 'Face priority', detail: 'The background should never compete with the expression.' },
      { label: 'Lighting match', detail: 'Face and background lighting should feel like one scene.' },
      { label: 'Platform fit', detail: 'A background that works on a website may be too busy for LinkedIn.' },
    ],
    avoid: [
      'Busy office details that become distracting at small sizes.',
      'Outdoor scenes that feel too casual for the target role.',
      'Luxury settings that create a mismatch with your actual work context.',
    ],
    internalLinks: [
      { href: '/blog/realistic', label: 'Realistic headshot details', reason: 'Background realism depends on lighting and depth.' },
      { href: '/sample', label: 'Compare background examples', reason: 'Visual comparison is faster than guessing.' },
      { href: '/blog/business', label: 'Company page styles', reason: 'Teams often need background consistency.' },
    ],
    relatedSlugs: ['realistic', 'business', 'clothing'],
  },
  clothing: {
    category: 'Wardrobe',
    audience: 'people deciding what outfit or style level works best for AI headshots',
    searchIntent: 'The reader wants wardrobe guidance before uploading selfies or choosing generated portraits.',
    uniqueAngle: 'Clothing should support the role signal without becoming the main subject.',
    actionSteps: [
      'Choose simple layers such as blazers, knits, jackets, or button-downs.',
      'Avoid tiny patterns, shiny fabrics, and large logos.',
      'Match formality to the audience you want to trust you.',
      'Generate at least one conservative and one approachable option.',
    ],
    qualityChecks: [
      { label: 'Role signal', detail: 'The outfit should make sense for your industry and seniority.' },
      { label: 'Visual quiet', detail: 'Clothes should frame the face instead of pulling attention away.' },
      { label: 'Reuse', detail: 'A versatile outfit travels better across LinkedIn, resumes, and bios.' },
    ],
    avoid: [
      'Trendy clothing that will date the image quickly.',
      'Patterns that become noisy after AI generation.',
      'Overdressing so much that the portrait feels like costume.',
    ],
    internalLinks: [
      { href: '/blog/resume', label: 'Resume photo tone', reason: 'Resume photos usually need calmer styling.' },
      { href: '/blog/backgrounds', label: 'Match outfit and background', reason: 'Wardrobe and scene should feel coherent.' },
      { href: '/questions', label: 'Review upload tips', reason: 'Input selfies still influence final wardrobe realism.' },
    ],
    relatedSlugs: ['resume', 'backgrounds', 'professional'],
  },
  mistakes: {
    category: 'Publishing checks',
    audience: 'users reviewing AI headshots before posting them publicly',
    searchIntent: 'The reader wants a mistake checklist to avoid publishing an awkward AI portrait.',
    uniqueAngle: 'Most mistakes are small enough to miss in isolation but obvious once published.',
    actionSteps: [
      'Zoom in once before exporting or uploading.',
      'Check the image at avatar size and full size.',
      'Compare the face against a recent normal photo.',
      'Reject any result where one artifact becomes hard to unsee.',
    ],
    qualityChecks: [
      { label: 'Artifact scan', detail: 'Look at teeth, glasses, earrings, hair edges, and collars.' },
      { label: 'Context test', detail: 'Paste the image into the actual profile or document preview.' },
      { label: 'Likeness', detail: 'The polished version should still feel recognizably current.' },
    ],
    avoid: [
      'Choosing flattery over identity.',
      'Ignoring a tiny artifact because the rest of the photo looks good.',
      'Using cinematic styles on conservative professional surfaces.',
    ],
    internalLinks: [
      { href: '/blog/likeness', label: 'Prioritize likeness', reason: 'Likeness prevents trust problems later.' },
      { href: '/blog/realistic', label: 'Check realism details', reason: 'Realism issues often show up as small inconsistencies.' },
      { href: '/sample', label: 'Compare examples before publishing', reason: 'Examples train the eye for artifacts.' },
    ],
    relatedSlugs: ['likeness', 'realistic', 'linkedin'],
  },
  'resume-linkedin': {
    category: 'Platform comparison',
    audience: 'job seekers deciding whether to use one image for resumes and LinkedIn',
    searchIntent: 'The reader wants to know when a resume photo and LinkedIn headshot should differ.',
    uniqueAngle: 'The two images can share likeness while serving different levels of warmth and visibility.',
    actionSteps: [
      'Use the calmer version inside resume layouts.',
      'Use the warmer or more visible version on LinkedIn.',
      'Keep crop, age, and polish close enough that both feel like the same person.',
      'Test each image in its final context before deciding.',
    ],
    qualityChecks: [
      { label: 'Resume restraint', detail: 'The photo should support the document instead of drawing attention.' },
      { label: 'LinkedIn warmth', detail: 'The image can show a little more personality on a social profile.' },
      { label: 'Identity match', detail: 'Two images should not create a recognition gap.' },
    ],
    avoid: [
      'Using a dramatic LinkedIn image in a conservative CV.',
      'Choosing two portraits that look like different people.',
      'Ignoring regional norms around resume photos.',
    ],
    internalLinks: [
      { href: '/blog/resume', label: 'Resume photo guidance', reason: 'Resume context changes the ideal tone.' },
      { href: '/blog/linkedin', label: 'LinkedIn photo guidance', reason: 'LinkedIn has its own visibility rules.' },
      { href: '/pricing', label: 'Generate both versions', reason: 'Credits let you create different options for each platform.' },
    ],
    relatedSlugs: ['resume', 'linkedin', 'profile-photo'],
  },
  founders: {
    category: 'Founder headshots',
    audience: 'founders preparing websites, decks, investor updates, launch pages, or podcast bios',
    searchIntent: 'The reader wants one portrait that can travel across many founder-facing materials.',
    uniqueAngle: 'Founder photos need calm confidence and high reuse value more than theatrical polish.',
    actionSteps: [
      'Choose a portrait that works in a deck, bio, and LinkedIn profile.',
      'Match the image to the company category and audience.',
      'Avoid styles that feel too corporate if the brand is more personal.',
      'Save both square and wide-crop-friendly versions.',
    ],
    qualityChecks: [
      { label: 'Deck fit', detail: 'The portrait should look natural beside company narrative slides.' },
      { label: 'Launch fit', detail: 'The image should support public announcements without looking staged.' },
      { label: 'Crop survival', detail: 'The face should work in circles, squares, and small cards.' },
    ],
    avoid: [
      'Looking like a stock executive instead of the company builder.',
      'Choosing a scene that conflicts with the startup category.',
      'Using an image that only works on LinkedIn but not in press or decks.',
    ],
    internalLinks: [
      { href: '/blog/professional', label: 'Professional profile strategy', reason: 'Founders often reuse one portrait in many places.' },
      { href: '/blog/linkedin', label: 'LinkedIn headshot tips', reason: 'Founder discovery often starts on LinkedIn.' },
      { href: '/pricing', label: 'Create founder portrait options', reason: 'Multiple styles help match the company story.' },
    ],
    relatedSlugs: ['professional', 'consultants', 'linkedin'],
  },
  consultants: {
    category: 'Consultant conversion',
    audience: 'consultants, coaches, advisors, and service providers whose profile photo affects trust',
    searchIntent: 'The reader wants a profile photo that helps prospects feel comfortable booking a call.',
    uniqueAngle: 'For consultants, the headshot sits inside a conversion path, not just a profile page.',
    actionSteps: [
      'Preview the headshot near your booking CTA or offer copy.',
      'Choose eye contact and expression that feel easy to approach.',
      'Keep the background focused and non-distracting.',
      'Use one consistent portrait across LinkedIn, website, and proposals.',
    ],
    qualityChecks: [
      { label: 'Trust cue', detail: 'The image should make the first call feel less uncertain.' },
      { label: 'Offer fit', detail: 'The level of polish should match your service category.' },
      { label: 'Consistency', detail: 'Prospects should see the same person across channels.' },
    ],
    avoid: [
      'A photo that feels too distant for advisory work.',
      'A casual crop that weakens authority on proposal pages.',
      'Changing style across every platform.',
    ],
    internalLinks: [
      { href: '/blog/professional', label: 'Professional profile tips', reason: 'Consultants need warmth and authority together.' },
      { href: '/blog/profile-photo', label: 'Profile photo checklist', reason: 'Small crop choices affect first impressions.' },
      { href: '/pricing', label: 'Generate client-facing options', reason: 'A few versions help choose the right tone.' },
    ],
    relatedSlugs: ['professional', 'profile-photo', 'founders'],
  },
  'remote-teams': {
    category: 'Remote teams',
    audience: 'distributed teams that need consistent headshots without scheduling a shared photo day',
    searchIntent: 'The reader wants an easy remote process for collecting and standardizing team portraits.',
    uniqueAngle: 'Remote headshot systems work when instructions are short, repeatable, and forgiving.',
    actionSteps: [
      'Send a simple selfie request with examples.',
      'Choose one background family and one crop rule.',
      'Batch review results before updating the team page.',
      'Save instructions for onboarding new hires.',
    ],
    qualityChecks: [
      { label: 'Remote friendliness', detail: 'The process should not require equipment or perfect rooms.' },
      { label: 'Batch consistency', detail: 'Reviewing together catches outliers quickly.' },
      { label: 'Maintenance', detail: 'The same workflow should work next quarter.' },
    ],
    avoid: [
      'Trying to coordinate one impossible photo day across time zones.',
      'Accepting every generated image without grid review.',
      'Making instructions so detailed that teammates delay uploading.',
    ],
    internalLinks: [
      { href: '/blog/teams', label: 'Team photo rules', reason: 'Consistency starts with simple visual rules.' },
      { href: '/blog/business', label: 'Business portrait styles', reason: 'Company pages need coherent style families.' },
      { href: '/contact', label: 'Ask support', reason: 'Team workflows may need account or billing guidance.' },
    ],
    relatedSlugs: ['teams', 'business', 'selfies'],
  },
  pricing: {
    category: 'Pricing decision',
    audience: 'buyers comparing one-time AI headshot credits with subscriptions or studio costs',
    searchIntent: 'The reader wants to understand when one-time credits make sense.',
    uniqueAngle: 'The real value is not gallery size; it is the few portraits you actually publish.',
    actionSteps: [
      'Estimate how many platforms need updated photos.',
      'Generate enough styles to compare, not endless variations.',
      'Consider the hidden time cost of studio scheduling.',
      'Choose a pack based on usable outputs, not maximum quantity.',
    ],
    qualityChecks: [
      { label: 'Use count', detail: 'Count LinkedIn, resume, website, bio, and team page needs.' },
      { label: 'No subscription fit', detail: 'One-time credits are better when updates are occasional.' },
      { label: 'Output value', detail: 'Two strong photos beat a large gallery of maybes.' },
    ],
    avoid: [
      'Choosing based only on lowest price.',
      'Buying far more outputs than you will review carefully.',
      'Ignoring expiration or validity rules.',
    ],
    internalLinks: [
      { href: '/pricing', label: 'View current credit packs', reason: 'See exact prices and validity.' },
      { href: '/questions', label: 'Read credit questions', reason: 'Understand validity, downloads, and usage.' },
      { href: '/blog/no-photographer', label: 'Compare studio alternatives', reason: 'Pricing makes more sense with time cost included.' },
    ],
    relatedSlugs: ['no-photographer', 'fast', 'virtual'],
  },
  selfies: {
    category: 'Upload quality',
    audience: 'users preparing selfies before generating AI headshots',
    searchIntent: 'The reader wants to know which input photos produce better AI portraits.',
    uniqueAngle: 'The fastest way to improve AI output is to improve the honesty and clarity of the input selfies.',
    actionSteps: [
      'Use recent photos with good light and a clear face.',
      'Avoid heavy filters, sunglasses, blur, and extreme angles.',
      'Upload images that show how you actually look now.',
      'Choose different expressions only if they still feel natural.',
    ],
    qualityChecks: [
      { label: 'Light', detail: 'Soft window light or clear indoor light gives the model more real detail.' },
      { label: 'Angle', detail: 'Straightforward face views usually beat dramatic selfie angles.' },
      { label: 'Recency', detail: 'Current photos help preserve likeness.' },
    ],
    avoid: [
      'Old photos from a different hairstyle or face shape.',
      'Dark photos where the model has to guess details.',
      'Filtered selfies that hide skin and eye detail.',
    ],
    internalLinks: [
      { href: '/questions', label: 'Read upload FAQ', reason: 'Upload quality affects every generated style.' },
      { href: '/blog/realistic', label: 'Improve realism', reason: 'Better inputs help realistic outputs.' },
      { href: '/pricing', label: 'Generate after preparing inputs', reason: 'Use credits after choosing strong source photos.' },
    ],
    relatedSlugs: ['realistic', 'likeness', 'fast'],
  },
}

export function getBlogEnhancement(slug: string) {
  return blogEnhancements[slug]
}

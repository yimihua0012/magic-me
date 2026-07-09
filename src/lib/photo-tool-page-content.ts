export type PhotoToolPageId =
  | 'id-photo-crop'
  | 'resize-image'
  | 'resize-image-to-kb'
  | 'background-color-tool'
  | 'print-layout-builder'

export type PhotoToolActiveId =
  | 'id-photo-crop'
  | 'resize-image'
  | 'resize-kb'
  | 'background-color'
  | 'print-layout'

export type PhotoToolPageContent = {
  id: PhotoToolPageId
  activeId: PhotoToolActiveId
  label: string
  path: string
  title: string
  h1: string
  description: string
  keywords: string[]
  features: string[]
  faqs: Array<{ question: string; answer: string }>
  toolTitle?: string
  toolDescription?: string
  actionLabel?: string
}

export const photoToolPages: PhotoToolPageContent[] = [
  {
    id: 'id-photo-crop',
    activeId: 'id-photo-crop',
    label: 'ID photo crop',
    path: '/photo-tools/id-photo-crop',
    title: 'Free ID Photo Crop Tool Online for Passport, Resume, Exam Photos',
    h1: 'Free ID Photo Crop Tool Online for Passport, Resume, Exam Photos',
    description:
      'Crop passport photos, resume photos, exam photos, and student card photos online from a local JPG, PNG, or WebP image, then download a finished ID-style JPG.',
    keywords: ['ID photo crop tool', 'crop passport photo online', 'resume photo crop', 'exam photo crop', 'student card photo crop'],
    features: [
      'Crop passport photo online',
      'Resize and crop resume photos',
      'Crop exam registration photos',
      'Create student card and badge photos',
      'Browser-based local image processing',
    ],
    faqs: [
      {
        question: 'Can I use this as a free ID photo crop tool online?',
        answer: 'Yes. You can crop a local JPG, PNG, or WebP image into common ID photo sizes directly in your browser.',
      },
      {
        question: 'Can I crop a passport photo online without uploading it to a server?',
        answer: 'Yes. The crop tool runs locally in your browser, so the selected image is processed on your device.',
      },
      {
        question: 'Can I crop a resume photo, exam photo, or student card photo?',
        answer: 'Yes. The presets are useful for resumes, school portals, exam registrations, employee badges, student cards, and everyday document photos.',
      },
      {
        question: 'Is this ID photo crop tool suitable for official passport or visa submission?',
        answer: 'Use it for everyday document-style photos. For passports, visas, and government IDs, always follow the official rules from that authority.',
      },
    ],
  },
  {
    id: 'resize-image',
    activeId: 'resize-image',
    label: 'Resize image',
    path: '/photo-tools/resize-image',
    title: 'Free Image Resize Tool Online: Resize JPG, PNG, Photo Pixels',
    h1: 'Free Image Resize Tool Online to Resize JPG, PNG, and Photo Pixels',
    description:
      'Resize images online by percentage or exact pixel dimensions, including JPG, PNG, and WebP photos for profile uploads, school portals, forms, and job applications.',
    keywords: ['resize image online', 'resize photo pixels', 'change image dimensions', 'resize JPG', 'resize PNG'],
    features: [
      'Resize image online by percentage',
      'Resize photo to exact pixel dimensions',
      'Resize JPG, PNG, and WebP images',
      'Change image dimensions for forms',
      'Browser-based local image resizing',
    ],
    faqs: [
      {
        question: 'Can I resize an image online by percentage?',
        answer: 'Yes. Choose proportional resize mode, move the scale percentage slider, and download the resized image.',
      },
      {
        question: 'Can I resize a photo to exact pixel dimensions?',
        answer: 'Yes. Choose exact size mode and enter the width and height you need in pixels.',
      },
      {
        question: 'Can I resize JPG or resize PNG files in the browser?',
        answer: 'Yes. The tool supports JPG, PNG, and WebP images and processes them locally in your browser.',
      },
      {
        question: 'Can I change image dimensions for profile uploads and forms?',
        answer: 'Yes. It is designed for profile images, school portals, job applications, online forms, and document photo uploads.',
      },
    ],
  },
  {
    id: 'resize-image-to-kb',
    activeId: 'resize-kb',
    label: 'Resize image to KB',
    path: '/photo-tools/resize-image-to-kb',
    title: 'Free Resize Image to KB Tool: Compress Photo, Reduce JPG Size',
    h1: 'Free Resize Image to KB Tool to Compress Photos and Reduce JPG Size',
    description:
      'Resize image to KB, compress photos to a target file size, reduce JPG size to 200KB or another limit, and export JPG or WebP for online forms.',
    keywords: ['resize image to KB', 'compress photo to KB', 'reduce image file size', 'resize JPG to 200KB', 'image size reducer'],
    features: [
      'Resize image to KB',
      'Compress photo to KB',
      'Reduce JPG file size',
      'Resize JPG to 200KB or another target',
      'Export compressed JPG or WebP',
    ],
    toolTitle: 'Resize Image to KB',
    toolDescription:
      'Resize and compress a JPG, PNG, or WebP image to a target file size in KB for online forms, school portals, job applications, and profile uploads. Processing happens locally in your browser.',
    actionLabel: 'Resize image to KB',
    faqs: [
      {
        question: 'Can I resize image to KB for an online form?',
        answer: 'Yes. Set the target KB value with the slider and the tool will try to fit the output under that file size.',
      },
      {
        question: 'Can I compress photo to KB without uploading it?',
        answer: 'Yes. Compression runs in your browser, so the selected image is processed locally on your device.',
      },
      {
        question: 'Can I reduce image file size or resize JPG to 200KB?',
        answer: 'Yes. Choose a target such as 200KB, then export the result as JPG or WebP.',
      },
      {
        question: 'Why might this image size reducer create a file smaller than my target KB?',
        answer: 'The tool balances dimensions and compression quality, so the final file can be below the target when that produces a cleaner result.',
      },
    ],
  },
  {
    id: 'background-color-tool',
    activeId: 'background-color',
    label: 'Background color tool',
    path: '/photo-tools/background-color-tool',
    title: 'Free Photo Background Color Tool: Change ID Photo Background',
    h1: 'Free Photo Background Color Tool to Change ID Photo Background',
    description:
      'Change ID photo background color online to white, blue, red, or light gray from a transparent PNG portrait, then download a finished JPG.',
    keywords: ['photo background color tool', 'change ID photo background', 'white background photo', 'blue background ID photo', 'red background photo'],
    features: [
      'Change ID photo background color',
      'Make a white background photo',
      'Make a blue background ID photo',
      'Make a red background photo',
      'Export finished background JPG',
    ],
    faqs: [
      {
        question: 'Can I use this as a photo background color tool for ID photos?',
        answer: 'Yes. Upload a transparent PNG portrait, choose a photo size, pick a background color, and download a finished JPG.',
      },
      {
        question: 'Can I change ID photo background to white, blue, or red?',
        answer: 'Yes. The preset options include white background photo, blue background ID photo, red background photo, and light gray.',
      },
      {
        question: 'Do I need a transparent PNG to change the photo background?',
        answer: 'Yes. This background color tool is designed for transparent PNG portraits so it can place a clean color behind the subject.',
      },
      {
        question: 'What file do I download after changing the background color?',
        answer: 'The tool exports a finished JPG with the selected photo size and background color.',
      },
    ],
  },
  {
    id: 'print-layout-builder',
    activeId: 'print-layout',
    label: 'Print layout builder',
    path: '/photo-tools/print-layout-builder',
    title: 'Free Photo Print Layout Builder: ID Photo Print Sheet, 4x6, A4',
    h1: 'Free Photo Print Layout Builder for ID Photo Print Sheets, 4x6, and A4',
    description:
      'Create an ID photo print sheet, print multiple photos on one page, and build 4x6, 5x7, A4, or Letter photo layouts as a downloadable JPG.',
    keywords: ['photo print layout builder', 'ID photo print sheet', 'print multiple photos on one page', '4x6 photo layout', 'A4 photo print sheet'],
    features: [
      'Build an ID photo print sheet',
      'Print multiple photos on one page',
      'Create 4x6 photo layouts',
      'Create A4 photo print sheets',
      'Download printable JPG layouts',
    ],
    faqs: [
      {
        question: 'Can I use this as a photo print layout builder?',
        answer: 'Yes. Upload a finished photo, choose a paper size, and generate a repeated print sheet.',
      },
      {
        question: 'Can I make an ID photo print sheet with multiple copies on one page?',
        answer: 'Yes. The tool places repeated copies on one page when the selected photo and paper size fit.',
      },
      {
        question: 'Can I create a 4x6 photo layout or A4 photo print sheet?',
        answer: 'Yes. The tool includes common photo and document paper sizes, including 4 x 6 in, 5 x 7 in, A4, and Letter.',
      },
      {
        question: 'Does this print layout builder crop the photo?',
        answer: 'No. Use the ID photo crop tool first, then upload the finished photo to build the print layout.',
      },
    ],
  },
]

export function getPhotoToolPage(id: string) {
  return photoToolPages.find((page) => page.id === id)
}

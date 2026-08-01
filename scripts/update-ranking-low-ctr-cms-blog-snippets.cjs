const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const updates = [
  {
    locale: 'fr',
    slug: 'photo-cv-style-avatar',
    title: 'Photo CV style avatar : créer une image professionnelle',
    description: 'Créez une photo CV style avatar depuis un selfie, avec cadrage propre, fond clair et rendu adapté au CV ou LinkedIn.',
    keywords: ['photo CV style avatar'],
  },
  {
    locale: 'ja',
    slug: 'shomei-shashin-print-layout',
    title: '証明写真印刷レイアウト：サイズと余白の作り方',
    description: '証明写真を印刷用に並べる方法を解説。サイズ、余白、6インチ相紙、切り取りやすい配置まで確認できます。家庭用プリントにも便利です。',
    keywords: ['証明写真印刷レイアウト'],
  },
  {
    locale: 'en',
    slug: 'how-to-change-id-photo-background-color',
    title: 'Change ID Photo Background Color Online: White, Blue, Red',
    description: 'Change an ID photo background color online to white, blue, red, or gray, then crop, resize, and download a clean file.',
    keywords: ['change ID photo background color'],
  },
  {
    locale: 'de',
    slug: '2-bilder-auf-eine-seite-drucken',
    title: '2 Bilder auf eine Seite drucken: Layout online erstellen',
    description: 'Erstelle ein Drucklayout, um 2 Bilder auf eine Seite zu drucken, mit passender Groesse, Abstand und Zuschnitt.',
    keywords: ['2 Bilder auf eine Seite drucken'],
  },
  {
    locale: 'fr',
    slug: 'comment-mettre-en-page-photos-identite',
    title: 'Mettre en page des photos d’identité pour impression',
    description: 'Découvrez comment mettre en page des photos d’identité, choisir le format, garder des marges et préparer une feuille imprimable.',
    keywords: ['mettre en page photos identité'],
  },
  {
    locale: 'de',
    slug: 'bilder-zum-drucken-gratis',
    title: 'Bilder zum Drucken gratis online vorbereiten',
    description: 'Bereite Bilder zum Drucken gratis vor, waehle Groesse und Layout und lade eine saubere Druckdatei fuer Zuhause oder Copyshop herunter.',
    keywords: ['Bilder zum Drucken gratis'],
  },
  {
    locale: 'en',
    slug: 'free-id-photo-print-sheet-maker-online',
    title: 'Free ID Photo Print Sheet Maker Online for 4x6 and A4',
    description: 'Make an ID photo print sheet online for 4x6, A4, or Letter paper, with repeated copies and cutting space.',
    keywords: ['ID photo print sheet maker'],
  },
  {
    locale: 'es',
    slug: 'cambiar-fondo-foto-carnet',
    title: 'Cambiar fondo de foto carnet online: blanco, azul o rojo',
    description: 'Cambia el fondo de una foto carnet a blanco, azul o rojo, ajusta el recorte y descarga una imagen lista para usar.',
    keywords: ['cambiar fondo foto carnet'],
  },
  {
    locale: 'fr',
    slug: 'redimensionner-photo-pour-cv',
    title: 'Redimensionner une photo pour CV en ligne',
    description: 'Redimensionnez une photo pour CV, ajustez le cadrage, le fond et la taille du fichier avant de l’ajouter à votre candidature.',
    keywords: ['redimensionner photo pour CV'],
  },
  {
    locale: 'en',
    slug: 'magic-headshot-ai-professional-headshots-from-selfies',
    title: 'AI Professional Headshots from Selfies for LinkedIn and CVs',
    description: 'Turn selfies into professional AI headshots for LinkedIn, resumes, team pages, and business profiles with clean style options.',
    keywords: ['AI professional headshots from selfies'],
  },
  {
    locale: 'en',
    slug: 'free-resume-photo-generator-online',
    title: 'Free Resume Photo Generator Online for Job Applications',
    description: 'Create a resume photo online from a selfie, choose a professional look, and prepare a clean image for job applications.',
    keywords: ['free resume photo generator'],
  },
  {
    locale: 'es',
    slug: 'editor-de-fotos-gratis-para-fotos-carnet',
    title: 'Editor de fotos gratis para fotos carnet online',
    description: 'Edita fotos carnet online gratis: recorta la imagen, cambia el fondo, ajusta el tamaño y prepara una hoja para imprimir.',
    keywords: ['editor fotos carnet gratis'],
  },
  {
    locale: 'ja',
    slug: 'rirekisho-shashin-app-muryo-osusume',
    title: '無料の履歴書写真アプリおすすめ：自宅で作成',
    description: '無料の履歴書写真アプリで、自宅の写真を履歴書向けに調整。背景、サイズ、服装、提出前チェックもスマホで確認できます。',
    keywords: ['履歴書写真アプリ 無料'],
  },
  {
    locale: 'en',
    slug: 'exam-headshot-for-student-id',
    title: 'Exam Headshot for Student ID: Crop, Background, Size',
    description: 'Prepare an exam headshot for student ID forms with clean crop, plain background, file-size tips, and printable photo options.',
    keywords: ['exam headshot for student ID'],
  },
  {
    locale: 'ja',
    slug: 'student-id-photo-ai',
    title: '学生証写真をAIで作成：背景とサイズを整える',
    description: '学生証写真をAIで作成し、白背景、顔位置、サイズ、服装、提出前の確認ポイントまでまとめて整えられます。スマホ写真にも使えます。',
    keywords: ['学生証写真 AI'],
  },
  {
    locale: 'en',
    slug: 'id-photo-creator',
    title: 'ID Photo Creator Online: Crop, Background, Print Sheet',
    description: 'Use an ID photo creator online to crop a portrait, change background color, resize files, and make a printable sheet.',
    keywords: ['ID photo creator online'],
  },
  {
    locale: 'de',
    slug: 'passfoto-hintergrundfarbe-aendern',
    title: 'Passfoto Hintergrundfarbe ändern: weiss, blau oder rot',
    description: 'Aendere die Hintergrundfarbe deines Passfotos online, waehle Weiss, Blau oder Rot und lade ein sauberes Bild herunter.',
    keywords: ['Passfoto Hintergrundfarbe ändern'],
  },
  {
    locale: 'es',
    slug: 'tamano-foto-cv-pixeles',
    title: 'Tamaño de foto para CV en píxeles: medidas y recorte',
    description: 'Consulta el tamaño de foto para CV en píxeles, ajusta el recorte y prepara una imagen clara para currículum o LinkedIn.',
    keywords: ['tamaño foto CV píxeles'],
  },
  {
    locale: 'ja',
    slug: 'gakusei-shomei-shashin-app-muryo',
    title: '学生向け証明写真アプリ無料：自宅で写真作成',
    description: '学生向け証明写真を無料で作る方法を紹介。スマホ写真、背景、サイズ、印刷レイアウトまでまとめて確認できます。提出前にも便利です。',
    keywords: ['学生証明写真アプリ'],
  },
  {
    locale: 'es',
    slug: 'cambio-foto-curriculum-ia',
    title: 'Cambiar foto de currículum con IA: fondo, estilo y recorte',
    description: 'Mejora o cambia la foto de currículum con IA, ajusta el estilo profesional, el fondo y el recorte antes de enviarla.',
    keywords: ['cambiar foto curriculum IA'],
  },
  {
    locale: 'fr',
    slug: 'photo-identite-fond-blanc-gratuit-en-ligne',
    title: 'Photo d’identité fond blanc gratuite en ligne',
    description: 'Créez une photo d’identité à fond blanc en ligne, ajustez le cadrage, la taille et téléchargez une image prête à utiliser.',
    keywords: ['photo identité fond blanc'],
  },
  {
    locale: 'fr',
    slug: 'changer-fond-photo-identite',
    title: 'Changer le fond d’une photo d’identité en ligne',
    description: 'Changez le fond d’une photo d’identité en blanc, bleu, rouge ou gris, puis ajustez le cadrage et téléchargez le résultat.',
    keywords: ['changer fond photo identité'],
  },
  {
    locale: 'es',
    slug: 'foto-para-linkedin-con-ia-gratis-estudiantes',
    title: 'Foto para LinkedIn con IA gratis para estudiantes',
    description: 'Crea una foto para LinkedIn con IA desde un selfie, con estilo profesional, fondo limpio y formato útil para estudiantes.',
    keywords: ['foto LinkedIn IA estudiantes'],
  },
  {
    locale: 'es',
    slug: 'tamano-foto-cv-en-cm',
    title: 'Tamaño de foto para CV en cm: medidas y formato',
    description: 'Consulta el tamaño de foto para CV en cm, prepara el recorte correcto y ajusta fondo, proporción y archivo final.',
    keywords: ['tamaño foto CV cm'],
  },
  {
    locale: 'es',
    slug: 'editor-foto-curriculum-gratis',
    title: 'Editor de foto para currículum gratis online',
    description: 'Edita una foto para currículum gratis online: mejora el estilo, ajusta fondo y recorte, y descarga una imagen clara.',
    keywords: ['editor foto curriculum gratis'],
  },
  {
    locale: 'en',
    slug: 'professional-headshots-without-studio-ai',
    title: 'Professional Headshots Without a Studio: AI Photo Guide',
    description: 'Create professional headshots without a studio using AI, then check likeness, background, crop, and download quality.',
    keywords: ['professional headshots without studio'],
  },
  {
    locale: 'en',
    slug: 'free-photo-generator-for-student-id-and-resume',
    title: 'Free Photo Generator for Student ID and Resume Photos',
    description: 'Generate photos for student IDs and resumes, then crop, change background, resize, and prepare a printable layout.',
    keywords: ['student ID resume photo generator'],
  },
  {
    locale: 'de',
    slug: 'selfie-in-avatar-stil-umwandeln',
    title: 'Selfie in Avatar-Stil umwandeln: professionell mit KI',
    description: 'Wandle ein Selfie in einen Avatar-Stil um, pruefe professionellen Look, Hintergrund und Zuschnitt fuer Profil oder Bewerbung.',
    keywords: ['Selfie in Avatar-Stil umwandeln'],
  },
  {
    locale: 'es',
    slug: 'foto-profesional-para-curriculum-con-ia',
    title: 'Foto profesional para currículum con IA',
    description: 'Crea una foto profesional para currículum con IA desde un selfie, con fondo limpio, estilo laboral y recorte correcto.',
    keywords: ['foto profesional curriculum IA'],
  },
  {
    locale: 'ja',
    slug: 'riisaizu-online-shomei-shashin-magic-headshot',
    title: '証明写真をオンラインでリサイズする方法',
    description: '証明写真をオンラインでリサイズし、履歴書、学生証、申請フォームに合うサイズとファイル容量に調整します。提出前確認にも使えます。',
    keywords: ['証明写真 リサイズ オンライン'],
  },
  {
    locale: 'en',
    slug: 'headshot-resume-template-for-teachers',
    title: 'Headshot Resume Template for Teachers: Photo Tips',
    description: 'Prepare a teacher resume headshot with clean crop, friendly professional style, background tips, and layout checks.',
    keywords: ['teacher resume headshot'],
  },
  {
    locale: 'ja',
    slug: 'create-document-photos-free-magic-headshot',
    title: '証明写真を無料で作成：背景、サイズ、印刷まで',
    description: '自撮りから証明写真を無料で作成し、背景、サイズ、印刷レイアウト、提出前チェックまでまとめて整えます。学生証や履歴書にも使えます。',
    keywords: ['証明写真 無料作成'],
  },
  {
    locale: 'en',
    slug: 'generate-id-photo-change-background-print-sheet',
    title: 'Generate ID Photo, Change Background, and Print Sheet',
    description: 'Generate an ID photo, change the background to white, blue, or red, crop the image, and create a printable sheet.',
    keywords: ['generate ID photo print sheet'],
  },
  {
    locale: 'en',
    slug: 'cropping-and-resizing-photos-for-id-cards-free',
    title: 'Crop and Resize Photos for ID Cards Free Online',
    description: 'Crop and resize photos for ID cards online, adjust the background, reduce file size, and prepare school or work photos.',
    keywords: ['crop resize ID card photo'],
  },
  {
    locale: 'en',
    slug: 'ai-resume-photo-editor-guide',
    title: 'AI Resume Photo Editor Guide: Make a Professional Photo',
    description: 'Use an AI resume photo editor to improve a selfie, choose a professional style, fix background, crop, and export.',
    keywords: ['AI resume photo editor'],
  },
  {
    locale: 'de',
    slug: 'passbilder-layout-zum-drucken',
    title: 'Passbilder Layout zum Drucken online erstellen',
    description: 'Erstelle ein Passbilder-Layout zum Drucken, waehle Fotoformat und Papiergroesse und lasse genug Abstand zum Schneiden.',
    keywords: ['Passbilder Layout zum Drucken'],
  },
  {
    locale: 'en',
    slug: 'shape-crop-online-free',
    title: 'Shape Crop Online Free: Circle, Heart, Rounded PNG',
    description: 'Crop a photo into a circle, heart, rounded square, or custom shape online, then download a transparent PNG.',
    keywords: ['shape crop online'],
  },
  {
    locale: 'es',
    slug: 'foto-carnet-inteligencia-artificial-gratis',
    title: 'Foto carnet con inteligencia artificial gratis online',
    description: 'Crea una foto carnet con inteligencia artificial, ajusta fondo blanco, azul o rojo, recorte y tamaño para descargar.',
    keywords: ['foto carnet inteligencia artificial'],
  },
  {
    locale: 'en',
    slug: 'headshot-generator-chatgpt-linkedin-profile-photos',
    title: 'Headshot Generator for LinkedIn Profile Photos',
    description: 'Use an AI headshot generator for LinkedIn profile photos, turn selfies into business portraits, and check crop quality.',
    keywords: ['LinkedIn headshot generator'],
  },
  {
    locale: 'en',
    slug: 'resume-photo-editor-ai-free',
    title: 'Free AI Resume Photo Editor for Job Applications',
    description: 'Edit a resume photo with AI, create a professional look, clean the background, crop the image, and prepare applications.',
    keywords: ['free AI resume photo editor'],
  },
  {
    locale: 'ja',
    slug: 'ai-headshot-for-resume-japan',
    title: '日本の履歴書向けAI証明写真・プロフィール写真',
    description: '日本の履歴書向けにAIで履歴書写真を整える方法を解説。背景、服装、顔位置、サイズ、提出前確認まで対応できます。',
    keywords: ['履歴書写真 AI'],
  },
  {
    locale: 'fr',
    slug: 'photo-cv-pour-etudiant',
    title: 'Photo CV pour étudiant : format, fond et style',
    description: 'Préparez une photo CV pour étudiant avec un fond propre, un cadrage clair, une taille adaptée et un rendu professionnel.',
    keywords: ['photo CV étudiant'],
  },
  {
    locale: 'ja',
    slug: 'student-resume-photo-ai-guide',
    title: '学生の履歴書写真をAIで整えるガイド',
    description: '学生の履歴書写真をAIで整え、清潔感のある背景、服装、顔位置、サイズ、提出前チェックまで確認します。就活準備にも便利です。',
    keywords: ['学生 履歴書写真 AI'],
  },
  {
    locale: 'en',
    slug: 'professional-headshot-photo-for-job-application',
    title: 'Professional Headshot Photo for Job Applications',
    description: 'Create a professional headshot photo for job applications with clean lighting, business style, background, and crop tips.',
    keywords: ['professional headshot job application'],
  },
  {
    locale: 'ja',
    slug: 'muryo-shomei-shashin-kako-app',
    title: '無料証明写真加工アプリ：背景とサイズを調整',
    description: '無料証明写真加工アプリで、自撮り写真の背景、サイズ、顔位置、印刷レイアウトを整える方法を紹介します。提出前にも確認できます。',
    keywords: ['証明写真加工アプリ 無料'],
  },
  {
    locale: 'en',
    slug: 'how-to-layout-id-photos-for-printing',
    title: 'How to Layout ID Photos for Printing on 4x6 or A4',
    description: 'Learn how to layout ID photos for printing, choose the right paper size, leave cutting space, and download a sheet.',
    keywords: ['layout ID photos for printing'],
  },
  {
    locale: 'ja',
    slug: 'resume-photo-app-free-background-change',
    title: '履歴書写真アプリ無料：背景変更とサイズ調整',
    description: '無料の履歴書写真アプリで背景を変更し、白背景、顔位置、サイズ、ファイル容量を提出向けに整えられます。自宅作成にも便利です。',
    keywords: ['履歴書写真アプリ 背景変更'],
  },
  {
    locale: 'en',
    slug: 'ai-headshot-business-generator-realistic-professional-portraits',
    title: 'AI Business Headshot Generator for Realistic Portraits',
    description: 'Generate realistic business headshots with AI for LinkedIn, resumes, company profiles, and client-facing pages.',
    keywords: ['AI business headshot generator'],
  },
  {
    locale: 'en',
    slug: 'resume-photo-size-in-cm',
    title: 'Resume Photo Size in cm: Common Dimensions and Crop Tips',
    description: 'Check resume photo size in cm, choose a clean crop, prepare the background, and export a file for applications.',
    keywords: ['resume photo size cm'],
  },
  {
    locale: 'en',
    slug: 'resume-photo-editor-online-free',
    title: 'Resume Photo Editor Online Free: Crop, Background, Size',
    description: 'Edit a resume photo online for free, crop the portrait, adjust background color, resize, and download a clean image.',
    keywords: ['resume photo editor online'],
  },
  {
    locale: 'ja',
    slug: 'resume-photo-home-app-free-recommended',
    title: '自宅で履歴書写真を作る無料アプリおすすめ',
    description: '自宅で履歴書写真を作る無料アプリの使い方を紹介。背景、サイズ、服装、印刷前の確認までまとめて整えられます。スマホ写真にも対応します。',
    keywords: ['履歴書写真 自宅 アプリ'],
  },
  {
    locale: 'en',
    slug: 'linkedin-photo-background-for-students',
    title: 'LinkedIn Photo Background for Students: Clean Options',
    description: 'Choose a LinkedIn photo background for students, compare white, gray, office, and simple studio looks before uploading.',
    keywords: ['LinkedIn photo background students'],
  },
  {
    locale: 'ja',
    slug: 'resume-photo-app-pc-japan',
    title: 'PCで履歴書写真を作るアプリ・オンライン方法',
    description: 'PCで履歴書写真を作る方法を解説。背景変更、サイズ調整、顔位置、印刷レイアウトをオンラインで整えます。自宅印刷にも便利です。',
    keywords: ['履歴書写真アプリ PC'],
  },
  {
    locale: 'en',
    slug: 'reduce-jpg-size-free',
    title: 'Reduce JPG Size Free Online for Forms and Uploads',
    description: 'Reduce JPG size online for free, set a target KB, keep the image clear, and prepare files for forms or profile uploads.',
    keywords: ['reduce JPG size free'],
  },
  {
    locale: 'ja',
    slug: 'resume-photo-app-free-recommended',
    title: '履歴書写真アプリ無料おすすめ：スマホで作成',
    description: '無料の履歴書写真アプリで、スマホ写真の背景、サイズ、顔位置、ファイル容量を提出前にまとめて整えられます。就活準備にも使えます。',
    keywords: ['履歴書写真アプリ 無料 おすすめ'],
  },
  {
    locale: 'en',
    slug: 'photo-layout-template-free',
    title: 'Free Photo Layout Template for Printing ID Photos',
    description: 'Create a free photo layout template for printing ID photos, arranging copies on 4x6, A4, or Letter paper.',
    keywords: ['photo layout template free'],
  },
  {
    locale: 'es',
    slug: 'foto-carnet-gratis-online',
    title: 'Foto carnet gratis online: fondo, recorte e impresión',
    description: 'Crea una foto carnet gratis online, cambia el fondo, ajusta el recorte y prepara una hoja para imprimir o descargar.',
    keywords: ['foto carnet gratis online'],
  },
  {
    locale: 'en',
    slug: 'what-size-of-photo-in-resume',
    title: 'What Size Photo in Resume? Common cm and Pixel Guide',
    description: 'Check what size photo to use in a resume, compare cm and pixel options, and prepare a clean professional crop.',
    keywords: ['resume photo size'],
  },
  {
    locale: 'en',
    slug: 'free-online-id-photo-maker-with-background-color-change',
    title: 'Free Online ID Photo Maker with Background Color Change',
    description: 'Make an ID photo online, change background color to white, blue, or red, crop the face, and prepare a print sheet.',
    keywords: ['online ID photo maker'],
  },
  {
    locale: 'en',
    slug: 'crop-photo-to-shape',
    title: 'Crop Photo to Shape Online: Circle, Heart, Rounded PNG',
    description: 'Crop a photo to a circle, heart, square, or rounded shape online and download a transparent PNG for profiles or graphics.',
    keywords: ['crop photo to shape'],
  },
  {
    locale: 'ja',
    slug: 'resume-photo-ng-examples-hat-sunglasses',
    title: '履歴書写真NG例：帽子・サングラス・背景の注意点',
    description: '履歴書写真のNG例を解説。帽子、サングラス、暗い背景、顔の隠れ、服装など提出前に避けたい点を確認します。撮り直し防止にも役立ちます。',
    keywords: ['履歴書写真 NG例'],
  },
  {
    locale: 'en',
    slug: 'free-ai-headshot-generator-for-resume',
    title: 'Free AI Headshot Generator for Resume Photos',
    description: 'Use a free AI headshot generator for resume photos, turn a selfie into a professional portrait, and check crop and background.',
    keywords: ['free AI headshot generator resume'],
  },
  {
    locale: 'en',
    slug: 'free-ai-photo-generator-for-resume-profile-picture',
    title: 'Free AI Photo Generator for Resume Profile Pictures',
    description: 'Create a resume profile picture with AI from a selfie, choose a professional style, and prepare a clean photo for applications.',
    keywords: ['AI photo generator resume'],
  },
  {
    locale: 'en',
    slug: 'round-shape-photo-crop-online',
    title: 'Round Shape Photo Crop Online: Circle Avatar PNG',
    description: 'Crop a photo into a round shape online, adjust the image position, and download a transparent PNG for avatars or profiles.',
    keywords: ['round photo crop online'],
  },
]

loadEnvFile(path.resolve(process.cwd(), '.env.local'))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

async function main() {
  const results = []

  for (const update of updates) {
    const validation = validate(update)
    if (validation.length > 0) {
      results.push({ locale: update.locale, slug: update.slug, ok: false, validation })
      continue
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: update.title,
        description: update.description,
        keywords: update.keywords,
      })
      .eq('locale', update.locale)
      .eq('slug', update.slug)
      .select('id,locale,slug,title,description,keywords')
      .maybeSingle()

    if (error) throw error
    results.push({ locale: update.locale, slug: update.slug, ok: Boolean(data), id: data?.id || null })
  }

  console.log(JSON.stringify(results, null, 2))
}

function validate(update) {
  const issues = []
  if (!update.title || update.title.length > 70) issues.push(`title length ${update.title.length}`)
  if (!update.description || update.description.length > 180) issues.push(`description length ${update.description.length}`)
  if (update.locale === 'ja') {
    if (update.description.length < 55 || update.description.length > 90) issues.push(`ja description target length ${update.description.length}`)
  } else if (update.description.length < 95 || update.description.length > 145) {
    issues.push(`description target length ${update.description.length}`)
  }
  if (!Array.isArray(update.keywords) || update.keywords.length < 1 || update.keywords.length > 3) {
    issues.push('keywords must contain 1-3 items')
  }
  return issues
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue

    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[match[1]] = value
  }
}

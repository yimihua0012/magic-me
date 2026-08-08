const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const updates = [
  {
    locale: 'es',
    slug: 'tamano-foto-cv-pixeles',
    intro: 'El tamaño de foto para CV en píxeles depende del uso final, pero una medida cuadrada de 400x400 px o una versión rectangular de 400x500 px suele cubrir la mayoría de CV digitales, LinkedIn y portales de empleo. Si la imagen está borrosa, recortada o demasiado grande, tu candidatura pierde claridad. Esta guía te da la respuesta rápida y las medidas exactas para elegir el tamaño correcto sin perder calidad.',
    sections: [
      {
        heading: 'Respuesta rápida: qué tamaño usar',
        body: 'Para un CV digital, usa 400x400 px si necesitas un formato cuadrado o 400x500 px si prefieres un retrato vertical. Para impresión, la referencia habitual es 35x45 mm a 300 ppp, que equivale a unos 413x531 px. Si la plataforma no indica una medida concreta, elige un formato cuadrado limpio y sin recortes agresivos.',
      },
      {
        heading: 'Tabla de tamaños recomendados',
        body: '| Uso | Tamaño recomendado | Notas |\n| --- | --- | --- |\n| CV digital | 400x400 px | Seguro para la mayoría de plantillas |\n| LinkedIn | 400x400 px | Funciona bien en el recorte circular |\n| CV vertical | 400x500 px | Aspecto más documental |\n| Impresión | 35x45 mm | Aproximadamente 413x531 px a 300 ppp |',
      },
      {
        heading: 'Cuándo usar cada formato',
        body: 'Usa el cuadrado cuando la foto vaya en un borde o en una tarjeta de perfil. Usa el vertical cuando el CV tenga un bloque de foto clásico. Si vas a reutilizar la misma imagen para CV y LinkedIn, conserva una versión cuadrada y otra vertical para no forzar un recorte único. Para trabajos internacionales, revisa primero el país de destino y adapta la proporción al requisito real.',
      },
      {
        heading: 'Herramienta recomendada',
        body: 'Si no quieres redimensionar manualmente, sube tu selfie a /free-id-photo-tool o abre /photo-tools para recortar, cambiar fondo y ajustar el tamaño antes de descargar el archivo final.',
      },
      {
        heading: 'Preguntas frecuentes',
        body: '¿Puedo ampliar una foto pequeña? No es lo ideal, porque perderá nitidez. ¿Sirve una foto de LinkedIn? Sí, si el recorte sigue siendo limpio. ¿Qué fondo conviene? Blanco o gris claro suelen funcionar mejor para CV y perfiles profesionales.',
      },
    ],
    seo_enhancement: {
      category: 'Guías profesionales',
      audience: 'Profesionales españoles que buscan empleo o quieren actualizar su currículum y perfil de LinkedIn con una foto del tamaño correcto.',
      searchIntent: 'Obtener las dimensiones exactas en píxeles para la foto del currículum y saber cómo ajustarla sin perder calidad.',
      uniqueAngle: 'Enfoque práctico con medidas específicas para CV digital e impresión, más una tabla clara para comparar usos.',
      actionSteps: [
        'Identifica el destino de la foto: CV digital, LinkedIn o impresión.',
        'Elige 400x400 px o 400x500 px para usos digitales.',
        'Usa 35x45 mm si necesitas una versión impresa.',
        'Comprueba que el rostro siga nítido después del recorte.',
        'Exporta una copia cuadrada y otra vertical si vas a reutilizarla.',
      ],
      qualityChecks: [
        { label: 'Dimensiones exactas', detail: 'Verifica que el archivo coincide con la medida elegida antes de enviarlo.' },
        { label: 'Nitidez', detail: 'La foto no debe verse pixelada ni borrosa al ampliar.' },
        { label: 'Fondo y encuadre', detail: 'El fondo debe ser neutro y el rostro debe quedar centrado.' },
      ],
      avoid: [
        'Redimensionar una imagen pequeña hasta que se pixele.',
        'Usar un fondo muy cargado o doméstico.',
        'Recortar demasiado la frente, la barbilla o los hombros.',
      ],
      internalLinks: [
        { href: '/free-id-photo-tool', label: 'Open free ID photo tool', reason: 'Crop and resize the photo with a single tool.' },
        { href: '/photo-tools', label: 'Open photo tools', reason: 'Compare crop, resize, background, and print options.' },
      ],
      relatedSlugs: ['tamano-foto-cv-en-cm', 'foto-carnet-gratis-online', 'editor-foto-curriculum-gratis'],
    },
  },
  {
    locale: 'es',
    slug: 'tamano-foto-cv-en-cm',
    intro: 'El tamaño de foto para CV en cm suele resolverse con una referencia simple: 4x4 cm, 3.5x4.5 cm o 4.5x4.5 cm, según el país y el tipo de candidatura. Si eliges la medida correcta desde el principio, la foto se ve más ordenada, no rompe el diseño del CV y evita recortes improvisados. Aquí tienes la guía rápida para acertar.',
    sections: [
      {
        heading: 'Respuesta rápida: qué medida usar',
        body: 'Para España, 4x4 cm sigue siendo una referencia muy común en CV digitales e impresos. Si necesitas un formato más clásico de documento, 3.5x4.5 cm también funciona bien. Cuando la oferta no especifica nada, usa la medida que mejor encaje con el diseño del CV y deja un margen limpio alrededor del rostro.',
      },
      {
        heading: 'Tabla de medidas en cm',
        body: '| Uso | Medida recomendada | Relación |\n| --- | --- | --- |\n| CV en España | 4x4 cm | 1:1 |\n| CV clásico | 3.5x4.5 cm | 7:9 |\n| Perfil profesional | 4.5x4.5 cm | 1:1 |\n| Documento impreso | 35x45 mm | 3.5x4.5 cm |',
      },
      {
        heading: 'Cómo elegir la proporción correcta',
        body: 'Si la foto es cuadrada, el resultado suele encajar mejor en perfiles digitales. Si necesitas un bloque clásico de currículum, la versión rectangular da una sensación más formal. Para no perder calidad, prepara una foto base bien iluminada y después exporta la proporción que pida la candidatura. Si dudas, conserva ambas versiones.',
      },
      {
        heading: 'Herramienta recomendada',
        body: 'Para ajustar la medida exacta sin hacer el recorte a mano, abre /free-id-photo-tool o /photo-tools y deja que la herramienta ajuste fondo, encuadre y tamaño final.',
      },
      {
        heading: 'Preguntas frecuentes',
        body: '¿Conviene usar la misma foto para CV y LinkedIn? Sí, pero no siempre con el mismo recorte. ¿Qué fondo funciona mejor? Blanco, gris claro o azul suave. ¿Puedo convertir una selfie normal? Sí, siempre que el rostro esté bien visible y la luz sea uniforme.',
      },
    ],
    seo_enhancement: {
      category: 'Consejos profesionales',
      audience: 'Buscadores de empleo en España y Latinoamérica',
      searchIntent: 'Obtener las medidas exactas en centímetros para la foto del currículum.',
      uniqueAngle: 'Guía práctica centrada en tamaños en cm, con conversiones simples y ejemplos de uso real.',
      actionSteps: [
        'Mide el espacio de foto en tu CV o plantilla.',
        'Elige 4x4 cm o 3.5x4.5 cm según el formato.',
        'Comprueba la versión impresa antes de enviar la candidatura.',
        'Guarda también una copia cuadrada para perfiles digitales.',
      ],
      qualityChecks: [
        { label: 'Dimensiones exactas', detail: 'La foto debe coincidir con la medida en cm requerida.' },
        { label: 'Nitidez', detail: 'La imagen no debe perder detalle al cambiar de tamaño.' },
        { label: 'Proporciones faciales', detail: 'El rostro debe quedar centrado y visible.' },
      ],
      avoid: [
        'Usar una foto demasiado grande para el diseño.',
        'Estirar la imagen para que entre en la plantilla.',
        'Dejar el fondo con demasiado ruido visual.',
      ],
      internalLinks: [
        { href: '/free-id-photo-tool', label: 'Open free ID photo tool', reason: 'Set the exact crop and size quickly.' },
        { href: '/photo-tools', label: 'Open photo tools', reason: 'Resize and adjust the image before export.' },
      ],
      relatedSlugs: ['tamano-foto-cv-pixeles', 'foto-carnet-gratis-online', 'editor-foto-curriculum-gratis'],
    },
  },
  {
    locale: 'en',
    slug: 'id-photo-creator',
    intro: 'A good ID photo creator should answer the job in one pass: crop the face, set the background color, fit the right size, and produce a printable file. That is the practical goal of this guide. If you need a passport photo, resume photo, student ID photo, or printable sheet, the fastest path is to start from a clear selfie and let the tool handle the boring parts.',
    sections: [
      {
        heading: 'What size should you use?',
        body: 'Most ID photos follow one of a few standard sizes: 2x2 inch, 35x45 mm, or other country-specific document formats. The right choice depends on the form, country, or school requirement. If nothing is specified, start from the standard document size used in your region and keep the face centered with a clean border.',
      },
      {
        heading: 'Common ID photo sizes',
        body: '| Use case | Size | Notes |\n| --- | --- | --- |\n| US passport-style photo | 2x2 in | Common for many forms |\n| European document photo | 35x45 mm | Standard for many CV and ID uses |\n| Printable sheet | 4x6 in or A4 | Good for multiple copies |\n| Resume or profile use | Square crop | Works well for digital profiles |',
      },
      {
        heading: 'How the creator should work',
        body: 'A useful creator should let you upload a selfie, crop the face, change background color, and export a clean file or print sheet. That way, you can move from a random photo to a document-ready result without opening a separate editor. The best workflow is usually: upload, crop, review, export.',
      },
      {
        heading: 'Best next step inside the app',
        body: 'Open /free-id-photo-tool if you want the fastest document workflow, or /photo-tools if you want to compare crop, resize, background, and printable layout tools in one place.',
      },
      {
        heading: 'FAQ',
        body: 'Can I use a selfie? Yes, if the face is clear and recent. Can I change the background later? Yes, that is one of the main reasons to use an ID photo creator. Can I print multiple copies? Yes, a print sheet is ideal for that.',
      },
    ],
    seo_enhancement: {
      category: 'AI Photo Tools',
      audience: 'Students, professionals, job seekers, travelers, and anyone needing quick, compliant ID photos or headshots.',
      searchIntent: 'Users want a fast, reliable, and free way to create ID photos and professional headshots from home without hiring a photographer or learning complex software.',
      uniqueAngle: 'Combine ID photo compliance with a simple tool-first workflow that ends in a printable result.',
      actionSteps: [
        'Upload a few clear selfies with good lighting.',
        'Pick the document size or photo crop you need.',
        'Set the background color if required.',
        'Export the photo or print sheet.',
      ],
      qualityChecks: [
        { label: 'Face detection accuracy', detail: 'The face should stay centered and easy to recognize.' },
        { label: 'Compliance with ID standards', detail: 'The output should match common size and background rules.' },
        { label: 'Image clarity', detail: 'The result should stay sharp enough for screen and print.' },
      ],
      avoid: [
        'Overpromising official acceptance.',
        'Using blurry selfies or group photos.',
        'Skipping the final crop review.',
      ],
      internalLinks: [
        { href: '/free-id-photo-tool', label: 'Open free ID photo tool', reason: 'Use the document workflow directly.' },
        { href: '/photo-tools', label: 'Open photo tools', reason: 'Compare crop and background tools.' },
      ],
      relatedSlugs: ['free-id-photo-tool', 'how-to-change-id-photo-background-color', 'how-to-layout-id-photos-for-printing'],
    },
  },
  {
    locale: 'en',
    slug: 'resume-photo-size-in-cm',
    intro: 'Resume photo size in cm depends on region, but 3.5x4.5 cm, 4x4 cm, and 5x5 cm are the most common formats people compare. The practical answer is to match the country, keep the crop clean, and avoid forcing one universal size onto every resume. This guide gives the quick reference you need before you paste the image into a real CV layout.',
    sections: [
      {
        heading: 'Quick answer',
        body: 'If you need a safe default for many international resumes, 3.5x4.5 cm is the most useful starting point. For square profile-style resumes, 4x4 cm or 5x5 cm can also work. The best choice is always the one that fits the actual resume template without looking cramped.',
      },
      {
        heading: 'Size reference table',
        body: '| Region or use | Common size | Notes |\n| --- | --- | --- |\n| Many EU CVs | 3.5x4.5 cm | Very common document ratio |\n| Square profile layouts | 4x4 cm | Clean digital crop |\n| US passport-style use | 5x5 cm | Works for some forms and profiles |\n| Printable resume photo | 35x45 mm | Same as 3.5x4.5 cm |',
      },
      {
        heading: 'How to choose the right crop',
        body: 'Use a crop that leaves a little room above the head and around the shoulders. Keep the face centered and avoid aggressive zooming. If the resume is going to be read on screen, a square crop is easy to manage. If it will be printed or used in a formal CV, the rectangular form is usually safer.',
      },
      {
        heading: 'Best next step',
        body: 'Open /free-id-photo-tool if you want to set a document crop quickly, or /photo-tools if you need to resize, change background, or prepare a printable version before saving the resume.',
      },
      {
        heading: 'FAQ',
        body: 'Should the same image work for LinkedIn and the resume? Usually yes, but the crop may differ. Is a tiny photo okay? Only if the template is built for it. Can I use 300 ppp for print? Yes, that is a good target for a final file.',
      },
    ],
    seo_enhancement: {
      category: 'Resume Photo Tips',
      audience: 'Job seekers preparing resumes for different countries and industries.',
      searchIntent: 'Find the exact photo size requirements for a resume and learn how to resize it correctly.',
      uniqueAngle: 'Focus on regional differences and practical resizing steps using free online tools.',
      actionSteps: [
        'Identify the target region and template style.',
        'Choose the closest standard size for that market.',
        'Check the photo in the actual resume layout.',
        'Keep a clean exported copy for printing and PDF use.',
      ],
      qualityChecks: [
        { label: 'Aspect ratio preserved', detail: 'The photo should not be stretched or squashed.' },
        { label: 'Resolution sufficient', detail: 'The image should stay clear when printed or zoomed.' },
        { label: 'File size optimized', detail: 'The file should stay small enough for simple sharing.' },
      ],
      avoid: [
        'Using a full-body or group photo.',
        'Cropping too tightly around hair or chin.',
        'Applying filters that change the face too much.',
      ],
      internalLinks: [
        { href: '/free-id-photo-tool', label: 'Open free ID photo tool', reason: 'Set the crop and export quickly.' },
        { href: '/photo-tools', label: 'Open photo tools', reason: 'Resize and prepare the final file.' },
      ],
      relatedSlugs: ['what-size-of-photo-in-resume', 'free-ai-photo-generator-for-resume-profile-picture', 'how-to-layout-id-photos-for-printing'],
    },
  },
  {
    locale: 'en',
    slug: 'what-size-of-photo-in-resume',
    intro: 'What size photo in a resume is the right one? In practice, the answer depends on the country, the template, and whether the resume is digital or printed. A safe default for many international applications is a compact portrait crop such as 3.5x4.5 cm or a square 400x400 px version for online use. This guide gives the quick answer first so you can move on with the rest of the application.',
    sections: [
      {
        heading: 'Fast answer',
        body: 'For digital resumes, a square image around 400x400 px is easy to place and reuse. For printed CVs, 3.5x4.5 cm is the most common document-style format. If a country-specific template asks for a different size, follow that rule instead of forcing a universal crop.',
      },
      {
        heading: 'Photo size comparison',
        body: '| Format | Common size | Best for |\n| --- | --- | --- |\n| Digital resume | 400x400 px | Online applications and profile blocks |\n| Printed resume | 3.5x4.5 cm | Traditional CV layouts |\n| Square profile crop | 4x4 cm | Clean profile reuse |\n| Document sheet | 35x45 mm | Passport-style or formal use |',
      },
      {
        heading: 'How to decide',
        body: 'If the resume lives online, keep the crop simple and square. If it is a PDF for printing or formal submission, use a document ratio that matches the local norm. The face should stay centered and recognizable, and the background should stay simple enough that it does not distract from the rest of the page.',
      },
      {
        heading: 'Tools to use next',
        body: 'Open /free-id-photo-tool for a quick document crop, or /photo-tools if you also want to resize, change background, or prepare a print-ready layout before exporting the final resume photo.',
      },
      {
        heading: 'FAQ',
        body: 'Can I reuse my LinkedIn headshot? Yes, if the crop still fits the resume. Is a square okay for every country? No, some countries still prefer a formal document-style portrait. Should I keep both versions? Yes, that is usually the safest choice.',
      },
    ],
    seo_enhancement: {
      category: 'Resume Photo Tips',
      audience: 'Job seekers deciding how to size a photo for a resume or CV.',
      searchIntent: 'Find the exact photo size requirements for a resume and decide between digital and print formats.',
      uniqueAngle: 'Give the answer first, then separate digital and print sizing so users can choose fast.',
      actionSteps: [
        'Decide whether the resume is digital or printed.',
        'Choose a square or document-style crop.',
        'Check the result in the actual resume layout.',
        'Keep a second version for LinkedIn reuse if needed.',
      ],
      qualityChecks: [
        { label: 'Crop fits the template', detail: 'The image should sit cleanly in the resume block.' },
        { label: 'Resolution is enough', detail: 'The file should stay sharp when shared or printed.' },
        { label: 'Likeness is preserved', detail: 'The image should still look like the same person.' },
      ],
      avoid: [
        'Using a crop that dominates the page.',
        'Choosing a fuzzy selfie from an old phone.',
        'Forcing one size onto every resume format.',
      ],
      internalLinks: [
        { href: '/free-id-photo-tool', label: 'Open free ID photo tool', reason: 'Set the correct crop in one step.' },
        { href: '/photo-tools', label: 'Open photo tools', reason: 'Resize and prepare the final output.' },
      ],
      relatedSlugs: ['resume-photo-size-in-cm', 'free-ai-photo-generator-for-resume-profile-picture', 'how-to-layout-id-photos-for-printing'],
    },
  },
]

loadEnvFile(path.resolve(process.cwd(), '.env.local'))

if (process.argv.includes('--dry-run')) {
  const results = updates.map((update) => ({
    locale: update.locale,
    slug: update.slug,
    introLength: update.intro.length,
    sections: update.sections.length,
  }))
  console.log(JSON.stringify(results, null, 2))
  process.exit(0)
}

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
    const { data: before, error: readError } = await supabase
      .from('blog_posts')
      .select('id,locale,slug,intro,content,seo_enhancement,status')
      .eq('locale', update.locale)
      .eq('slug', update.slug)
      .maybeSingle()

    if (readError) throw readError

    if (!before) {
      results.push({ locale: update.locale, slug: update.slug, ok: false, reason: 'not found' })
      continue
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        intro: update.intro,
        content: { sections: update.sections },
        seo_enhancement: update.seo_enhancement,
      })
      .eq('id', before.id)
      .select('id,locale,slug,status')
      .single()

    if (error) throw error

    results.push({
      locale: update.locale,
      slug: update.slug,
      ok: true,
      status: data.status,
      beforeIntro: before.intro.slice(0, 80),
      afterIntro: update.intro.slice(0, 80),
      sections: update.sections.length,
    })
  }

  console.log(JSON.stringify(results, null, 2))
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

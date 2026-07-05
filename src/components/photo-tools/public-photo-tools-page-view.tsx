'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import LocalizedFooter from '@/components/layout/localized-footer'
import Button from '@/components/ui/button'
import { CheckCircle2, FileText, ImagePlus, Printer, ShieldAlert, Sparkles } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'
import { localizedLayoutContent } from '@/lib/localized-layout-content'
import { withSource } from '@/lib/navigation-source'

type SeoContent = {
  useTitle: string
  useItems: string[]
  sizeTitle: string
  sizeItems: string[]
  printTitle: string
  printItems: string[]
  warningTitle: string
  warningText: string
  faqTitle: string
  faqs: Array<{ question: string; answer: string }>
}

const pageContent: Record<Locale, {
  eyebrow: string
  title: string
  description: string
  generate: string
  sourceDescription: string
  upload: string
  empty: string
  loading: string
}> = {
  en: {
    eyebrow: 'Free ID Photo Tool',
    title: 'Free ID Photo Generator, Crop & Print',
    description: 'Upload a local portrait, generate common ID photo sizes, crop passport-style images, change background colors, and download a printable layout sheet for resumes, exams, badges, student cards, or everyday document photos.',
    generate: 'Generate Transparent PNG Portrait',
    sourceDescription: 'Upload a local PNG, JPG, or WebP portrait. Transparent PNG works best for background color changes.',
    upload: 'Upload Local Image',
    empty: 'Upload a local image to start cropping and printing.',
    loading: 'Loading photo tools...',
  },
  es: {
    eyebrow: "Foto tipo carnet gratis",
    title: "Recortar y preparar fotos tipo carnet para imprimir",
    description: "Sube una foto local, elige un tamano habitual, ajusta el recorte y descarga una hoja imprimible para CV, examenes, credenciales, tarjetas de estudiante o tramites no oficiales.",
    generate: "Crear retrato PNG transparente",
    sourceDescription: "Sube PNG, JPG o WebP. Para cambiar el color de fondo necesitas un PNG con transparencia.",
    upload: "Subir foto local",
    empty: "Sube una foto para empezar a recortar, revisar fondo y preparar impresion.",
    loading: "Cargando herramienta...",
  },
  fr: {
    eyebrow: 'Outil gratuit de photo d identite',
    title: 'Generateur, recadrage et impression de photo d identite gratuits',
    description: 'Importez un portrait local, choisissez des formats courants par pays, changez le fond et telechargez une planche imprimable pour CV, examens, badges, cartes etudiant et petites photos du quotidien.',
    generate: 'Generer un portrait PNG transparent',
    sourceDescription: 'Importez un portrait PNG, JPG ou WebP. Un PNG transparent fonctionne mieux pour changer le fond.',
    upload: 'Importer une image locale',
    empty: 'Importez une image locale pour commencer le recadrage et l impression.',
    loading: 'Chargement des outils photo...',
  },
  de: {
    eyebrow: "Kostenloses Ausweisfoto-Tool",
    title: "Ausweisfoto zuschneiden und Druckbogen vorbereiten",
    description: "Lade ein lokales Foto hoch, waehle ein gaengiges Format, passe den Ausschnitt an und speichere einen Druckbogen fuer Lebenslauf, Pruefung, Mitarbeiterausweis oder private Unterlagen.",
    generate: "Transparentes PNG Portrait erstellen",
    sourceDescription: "PNG, JPG oder WebP hochladen. Hintergrundfarben funktionieren nur mit transparentem PNG.",
    upload: "Lokales Foto hochladen",
    empty: "Lade ein Foto hoch, um Zuschnitt, Hintergrundvorschau und Drucklayout zu starten.",
    loading: "Fototool wird geladen...",
  },
  ja: {
    eyebrow: "??????????",
    title: "???????????????????",
    description: "??????????????????????????????????????????????????????????????????????",
    generate: "??PNG?????????",
    sourceDescription: "PNG?JPG?WebP????????????????????????PNG??????",
    upload: "?????????",
    empty: "???????????????????????????????",
    loading: "???????????...",
  },
}

const seoContent: Record<Locale, SeoContent> = {
  en: {
    useTitle: 'Useful for everyday ID photo needs',
    useItems: [
      'Resume, job application, school registration, exam registration, staff badge, and print shop preparation.',
      'Free local upload, crop, background preview, and printable sheet download without signing in.',
      'Transparent PNG portraits work best when you need white, blue, red, or light gray backgrounds.',
    ],
    sizeTitle: 'Common photo sizes included',
    sizeItems: [
      'United States 2 x 2 in, China 1 inch and 2 inch, Japan 3 x 4 cm, EU 35 x 45 mm, India 2 x 2 in, and other frequent local sizes.',
      'Photo paper presets include 4 x 6 in, 5 x 7 in, A4, and common metric print sheets for multi-photo layouts.',
    ],
    printTitle: 'Prepared for small photo printing',
    printItems: [
      'Export one finished JPG for digital use or a print sheet with repeated copies on one page.',
      'The layout keeps physical size, margins, and crop ratio stable so it is easier to print at home or at a shop.',
    ],
    warningTitle: 'Not recommended for official passport or visa submission',
    warningText: 'Use this tool for resumes, school, exams, badges, and printing. For passports, visas, national IDs, or government submission, follow the official photo rules from that authority.',
    faqTitle: 'Free ID Photo Tool FAQ',
    faqs: [
      {
        question: 'Can I make a 2 inch or 2 x 2 inch photo?',
        answer: 'Yes. Choose the matching photo size, adjust the crop, and download either a single image or a printable sheet.',
      },
      {
        question: 'Can I change the background color?',
        answer: 'Yes. Background replacement works best with a transparent PNG portrait. Regular JPG photos can still be cropped and printed.',
      },
    ],
  },
  es: {
    useTitle: "Para usos cotidianos, no oficiales",
    useItems: [
      "CV, formularios, examenes, credenciales de empresa, tarjetas de estudiante y copias para imprimir.",
      "Carga local gratis, recorte, vista previa y descarga de hoja sin iniciar sesion.",
      "El cambio de fondo funciona mejor cuando la foto ya es un PNG transparente.",
    ],
    sizeTitle: "Formatos frecuentes en un solo lugar",
    sizeItems: [
      "Incluye 1 pulgada, 2 pulgadas, 2 x 2 pulgadas, 35 x 45 mm, 3 x 4 cm y otros tamanos habituales.",
      "Puedes preparar hojas 4 x 6, 5 x 7, A4, Letter y otros papeles comunes.",
    ],
    printTitle: "Listo para llevar a imprimir",
    printItems: [
      "Descarga una foto individual o una hoja con varias copias.",
      "El layout mantiene margenes y separacion para que sea mas facil imprimir a tamano real.",
    ],
    warningTitle: "No lo uses como garantia para pasaporte o visa",
    warningText: "Esta herramienta esta pensada para usos cotidianos. Para documentos oficiales, revisa siempre las reglas actuales de la autoridad correspondiente.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "Puedo cambiar el fondo?",
        answer: "Si, pero solo cuando la imagen seleccionada es un PNG transparente. Un JPG se puede recortar e imprimir, pero no reemplaza el fondo.",
      },
      {
        question: "Sirve para imprimir varias copias?",
        answer: "Si. Elige el papel y descarga una hoja JPG con las copias que quepan.",
      },
    ],
  },
  fr: {
    useTitle: 'Utile pour les photos d identite du quotidien',
    useItems: [
      'CV, inscription scolaire, concours, badge professionnel, dossier administratif simple et preparation d impression.',
      'Import local gratuit, recadrage, apercu du fond et planche imprimable sans connexion.',
      'Un portrait PNG transparent donne le meilleur resultat pour les fonds blanc, bleu, rouge ou gris clair.',
    ],
    sizeTitle: 'Formats courants pris en charge',
    sizeItems: [
      'Formats 35 x 45 mm, 3 x 4 cm, 2 x 2 pouces, 1 pouce, 2 pouces et autres tailles frequentes.',
      'Formats papier 10 x 15 cm, 13 x 18 cm, A4 et feuilles metriques pour plusieurs copies.',
    ],
    printTitle: 'Prepare pour l impression de petites photos',
    printItems: [
      'Telechargez une photo JPG seule ou une planche avec plusieurs exemplaires.',
      'La mise en page conserve le ratio, les marges et la taille physique pour une impression plus fiable.',
    ],
    warningTitle: 'Non recommande pour passeport ou visa officiel',
    warningText: 'Utilisez cet outil pour CV, ecole, examens, badges et impressions. Pour passeport, visa ou piece officielle, suivez les exigences de l autorite concernee.',
    faqTitle: 'Questions frequentes',
    faqs: [
      {
        question: 'Puis-je creer une photo 35 x 45 mm?',
        answer: 'Oui. Choisissez le format, ajustez le recadrage, puis telechargez une image seule ou une planche imprimable.',
      },
      {
        question: 'Puis-je modifier la couleur de fond?',
        answer: 'Oui. Le resultat est meilleur avec un portrait PNG transparent; les JPG restent utiles pour recadrer et imprimer.',
      },
    ],
  },
  de: {
    useTitle: "Fuer alltaegliche, nicht amtliche Fotos",
    useItems: [
      "Lebenslauf, Bewerbungen, Pruefungen, Mitarbeiterausweise, Studentenkarten und private Ausdrucke.",
      "Lokaler Upload, Zuschnitt, Vorschau und Druckbogen ohne Anmeldung.",
      "Hintergrundfarben sind fuer transparente PNG Portraits gedacht.",
    ],
    sizeTitle: "Haeufige Formate schnell waehlen",
    sizeItems: [
      "Unterstuetzt 1 Zoll, 2 Zoll, 2 x 2 Zoll, 35 x 45 mm, 3 x 4 cm und weitere Standardgroessen.",
      "Druckbogen fuer 4 x 6, 5 x 7, A4, Letter und gaengige Papierformate.",
    ],
    printTitle: "Praktisch fuer Fotoausdrucke",
    printItems: [
      "Einzelnes JPG oder Druckbogen mit mehreren Kopien herunterladen.",
      "Rand und Abstand bleiben stabil, damit Drucken in Originalgroesse einfacher ist.",
    ],
    warningTitle: "Keine Garantie fuer Pass oder Visum",
    warningText: "Das Tool ist fuer alltaegliche Zwecke gedacht. Fuer amtliche Dokumente gelten immer die aktuellen Vorgaben der jeweiligen Behoerde.",
    faqTitle: "Haeufige Fragen",
    faqs: [
      {
        question: "Kann ich den Hintergrund aendern?",
        answer: "Ja, wenn das ausgewaehlte Bild ein transparentes PNG ist. JPG Bilder lassen sich zuschneiden und drucken, aber der Hintergrund wird nicht ersetzt.",
      },
      {
        question: "Kann ich mehrere Kopien drucken?",
        answer: "Ja. Waehle ein Papierformat und lade den Druckbogen als JPG herunter.",
      },
    ],
  },
  ja: {
    useTitle: "??????????????",
    useItems: [
      "?????????????????????????????????????",
      "?????????????????????????????????????????",
      "??????????????PNG???????????",
    ],
    sizeTitle: "???????????",
    sizeItems: [
      "1 inch?2 inch?2 x 2 inch?35 x 45 mm?3 x 4 cm ????????????",
      "4 x 6?5 x 7?A4?Letter ?????????????????",
    ],
    printTitle: "????????????",
    printItems: [
      "??JPG???????????????JPG????????",
      "?????????????????????????????????",
    ],
    warningTitle: "??????????????????????",
    warningText: "??????????????????????????????????????????????",
    faqTitle: "??????",
    faqs: [
      {
        question: "????????????",
        answer: "??PNG??????????????JPG???????????????????????????",
      },
      {
        question: "????????????????",
        answer: "?????????????????????JPG???????????",
      },
    ],
  },
}

const PhotoToolsWorkbench = dynamic(() => import('@/components/photo-tools/photo-tools-workbench'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
      Loading photo tools...
    </div>
  ),
})

interface PublicPhotoToolsPageViewProps {
  locale?: Locale
}

export default function PublicPhotoToolsPageView({ locale = 'en' }: PublicPhotoToolsPageViewProps) {
  const content = pageContent[locale]
  const seo = seoContent[locale]
  const layout = localizedLayoutContent[locale].footer
  const uploadHref = withSource(localePath(locale, '/upload'), `free_id_photo_tool_generate_png_${locale}`)
  const resourceLinks = [
    { href: localePath(locale, '/pricing'), label: layout.pricing },
    { href: localePath(locale, '/sample'), label: layout.samples },
    { href: localePath(locale, '/questions'), label: layout.questions },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {locale === 'en' ? <Navbar /> : <LocalizedNavbar locale={locale} />}

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
                <ImagePlus className="h-4 w-4" />
                {content.eyebrow}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{content.title}</h1>
              <p className="mt-3 max-w-3xl text-slate-600">
                {content.description}
              </p>
            </div>
            <Link href={uploadHref} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <Sparkles className="mr-2 h-4 w-4" />
                {content.generate}
              </Button>
            </Link>
          </div>

          <PhotoToolsWorkbench
            locale={locale}
            allowUpload
            sourceDescription={content.sourceDescription}
            uploadLabel={content.upload}
            emptyState={(
              <p>{content.empty}</p>
            )}
          />

          <section className="mt-10 space-y-6" aria-label="Free ID photo details">
            <div className="grid gap-4 lg:grid-cols-3">
              <InfoPanel icon={FileText} title={seo.useTitle} items={seo.useItems} />
              <InfoPanel icon={ImagePlus} title={seo.sizeTitle} items={seo.sizeItems} />
              <InfoPanel icon={Printer} title={seo.printTitle} items={seo.printItems} />
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 flex-none text-amber-700" />
                <div>
                  <h2 className="font-bold">{seo.warningTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-amber-900">{seo.warningText}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-bold text-slate-900">{seo.faqTitle}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {seo.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-bold text-slate-900">{layout.resources}</h2>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                {resourceLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="font-medium text-blue-600 hover:underline">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {locale === 'en' ? <Footer /> : <LocalizedFooter locale={locale} />}
    </div>
  )
}

function InfoPanel({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof FileText
  title: string
  items: string[]
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>
      <ul className="space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-green-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

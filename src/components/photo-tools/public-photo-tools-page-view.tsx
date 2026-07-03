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
    description: 'Upload a local portrait, generate ID photo sizes, crop passport photos, change background colors, and download a printable layout sheet.',
    generate: 'Generate Transparent PNG Portrait',
    sourceDescription: 'Upload a local PNG, JPG, or WebP portrait. Transparent PNG works best for background color changes.',
    upload: 'Upload Local Image',
    empty: 'Upload a local image to start cropping and printing.',
    loading: 'Loading photo tools...',
  },
  es: {
    eyebrow: 'Herramienta gratis de foto de carnet',
    title: 'Generador, recorte e impresion gratis de foto de carnet',
    description: 'Sube un retrato local, elige tamanos comunes por pais, cambia el fondo y descarga una hoja lista para imprimir.',
    generate: 'Generar retrato PNG transparente',
    sourceDescription: 'Sube un retrato local PNG, JPG o WebP. Un PNG transparente funciona mejor para cambiar el fondo.',
    upload: 'Subir imagen local',
    empty: 'Sube una imagen local para empezar a recortar e imprimir.',
    loading: 'Cargando herramientas de foto...',
  },
  fr: {
    eyebrow: 'Outil gratuit de photo d identite',
    title: 'Generateur, recadrage et impression de photo d identite gratuits',
    description: 'Importez un portrait local, choisissez des formats courants par pays, changez le fond et telechargez une planche imprimable.',
    generate: 'Generer un portrait PNG transparent',
    sourceDescription: 'Importez un portrait PNG, JPG ou WebP. Un PNG transparent fonctionne mieux pour changer le fond.',
    upload: 'Importer une image locale',
    empty: 'Importez une image locale pour commencer le recadrage et l impression.',
    loading: 'Chargement des outils photo...',
  },
  de: {
    eyebrow: 'Kostenloses Ausweisfoto Tool',
    title: 'Kostenloser Ausweisfoto Generator, Zuschnitt und Druck',
    description: 'Lade ein lokales Portrat hoch, wahle gangige Landergroessen, andere den Hintergrund und lade einen Druckbogen herunter.',
    generate: 'Transparentes PNG Portrat erstellen',
    sourceDescription: 'Lade ein lokales PNG-, JPG- oder WebP-Portrat hoch. Transparente PNGs eignen sich am besten fur Hintergrundfarben.',
    upload: 'Lokales Bild hochladen',
    empty: 'Lade ein lokales Bild hoch, um Zuschnitt und Druck zu starten.',
    loading: 'Fototools werden geladen...',
  },
  ja: {
    eyebrow: '無料の証明写真ツール',
    title: '無料の証明写真作成・トリミング・印刷',
    description: 'ローカル画像をアップロードし、国や地域でよく使われるサイズを選び、背景色を変更して印刷用シートをダウンロードできます。',
    generate: '透明PNGポートレートを生成',
    sourceDescription: 'PNG、JPG、WebP のローカル画像をアップロードできます。背景色の変更には透明PNGが最適です。',
    upload: 'ローカル画像をアップロード',
    empty: 'ローカル画像をアップロードして、トリミングと印刷を始めます。',
    loading: '写真ツールを読み込み中...',
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
    useTitle: 'Practico para fotos de carnet no oficiales',
    useItems: [
      'Curriculum, inscripcion escolar, examenes, credencial de trabajo, formularios y preparacion para imprimir.',
      'Subida local gratis, recorte, vista previa de fondo y descarga de hoja imprimible sin iniciar sesion.',
      'Los retratos PNG transparentes funcionan mejor para fondo blanco, azul, rojo o gris claro.',
    ],
    sizeTitle: 'Tamanos habituales por pais',
    sizeItems: [
      'Incluye 2 x 2 pulgadas, 35 x 45 mm, 3 x 4 cm, 1 pulgada, 2 pulgadas y otros formatos frecuentes.',
      'La hoja de impresion admite 4 x 6 pulgadas, 5 x 7 pulgadas, A4 y formatos metricos comunes.',
    ],
    printTitle: 'Listo para imprimir varias copias',
    printItems: [
      'Descarga una foto JPG individual o una hoja con varias copias en la misma pagina.',
      'El recorte mantiene proporcion, tamano fisico y margenes para facilitar la impresion.',
    ],
    warningTitle: 'No recomendado para pasaporte o visa oficial',
    warningText: 'Usalo para curriculum, escuela, examenes, credenciales y copias impresas. Para pasaporte, visa o documento oficial, revisa siempre las reglas de la autoridad correspondiente.',
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      {
        question: 'Puedo crear una foto 2 x 2 pulgadas?',
        answer: 'Si. Selecciona el tamano, ajusta el recorte y descarga la imagen individual o la hoja imprimible.',
      },
      {
        question: 'Puedo cambiar el color de fondo?',
        answer: 'Si. Funciona mejor con un retrato PNG transparente; con JPG puedes recortar e imprimir.',
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
    useTitle: 'Geeignet fur alltagliche Ausweisfoto Zwecke',
    useItems: [
      'Lebenslauf, Bewerbung, Schulregistrierung, Prufung, Mitarbeiterausweis und Vorbereitung fur den Ausdruck.',
      'Kostenlos lokal hochladen, zuschneiden, Hintergrund ansehen und Druckbogen ohne Anmeldung herunterladen.',
      'Transparente PNG Portrats eignen sich am besten fur weissen, blauen, roten oder hellgrauen Hintergrund.',
    ],
    sizeTitle: 'Haufige Fotoformate nach Land',
    sizeItems: [
      'Unterstutzt 35 x 45 mm, 3 x 4 cm, 2 x 2 Zoll, 1 Zoll, 2 Zoll und weitere verbreitete Formate.',
      'Druckbogen fur 10 x 15 cm, 13 x 18 cm, A4 und gangige metrische Papierformate.',
    ],
    printTitle: 'Fur kleine Fotodrucke vorbereitet',
    printItems: [
      'Lade ein einzelnes JPG oder einen Druckbogen mit mehreren Kopien herunter.',
      'Layout, Rand, Seitenverhaltnis und physische Grosse bleiben stabil fur zuverlassigeres Drucken.',
    ],
    warningTitle: 'Nicht fur offizielle Pass- oder Visaantrage empfohlen',
    warningText: 'Nutze das Tool fur Lebenslauf, Schule, Prufungen, Ausweise und Ausdrucke. Fur Pass, Visum oder amtliche Dokumente gelten die Vorgaben der jeweiligen Behorde.',
    faqTitle: 'Haufige Fragen',
    faqs: [
      {
        question: 'Kann ich ein 35 x 45 mm Foto erstellen?',
        answer: 'Ja. Wahle das Format, passe den Zuschnitt an und lade ein einzelnes Bild oder einen Druckbogen herunter.',
      },
      {
        question: 'Kann ich die Hintergrundfarbe andern?',
        answer: 'Ja. Das funktioniert am besten mit einem transparenten PNG Portrat; JPG Bilder konnen weiter zugeschnitten und gedruckt werden.',
      },
    ],
  },
  ja: {
    useTitle: '日常用途の証明写真づくりに便利',
    useItems: [
      '履歴書、応募書類、学校登録、試験申込、社員証、印刷用の小さい写真準備に使えます。',
      'ログインなしでローカル画像をアップロードし、トリミング、背景プレビュー、印刷シートの保存ができます。',
      '背景色を白、青、赤、薄いグレーに変えたい場合は、透明PNGの人物画像が最も扱いやすいです。',
    ],
    sizeTitle: '国や地域でよく使われる写真サイズ',
    sizeItems: [
      '2 x 2 inch、35 x 45 mm、3 x 4 cm、1 inch、2 inch など、よく使われるサイズを選べます。',
      '4 x 6 inch、5 x 7 inch、A4、一般的なメートル系用紙に複数枚を並べて保存できます。',
    ],
    printTitle: '小さい写真の印刷に向けたレイアウト',
    printItems: [
      '単体JPG、または1ページに複数枚を並べた印刷シートをダウンロードできます。',
      '比率、余白、物理サイズを保ちやすく、家庭用プリンターや写真店での印刷準備に向いています。',
    ],
    warningTitle: 'パスポート・ビザなど公式提出用には推奨しません',
    warningText: '履歴書、学校、試験、社員証、印刷用途には使えます。パスポート、ビザ、身分証など公的提出写真は、必ず提出先の公式ルールを確認してください。',
    faqTitle: '無料証明写真ツール FAQ',
    faqs: [
      {
        question: '2 inch や 2 x 2 inch の写真を作れますか？',
        answer: 'はい。写真サイズを選び、トリミングを調整して、単体画像または印刷シートを保存できます。',
      },
      {
        question: '背景色を変更できますか？',
        answer: 'はい。透明PNGの人物画像が最適です。通常のJPG画像はトリミングと印刷用途として利用できます。',
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
  const uploadHref = withSource(localePath(locale, '/upload'), `free_id_photo_tool_generate_png_${locale}`)

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

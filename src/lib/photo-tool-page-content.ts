import type { Locale } from '@/lib/i18n'

export type PhotoToolPageId =
  | 'id-photo-crop'
  | 'resize-image'
  | 'resize-image-to-kb'
  | 'remove-background'
  | 'background-color-tool'
  | 'print-layout-builder'
  | 'shape-crop'
  | 'aspect-ratio-crop'

export type PhotoToolActiveId =
  | 'id-photo-crop'
  | 'resize-image'
  | 'resize-kb'
  | 'remove-background'
  | 'background-color'
  | 'print-layout'
  | 'shape-crop'
  | 'aspect-ratio-crop'

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
    title: 'Free ID Photo Crop Tool Online for Passport and Forms',
    h1: 'Free ID Photo Crop Tool Online for Passport, Resume, Exam Photos',
    description:
      'Crop an ID photo online for passport-style images, resumes, exams, badges, and forms, then download a finished JPG.',
    keywords: ['ID photo crop tool', 'crop passport photo online', 'resume photo crop'],
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
    title: 'Free Image Resize Tool Online for JPG, PNG, and Pixels',
    h1: 'Free Image Resize Tool Online to Resize JPG, PNG, and Photo Pixels',
    description:
      'Resize JPG, PNG, or WebP images online by percentage or exact pixels for CV photos, profile uploads, forms, and applications.',
    keywords: ['resize image online', 'resize photo pixels', 'profile uploads'],
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
    title: 'Resize Image to KB Online: Compress Photos for Forms',
    h1: 'Free Resize Image to KB Tool to Compress Photos and Reduce JPG Size',
    description:
      'Resize an image to KB online, compress photos to a target file size, reduce JPG size, and export files for forms.',
    keywords: ['resize image to KB', 'compress photo to KB', 'reduce image file size'],
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
    id: 'remove-background',
    activeId: 'remove-background',
    label: 'Remove background',
    path: '/photo-tools/remove-background',
    title: 'Remove Background Online and Download Transparent PNG',
    h1: 'Remove Background Online for People, Products, and Objects',
    description:
      'Remove background online from people, products, objects, or document photos, then download a transparent PNG after processing.',
    keywords: ['remove background online', 'transparent PNG maker', 'product photo background remover'],
    features: [
      'Remove background from people and portraits',
      'Remove background from products and objects',
      'Download transparent PNG output',
      'One free registered-user run',
      'Credit-based usage after the free run',
    ],
    toolTitle: 'Remove Background',
    toolDescription:
      'Upload an image of a person, product, object, or document-style photo. The tool removes the background and returns a transparent PNG.',
    actionLabel: 'Remove background',
    faqs: [
      {
        question: 'Can I remove the background from a person or product photo?',
        answer: 'Yes. The tool is designed for people, portraits, products, objects, and everyday document-style images.',
      },
      {
        question: 'What file do I download?',
        answer: 'You download a transparent PNG with the background removed.',
      },
      {
        question: 'Is remove background free?',
        answer: 'Registered users get one free remove-background run. After that, each successful PNG export uses one credit.',
      },
      {
        question: 'Does this replace the ID photo background color tool?',
        answer: 'No. Use remove background first when you need a transparent PNG, then use the background color tool if you want to place a white, blue, red, or gray background behind it.',
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
    keywords: ['photo background color tool', 'change ID photo background', 'white background photo'],
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
    keywords: ['photo print layout builder', 'ID photo print sheet', 'print multiple photos on one page'],
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
  {
    id: 'aspect-ratio-crop',
    activeId: 'aspect-ratio-crop',
    label: 'Aspect ratio crop',
    path: '/photo-tools/aspect-ratio-crop',
    title: 'Free Aspect Ratio Crop Tool: Original, 3:2, 2:3, 4:3, 3:4, 9:16',
    h1: 'Free Aspect Ratio Crop Tool for Original, 3:2, 2:3, 4:3, 3:4, and 9:16 Photos',
    description:
      'Crop photos by original ratio or common ratios like 3:2, 2:3, 4:3, 3:4, 9:16, 1:1, 4:5, or 16:9, then export JPG or PNG.',
    keywords: ['aspect ratio crop tool', 'crop photo 3:2', 'crop image 9:16'],
    features: [
      'Crop by original photo ratio',
      'Crop photos to 3:2, 2:3, 4:3, or 3:4',
      'Crop vertical images to 9:16',
      'Drag image position inside the crop frame',
      'Export finished JPG or PNG',
    ],
    faqs: [
      {
        question: 'Can I crop a photo to original ratio, 3:2, 2:3, 4:3, 3:4, or 9:16?',
        answer: 'Yes. Choose the ratio, drag the image inside the preview frame, and export the cropped result.',
      },
      {
        question: 'Can I move the photo inside the crop box?',
        answer: 'Yes. After uploading, drag the image in the preview to adjust what stays inside the crop frame.',
      },
      {
        question: 'Does this aspect ratio crop tool upload my image?',
        answer: 'No. The crop is handled locally in your browser, so the selected image stays on your device.',
      },
      {
        question: 'Should I export JPG or PNG?',
        answer: 'Use JPG for most profile, website, and social photos. Use PNG when you need a lossless output or want to keep transparency from a PNG source.',
      },
    ],
  },
  {
    id: 'shape-crop',
    activeId: 'shape-crop',
    label: 'Shape crop',
    path: '/photo-tools/shape-crop',
    title: 'Free Shape Crop Photo Tool: Circle, Heart, Rounded Avatar, PNG',
    h1: 'Free Shape Crop Photo Tool for Circle, Heart, and Rounded Images',
    description:
      'Crop photos into a circle, heart, square, rounded square, or rounded rectangle online, then download a transparent PNG.',
    keywords: ['shape crop photo', 'heart crop image', 'circle crop image'],
    features: [
      'Circle crop photos for avatars',
      'Heart crop images for social graphics',
      'Create rounded square profile images',
      'Crop images into square or rounded rectangle',
      'Download transparent PNG output',
      'Browser-based local image processing',
    ],
    faqs: [
      {
        question: 'Can I crop a photo into a circle online?',
        answer: 'Yes. Upload a JPG, PNG, or WebP image, choose Circle, and export the result as a transparent PNG.',
      },
      {
        question: 'Can I make a rounded avatar or app icon?',
        answer: 'Yes. Choose rounded square or rounded rectangle, then download a PNG with transparent corners.',
      },
      {
        question: 'Does the shape crop tool upload my image?',
        answer: 'No. The crop runs locally in your browser, so the selected image stays on your device.',
      },
      {
        question: 'Which format should I download?',
        answer: 'Use PNG when you need transparent corners, a circle avatar, or a heart-shaped crop.',
      },
    ],
  },
]

type PhotoToolPageTranslation = Omit<PhotoToolPageContent, 'id' | 'activeId' | 'path'>

const localizedPhotoToolPages: Partial<Record<Locale, Partial<Record<PhotoToolPageId, PhotoToolPageTranslation>>>> = {
  es: {
    'id-photo-crop': {
      label: 'Recortar foto ID',
      title: 'Herramienta gratis para recortar fotos ID, pasaporte y CV',
      h1: 'Recorta fotos ID para pasaporte, CV, exámenes y perfiles',
      description:
        'Sube una imagen JPG, PNG o WebP, elige un tamaño de foto ID, ajusta el encuadre y descarga un JPG listo para formularios, CV, exámenes o perfiles.',
      keywords: ['recortar foto ID', 'recortar foto pasaporte online', 'foto para CV', 'foto para exámenes'],
      features: ['Recorte para fotos ID', 'Tamaños comunes para documentos', 'Ajuste de zoom y posición', 'Procesamiento local en el navegador', 'Descarga en JPG'],
      faqs: [
        { question: '¿Sirve para recortar una foto ID online?', answer: 'Sí. Puedes cargar una imagen local y convertirla en una foto con tamaño y encuadre de documento.' },
        { question: '¿La imagen se sube al servidor?', answer: 'No. El recorte se procesa en tu navegador.' },
        { question: '¿Puedo usarla para CV, exámenes o tarjetas?', answer: 'Sí. Los tamaños son útiles para CV, portales escolares, registros de exámenes y credenciales internas.' },
        { question: '¿Es válida para pasaporte oficial?', answer: 'Úsala para preparar una foto de estilo documento. Para trámites oficiales, revisa siempre las normas de la autoridad correspondiente.' },
      ],
    },
    'resize-image': {
      label: 'Redimensionar imagen',
      title: 'Redimensionar imagen online gratis para CV y formularios',
      h1: 'Redimensiona imágenes JPG, PNG y WebP online',
      description:
        'Redimensiona una imagen online por porcentaje o pixeles exactos para CV, perfiles, formularios, portales y fotos de documento.',
      keywords: ['redimensionar imagen online', 'cambiar tamano imagen', 'redimensionar JPG'],
      features: ['Redimensiona por porcentaje', 'Define píxeles exactos', 'Compatible con JPG, PNG y WebP', 'Útil para formularios y perfiles', 'Procesamiento local'],
      faqs: [
        { question: '¿Puedo redimensionar por porcentaje?', answer: 'Sí. Usa el modo proporcional y ajusta el porcentaje.' },
        { question: '¿Puedo definir ancho y alto exactos?', answer: 'Sí. Usa el modo de tamaño exacto e introduce los píxeles necesarios.' },
        { question: '¿Funciona con JPG y PNG?', answer: 'Sí. Acepta JPG, PNG y WebP.' },
        { question: '¿Sirve para formularios online?', answer: 'Sí. Está pensada para perfiles, portales escolares, solicitudes y cargas de fotos de documento.' },
      ],
    },
    'resize-image-to-kb': {
      label: 'Imagen a KB',
      title: 'Comprimir imagen a KB gratis: reducir JPG para formularios',
      h1: 'Comprime una imagen a un tamaño objetivo en KB',
      description:
        'Reduce una foto a un límite de KB, por ejemplo 200 KB, y exporta JPG o WebP para formularios, perfiles, portales escolares y solicitudes.',
      keywords: ['comprimir imagen a KB', 'reducir JPG a 200KB', 'reducir tamaño de foto'],
      features: ['Objetivo en KB', 'Compresión local', 'Exporta JPG o WebP', 'Útil para formularios', 'Reduce tamaño de archivo'],
      toolTitle: 'Imagen a KB',
      toolDescription:
        'Comprime una imagen JPG, PNG o WebP a un tamaño objetivo en KB para formularios, portales escolares, perfiles y solicitudes. El procesamiento ocurre en tu navegador.',
      actionLabel: 'Comprimir imagen',
      faqs: [
        { question: '¿Puedo reducir una imagen para un formulario?', answer: 'Sí. Define el objetivo en KB y la herramienta intentará dejar el archivo por debajo de ese límite.' },
        { question: '¿Necesito subir la imagen?', answer: 'No. La compresión se ejecuta localmente en el navegador.' },
        { question: '¿Puedo reducir un JPG a 200 KB?', answer: 'Sí. Selecciona 200 KB como objetivo y exporta el resultado.' },
        { question: '¿Por qué el resultado puede quedar por debajo del objetivo?', answer: 'La herramienta equilibra dimensiones y calidad; a veces un archivo menor da un resultado más limpio.' },
      ],
    },
    'remove-background': {
      label: 'Remove background',
      title: 'Quitar fondo online y descargar PNG transparente',
      h1: 'Remove Background para personas, productos y objetos',
      description:
        'Quita el fondo de una foto online para personas, productos u objetos y descarga un PNG transparente listo para usar.',
      keywords: ['quitar fondo online', 'PNG transparente', 'remove background'],
      features: ['Personas y retratos', 'Productos y objetos', 'Descarga PNG transparente', '1 uso gratis con cuenta', 'Uso con créditos después'],
      toolTitle: 'Remove Background',
      toolDescription: 'Sube una imagen de persona, producto u objeto. La herramienta elimina el fondo y entrega un PNG transparente.',
      actionLabel: 'Remove background',
      faqs: [
        { question: '¿Funciona con personas y productos?', answer: 'Sí. Está pensada para retratos, productos, objetos y fotos de estilo documento.' },
        { question: '¿Qué archivo descargo?', answer: 'Descargas un PNG transparente con el fondo eliminado.' },
        { question: '¿Es gratis?', answer: 'Cada usuario registrado tiene 1 uso gratis. Después, cada exportación correcta usa 1 crédito.' },
        { question: '¿El recorte siempre queda perfecto?', answer: 'En imágenes complejas puede requerir ajuste adicional, especialmente con cabello, sombras, fondos cargados, objetos transparentes o baja resolución.' },
      ],
    },
    'background-color-tool': {
      label: 'Color de fondo',
      title: 'Cambiar fondo de foto ID: blanco, azul o rojo',
      h1: 'Cambia el fondo de una foto ID a blanco, azul o rojo',
      description:
        'Sube un PNG transparente, elige tamaño de foto y cambia el fondo a blanco, azul, rojo o gris claro. Después descarga un JPG terminado.',
      keywords: ['cambiar fondo foto ID', 'foto fondo blanco', 'foto fondo azul', 'foto fondo rojo'],
      features: ['Fondo blanco', 'Fondo azul', 'Fondo rojo', 'Tamaños de foto ID', 'Descarga JPG'],
      faqs: [
        { question: '¿Necesito un PNG transparente?', answer: 'Sí. Esta herramienta coloca un color limpio detrás del sujeto, por eso funciona mejor con PNG transparente.' },
        { question: '¿Puedo usar fondo blanco, azul o rojo?', answer: 'Sí. Incluye blanco, azul, rojo y gris claro.' },
        { question: '¿Puedo elegir tamaño de foto?', answer: 'Sí. Puedes elegir tamaños comunes de foto ID antes de descargar.' },
        { question: '¿Qué formato se descarga?', answer: 'Se descarga un JPG con el tamaño y el fondo seleccionados.' },
      ],
    },
    'print-layout-builder': {
      label: 'Hoja de impresión',
      title: 'Crear hoja de impresión para fotos ID: 4x6, A4 y Letter',
      h1: 'Crea hojas de impresión para fotos ID',
      description:
        'Sube una foto terminada, elige tamaño de foto y papel, genera varias copias en una hoja y descarga un JPG listo para imprimir.',
      keywords: ['hoja impresión foto ID', 'imprimir varias fotos', 'layout 4x6 foto', 'A4 fotos ID'],
      features: ['Varias copias por hoja', 'Tamaños 4x6, 5x7, A4 y Letter', 'Foto ajustada al tamaño elegido', 'Vista previa', 'Descarga JPG'],
      faqs: [
        { question: '¿Puedo crear varias fotos en una hoja?', answer: 'Sí. La herramienta repite la foto según el tamaño elegido y el papel disponible.' },
        { question: '¿Incluye 4x6 y A4?', answer: 'Sí. Incluye tamaños comunes como 4 x 6, 5 x 7, A4 y Letter.' },
        { question: '¿Recorta la foto?', answer: 'Ajusta la foto al tamaño elegido. Para controlar la cara con precisión, usa primero Recortar foto ID.' },
        { question: '¿Qué formato se descarga?', answer: 'Descargas un JPG listo para imprimir en casa o en una tienda.' },
      ],
    },
  },
  fr: {
    'id-photo-crop': {
      label: 'Recadrer photo ID',
      title: 'Outil gratuit pour recadrer une photo ID, passeport ou CV',
      h1: 'Recadrez une photo ID pour passeport, CV, examens et profils',
      description:
        'Importez une image JPG, PNG ou WebP, choisissez un format de photo ID, ajustez le cadrage et téléchargez un JPG prêt pour formulaires, CV, examens ou profils.',
      keywords: ['recadrer photo ID', 'photo passeport en ligne', 'photo CV', 'photo examen'],
      features: ['Recadrage photo ID', 'Formats courants de documents', 'Zoom et position', 'Traitement local dans le navigateur', 'Téléchargement JPG'],
      faqs: [
        { question: 'Puis-je recadrer une photo ID en ligne ?', answer: 'Oui. Chargez une image locale et préparez une photo au format document.' },
        { question: 'La photo est-elle envoyée au serveur ?', answer: 'Non. Le recadrage se fait dans votre navigateur.' },
        { question: 'Est-ce utile pour CV, examens ou badges ?', answer: 'Oui. Les formats conviennent aux CV, portails scolaires, inscriptions d’examen et badges internes.' },
        { question: 'Puis-je l’utiliser pour une demande officielle ?', answer: 'Utilisez-le pour préparer une photo de style document. Pour passeports et visas, suivez les règles officielles.' },
      ],
    },
    'resize-image': {
      label: 'Redimensionner image',
      title: 'Redimensionner une image en ligne : JPG, PNG et WebP',
      h1: 'Redimensionnez des images JPG, PNG et WebP en ligne',
      description:
        'Changez la taille d’une image par pourcentage ou dimensions exactes pour profils, formulaires, portails scolaires, candidatures et photos de document.',
      keywords: ['redimensionner image', 'changer dimensions image', 'redimensionner JPG', 'redimensionner PNG'],
      features: ['Redimensionnement par pourcentage', 'Dimensions exactes', 'JPG, PNG et WebP', 'Pour formulaires et profils', 'Traitement local'],
      faqs: [
        { question: 'Puis-je redimensionner par pourcentage ?', answer: 'Oui. Choisissez le mode proportionnel et ajustez le curseur.' },
        { question: 'Puis-je définir des pixels exacts ?', answer: 'Oui. Choisissez le mode dimensions exactes.' },
        { question: 'Les fichiers JPG et PNG sont-ils pris en charge ?', answer: 'Oui. L’outil accepte JPG, PNG et WebP.' },
        { question: 'Est-ce adapté aux formulaires en ligne ?', answer: 'Oui. Il est conçu pour profils, portails scolaires, candidatures et photos de document.' },
      ],
    },
    'resize-image-to-kb': {
      label: 'Image en KB',
      title: 'Compresser une image en KB : réduire JPG pour formulaires',
      h1: 'Compressez une image vers une taille cible en KB',
      description:
        'Réduisez une photo à une limite en KB, par exemple 200 KB, puis exportez en JPG ou WebP pour formulaires, profils, portails scolaires et candidatures.',
      keywords: ['compresser image en KB', 'réduire JPG 200KB', 'réduire taille photo'],
      features: ['Taille cible en KB', 'Compression locale', 'Export JPG ou WebP', 'Pour formulaires', 'Réduction du poids'],
      toolTitle: 'Image en KB',
      toolDescription:
        'Compressez une image JPG, PNG ou WebP vers une taille cible en KB pour formulaires, portails scolaires, profils et candidatures. Le traitement reste dans le navigateur.',
      actionLabel: 'Compresser l’image',
      faqs: [
        { question: 'Puis-je réduire une image pour un formulaire ?', answer: 'Oui. Définissez la limite en KB et l’outil essaie de rester sous cette taille.' },
        { question: 'L’image est-elle envoyée ?', answer: 'Non. La compression se fait localement.' },
        { question: 'Puis-je réduire un JPG à 200 KB ?', answer: 'Oui. Choisissez 200 KB comme cible.' },
        { question: 'Pourquoi le fichier final peut-il être plus petit ?', answer: 'L’outil équilibre dimensions et qualité; un fichier plus petit peut donner un meilleur résultat.' },
      ],
    },
    'remove-background': {
      label: 'Remove background',
      title: 'Remove Background en ligne : PNG transparent pour personnes et produits',
      h1: 'Remove Background pour personnes, produits et objets',
      description:
        'Importez une image de personne, produit ou objet, retirez l’arrière-plan en ligne et téléchargez un PNG transparent. Chaque compte a 1 essai gratuit; ensuite 1 crédit par export réussi.',
      keywords: ['remove background', 'PNG transparent', 'retirer fond produit', 'retirer fond portrait'],
      features: ['Portraits et personnes', 'Produits et objets', 'PNG transparent', '1 essai gratuit avec compte', 'Crédits ensuite'],
      toolTitle: 'Remove Background',
      toolDescription: 'Importez une personne, un produit ou un objet. L’outil retire l’arrière-plan et produit un PNG transparent.',
      actionLabel: 'Remove background',
      faqs: [
        { question: 'Fonctionne-t-il avec personnes et produits ?', answer: 'Oui. Il couvre portraits, produits, objets et images de style document.' },
        { question: 'Quel fichier est téléchargé ?', answer: 'Un PNG transparent avec l’arrière-plan retiré.' },
        { question: 'Est-ce gratuit ?', answer: 'Chaque utilisateur inscrit dispose d’un essai gratuit. Ensuite chaque export réussi utilise 1 crédit.' },
        { question: 'Le détourage est-il toujours parfait ?', answer: 'Les images complexes peuvent demander un ajustement supplémentaire, notamment cheveux, ombres, fonds chargés, objets transparents ou basse résolution.' },
      ],
    },
    'background-color-tool': {
      label: 'Couleur de fond',
      title: 'Changer le fond d’une photo ID : blanc, bleu ou rouge',
      h1: 'Changez le fond d’une photo ID en blanc, bleu ou rouge',
      description:
        'Importez un PNG transparent, choisissez un format de photo et appliquez un fond blanc, bleu, rouge ou gris clair, puis téléchargez un JPG final.',
      keywords: ['changer fond photo ID', 'photo fond blanc', 'photo fond bleu', 'photo fond rouge'],
      features: ['Fond blanc', 'Fond bleu', 'Fond rouge', 'Formats photo ID', 'Export JPG'],
      faqs: [
        { question: 'Faut-il un PNG transparent ?', answer: 'Oui. L’outil place une couleur nette derrière le sujet.' },
        { question: 'Puis-je choisir blanc, bleu ou rouge ?', answer: 'Oui. Les options incluent blanc, bleu, rouge et gris clair.' },
        { question: 'Puis-je choisir la taille de photo ?', answer: 'Oui. Sélectionnez un format ID avant téléchargement.' },
        { question: 'Quel format est exporté ?', answer: 'Un JPG avec la taille et la couleur de fond choisies.' },
      ],
    },
    'print-layout-builder': {
      label: 'Planche photo',
      title: 'Créer une planche photo ID : 4x6, A4 et Letter',
      h1: 'Créez une planche d’impression pour photos ID',
      description:
        'Importez une photo finalisée, choisissez format photo et papier, générez plusieurs copies sur une page et téléchargez un JPG prêt à imprimer.',
      keywords: ['planche photo ID', 'imprimer plusieurs photos', 'photo 4x6', 'photos ID A4'],
      features: ['Plusieurs copies par page', 'Formats 4x6, 5x7, A4 et Letter', 'Photo adaptée au format choisi', 'Aperçu', 'Téléchargement JPG'],
      faqs: [
        { question: 'Puis-je mettre plusieurs photos sur une page ?', answer: 'Oui. L’outil répète la photo selon le format et le papier.' },
        { question: 'Les formats 4x6 et A4 sont-ils inclus ?', answer: 'Oui. 4 x 6, 5 x 7, A4 et Letter sont disponibles.' },
        { question: 'L’outil recadre-t-il la photo ?', answer: 'Il l’adapte au format choisi. Pour un placement précis du visage, utilisez d’abord Recadrer photo ID.' },
        { question: 'Quel format est téléchargé ?', answer: 'Un JPG prêt pour impression à domicile ou en boutique.' },
      ],
    },
  },
  de: {
    'id-photo-crop': {
      label: 'ID-Foto zuschneiden',
      title: 'Kostenloses Tool zum Zuschneiden von ID-Fotos, Passbildern und Bewerbungsfotos',
      h1: 'ID-Fotos fuer Pass, Bewerbung, Pruefung und Profile zuschneiden',
      description:
        'Lade ein JPG, PNG oder WebP hoch, waehle eine ID-Fotogroesse, passe den Ausschnitt an und lade ein fertiges JPG fuer Formulare, Bewerbungen, Pruefungen oder Profile herunter.',
      keywords: ['ID-Foto zuschneiden', 'Passfoto online zuschneiden', 'Bewerbungsfoto zuschneiden', 'Pruefungsfoto'],
      features: ['ID-Foto-Zuschnitt', 'Gaengige Dokumentformate', 'Zoom und Position', 'Lokale Verarbeitung im Browser', 'JPG-Download'],
      faqs: [
        { question: 'Kann ich ein ID-Foto online zuschneiden?', answer: 'Ja. Du kannst ein lokales Bild laden und als Dokumentfoto vorbereiten.' },
        { question: 'Wird das Bild hochgeladen?', answer: 'Nein. Der Zuschnitt laeuft im Browser.' },
        { question: 'Eignet es sich fuer Bewerbung, Pruefung oder Ausweis?', answer: 'Ja. Die Formate passen fuer Bewerbungen, Schulportale, Pruefungsanmeldungen und interne Ausweise.' },
        { question: 'Ist es fuer amtliche Paesse geeignet?', answer: 'Nutze es zur Vorbereitung. Fuer amtliche Dokumente gelten immer die Vorgaben der jeweiligen Behoerde.' },
      ],
    },
    'resize-image': {
      label: 'Bild skalieren',
      title: 'Bild online skalieren: JPG, PNG und WebP',
      h1: 'JPG-, PNG- und WebP-Bilder online skalieren',
      description:
        'Aendere Bildgroessen per Prozentwert oder exakten Pixelmassen fuer Profile, Formulare, Schulportale, Bewerbungen und Dokumentfotos.',
      keywords: ['Bild skalieren online', 'Bildgroesse aendern', 'JPG skalieren', 'PNG skalieren'],
      features: ['Skalierung per Prozent', 'Exakte Pixelmasse', 'JPG, PNG und WebP', 'Fuer Formulare und Profile', 'Lokale Verarbeitung'],
      faqs: [
        { question: 'Kann ich per Prozent skalieren?', answer: 'Ja. Waehle den proportionalen Modus und stelle den Prozentwert ein.' },
        { question: 'Kann ich genaue Pixelmasse eingeben?', answer: 'Ja. Nutze den Modus fuer exakte Groesse.' },
        { question: 'Werden JPG und PNG unterstuetzt?', answer: 'Ja. Das Tool akzeptiert JPG, PNG und WebP.' },
        { question: 'Eignet es sich fuer Online-Formulare?', answer: 'Ja. Es ist fuer Profile, Schulportale, Bewerbungen und Dokumentfoto-Uploads gedacht.' },
      ],
    },
    'resize-image-to-kb': {
      label: 'Bild auf KB',
      title: 'Bild auf KB komprimieren: JPG fuer Formulare verkleinern',
      h1: 'Bild auf eine Zielgroesse in KB komprimieren',
      description:
        'Reduziere ein Foto auf eine KB-Grenze, zum Beispiel 200 KB, und exportiere JPG oder WebP fuer Formulare, Profile, Schulportale und Bewerbungen.',
      keywords: ['Bild auf KB komprimieren', 'JPG auf 200KB verkleinern', 'Fotodatei verkleinern'],
      features: ['KB-Zielgroesse', 'Lokale Komprimierung', 'JPG- oder WebP-Export', 'Fuer Formulare', 'Dateigroesse reduzieren'],
      toolTitle: 'Bild auf KB',
      toolDescription:
        'Komprimiere JPG, PNG oder WebP auf eine Zielgroesse in KB fuer Formulare, Schulportale, Profile und Bewerbungen. Die Verarbeitung bleibt im Browser.',
      actionLabel: 'Bild komprimieren',
      faqs: [
        { question: 'Kann ich ein Bild fuer ein Formular verkleinern?', answer: 'Ja. Lege die Zielgroesse in KB fest und das Tool versucht, darunter zu bleiben.' },
        { question: 'Wird mein Bild hochgeladen?', answer: 'Nein. Die Komprimierung laeuft lokal im Browser.' },
        { question: 'Kann ich ein JPG auf 200 KB reduzieren?', answer: 'Ja. Setze 200 KB als Ziel.' },
        { question: 'Warum ist die Datei manchmal kleiner als das Ziel?', answer: 'Das Tool balanciert Masse und Qualitaet; ein kleineres Ergebnis kann sauberer sein.' },
      ],
    },
    'remove-background': {
      label: 'Remove background',
      title: 'Remove Background online: transparentes PNG fuer Personen und Produkte',
      h1: 'Remove Background fuer Personen, Produkte und Objekte',
      description:
        'Lade ein Bild von Person, Produkt oder Objekt hoch, entferne den Hintergrund online und lade ein transparentes PNG herunter. Registrierte Nutzer erhalten 1 kostenlosen Lauf; danach kostet jeder erfolgreiche Export 1 Credit.',
      keywords: ['remove background online', 'transparentes PNG', 'Produkthintergrund entfernen', 'Person Hintergrund entfernen'],
      features: ['Personen und Portraets', 'Produkte und Objekte', 'Transparentes PNG', '1 kostenloser Lauf mit Konto', 'Danach Credit-Nutzung'],
      toolTitle: 'Remove Background',
      toolDescription: 'Lade eine Person, ein Produkt oder Objekt hoch. Das Tool entfernt den Hintergrund und liefert ein transparentes PNG.',
      actionLabel: 'Remove background',
      faqs: [
        { question: 'Funktioniert es fuer Personen und Produkte?', answer: 'Ja. Es ist fuer Portraets, Produkte, Objekte und dokumentaehnliche Bilder gedacht.' },
        { question: 'Welche Datei lade ich herunter?', answer: 'Ein transparentes PNG mit entferntem Hintergrund.' },
        { question: 'Ist es kostenlos?', answer: 'Registrierte Nutzer haben 1 kostenlosen Lauf. Danach nutzt jeder erfolgreiche PNG-Export 1 Credit.' },
        { question: 'Ist das Freistellen immer perfekt?', answer: 'Komplexe Bilder koennen Nacharbeit brauchen, etwa Haare, Schatten, unruhige Hintergruende, transparente Objekte oder niedrige Aufloesung.' },
      ],
    },
    'background-color-tool': {
      label: 'Hintergrundfarbe',
      title: 'ID-Foto-Hintergrund aendern: weiss, blau oder rot',
      h1: 'ID-Foto-Hintergrund auf weiss, blau oder rot aendern',
      description:
        'Lade ein transparentes PNG hoch, waehle Fotogroesse und Hintergrundfarbe, und lade ein fertiges JPG mit weissem, blauem, rotem oder hellgrauem Hintergrund herunter.',
      keywords: ['ID-Foto Hintergrund aendern', 'Foto weisser Hintergrund', 'blauer Hintergrund ID-Foto', 'roter Hintergrund Foto'],
      features: ['Weisser Hintergrund', 'Blauer Hintergrund', 'Roter Hintergrund', 'ID-Fotogroessen', 'JPG-Export'],
      faqs: [
        { question: 'Brauche ich ein transparentes PNG?', answer: 'Ja. Das Tool legt eine saubere Farbe hinter das Motiv.' },
        { question: 'Kann ich weiss, blau oder rot waehlen?', answer: 'Ja. Verfuegbar sind weiss, blau, rot und hellgrau.' },
        { question: 'Kann ich die Fotogroesse waehlen?', answer: 'Ja. Waehle eine gaengige ID-Fotogroesse vor dem Download.' },
        { question: 'Welches Format wird heruntergeladen?', answer: 'Ein JPG mit gewaehlter Groesse und Hintergrundfarbe.' },
      ],
    },
    'print-layout-builder': {
      label: 'Druckbogen',
      title: 'ID-Foto-Druckbogen erstellen: 4x6, A4 und Letter',
      h1: 'Druckbogen fuer ID-Fotos erstellen',
      description:
        'Lade ein fertiges Foto hoch, waehle Foto- und Papiergroesse, erstelle mehrere Kopien auf einer Seite und lade ein druckfertiges JPG herunter.',
      keywords: ['ID-Foto Druckbogen', 'mehrere Fotos drucken', '4x6 Fotolayout', 'A4 ID-Fotos'],
      features: ['Mehrere Kopien pro Seite', '4x6, 5x7, A4 und Letter', 'Foto wird auf Zielgroesse vorbereitet', 'Vorschau', 'JPG-Download'],
      faqs: [
        { question: 'Kann ich mehrere Fotos auf eine Seite setzen?', answer: 'Ja. Das Tool wiederholt das Foto passend zu Format und Papier.' },
        { question: 'Sind 4x6 und A4 enthalten?', answer: 'Ja. 4 x 6, 5 x 7, A4 und Letter sind enthalten.' },
        { question: 'Schneidet das Tool das Foto zu?', answer: 'Es passt das Foto in die gewaehlte Groesse ein. Fuer genaue Kopfposition nutze zuerst ID-Foto zuschneiden.' },
        { question: 'Welches Format wird heruntergeladen?', answer: 'Ein JPG fuer Heimdruck oder Fotoladen.' },
      ],
    },
  },
  ja: {
    'id-photo-crop': {
      label: 'ID写真トリミング',
      title: 'ID写真、パスポート、履歴書用の無料トリミングツール',
      h1: 'ID写真、履歴書、試験、プロフィール用に写真を整える',
      description:
        'JPG、PNG、WebP画像をアップロードし、ID写真サイズを選び、位置を調整して、フォームや履歴書、試験登録、プロフィール用のJPGをダウンロードできます。',
      keywords: ['ID写真 トリミング', 'パスポート写真 オンライン', '履歴書写真', '試験用写真'],
      features: ['ID写真向けトリミング', 'よく使う証明写真サイズ', 'ズームと位置調整', 'ブラウザ内で処理', 'JPGで保存'],
      faqs: [
        { question: 'オンラインでID写真を切り抜けますか？', answer: 'はい。手元の画像を読み込み、証明写真向けのサイズと構図に整えられます。' },
        { question: '画像はサーバーに送信されますか？', answer: 'いいえ。このトリミング処理はブラウザ内で行われます。' },
        { question: '履歴書や試験登録にも使えますか？', answer: 'はい。履歴書、学校ポータル、試験登録、社員証や学生証などに使いやすい設定です。' },
        { question: '公式パスポート申請に使えますか？', answer: '書類用写真の準備には使えますが、公式申請では必ず提出先の規定を確認してください。' },
      ],
    },
    'resize-image': {
      label: '画像サイズ変更',
      title: '画像サイズ変更オンライン：JPG、PNG、WebP対応',
      h1: 'JPG、PNG、WebP画像のサイズをオンラインで変更',
      description:
        '比率指定またはピクセル指定で画像サイズを変更し、プロフィール、フォーム、学校ポータル、求人応募、書類用写真に合わせられます。',
      keywords: ['画像サイズ変更', '画像 ピクセル 変更', 'JPG サイズ変更', 'PNG サイズ変更'],
      features: ['比率でサイズ変更', '正確なピクセル指定', 'JPG、PNG、WebP対応', 'フォームやプロフィール向け', 'ブラウザ内処理'],
      faqs: [
        { question: '比率でサイズ変更できますか？', answer: 'はい。比例モードでパーセントを調整できます。' },
        { question: 'ピクセル数を指定できますか？', answer: 'はい。正確なサイズモードで幅と高さを指定できます。' },
        { question: 'JPGやPNGに対応していますか？', answer: 'はい。JPG、PNG、WebPに対応しています。' },
        { question: 'オンラインフォーム用に使えますか？', answer: 'はい。プロフィール、学校ポータル、応募フォーム、書類用写真アップロード向けです。' },
      ],
    },
    'resize-image-to-kb': {
      label: '画像をKB指定',
      title: '画像をKB指定で圧縮：フォーム用JPGを軽量化',
      h1: '画像を目標KBサイズに圧縮',
      description:
        '写真を200KBなどの上限に合わせて圧縮し、フォーム、プロフィール、学校ポータル、応募用にJPGまたはWebPで書き出せます。',
      keywords: ['画像 KB 圧縮', 'JPG 200KB', '写真ファイル 軽量化'],
      features: ['KB目標サイズ', 'ローカル圧縮', 'JPGまたはWebP出力', 'フォーム向け', 'ファイルサイズ削減'],
      toolTitle: '画像をKB指定',
      toolDescription:
        'JPG、PNG、WebP画像をフォーム、学校ポータル、プロフィール、応募用の目標KBサイズに圧縮します。処理はブラウザ内で行われます。',
      actionLabel: '画像を圧縮',
      faqs: [
        { question: 'フォーム用に画像を小さくできますか？', answer: 'はい。目標KBを設定すると、そのサイズ以下に近づけて出力します。' },
        { question: '画像はアップロードされますか？', answer: 'いいえ。圧縮はブラウザ内で行われます。' },
        { question: 'JPGを200KBにできますか？', answer: 'はい。目標を200KBに設定して出力できます。' },
        { question: 'なぜ目標より小さいファイルになりますか？', answer: '画質とサイズのバランスを取るため、よりきれいな結果として目標より小さくなる場合があります。' },
      ],
    },
    'remove-background': {
      label: 'Remove background',
      title: 'Remove Background：人物、商品、物体を透明PNGに',
      h1: '人物、商品、物体の背景を削除',
      description:
        '人物、商品、物体の画像をアップロードし、背景を削除して透明PNGをダウンロードできます。登録ユーザーは1回無料、その後は成功した出力ごとに1クレジットを使用します。',
      keywords: ['remove background', '透明PNG', '商品 背景削除', '人物 背景削除'],
      features: ['人物とポートレート', '商品と物体', '透明PNGを保存', '登録ユーザーは1回無料', '以降はクレジット利用'],
      toolTitle: 'Remove Background',
      toolDescription: '人物、商品、物体の画像をアップロードすると、背景を削除して透明PNGを生成します。',
      actionLabel: 'Remove background',
      faqs: [
        { question: '人物や商品に使えますか？', answer: 'はい。人物、ポートレート、商品、物体、書類用写真風の画像に使えます。' },
        { question: 'どの形式で保存できますか？', answer: '背景を削除した透明PNGを保存できます。' },
        { question: '無料で使えますか？', answer: '登録ユーザーは1回無料です。その後、成功したPNG出力ごとに1クレジットを使用します。' },
        { question: '切り抜きは常に完璧ですか？', answer: '髪、影、複雑な背景、透明な物体、低解像度画像では追加調整が必要になる場合があります。' },
      ],
    },
    'background-color-tool': {
      label: '背景色ツール',
      title: 'ID写真の背景色を白、青、赤に変更',
      h1: 'ID写真の背景を白、青、赤に変更',
      description:
        '透明PNGをアップロードし、写真サイズを選び、背景を白、青、赤、ライトグレーに変更して、完成したJPGを保存できます。',
      keywords: ['ID写真 背景色', '白背景 写真', '青背景 証明写真', '赤背景 写真'],
      features: ['白背景', '青背景', '赤背景', 'ID写真サイズ', 'JPG出力'],
      faqs: [
        { question: '透明PNGが必要ですか？', answer: 'はい。被写体の後ろにきれいな背景色を配置するため、透明PNG向けのツールです。' },
        { question: '白、青、赤を選べますか？', answer: 'はい。白、青、赤、ライトグレーを選べます。' },
        { question: '写真サイズを選べますか？', answer: 'はい。保存前によく使うID写真サイズを選択できます。' },
        { question: '保存形式は何ですか？', answer: '選択したサイズと背景色のJPGを保存します。' },
      ],
    },
    'print-layout-builder': {
      label: '印刷レイアウト',
      title: 'ID写真の印刷シート作成：4x6、A4、Letter',
      h1: 'ID写真の印刷シートを作成',
      description:
        '完成した写真をアップロードし、写真サイズと用紙サイズを選び、1枚に複数枚配置した印刷用JPGを作成できます。',
      keywords: ['ID写真 印刷シート', '写真 複数 印刷', '4x6 写真 レイアウト', 'A4 証明写真'],
      features: ['1枚に複数コピー', '4x6、5x7、A4、Letter対応', '選択サイズに合わせて配置', 'プレビュー', 'JPG保存'],
      faqs: [
        { question: '1枚に複数の写真を配置できますか？', answer: 'はい。選択した写真サイズと用紙サイズに合わせて自動配置します。' },
        { question: '4x6やA4に対応していますか？', answer: 'はい。4 x 6、5 x 7、A4、Letterを選べます。' },
        { question: '写真をトリミングしますか？', answer: '選択した写真サイズに合わせて配置します。顔位置を正確にしたい場合は、先にID写真トリミングを使ってください。' },
        { question: '保存形式は何ですか？', answer: '自宅や店舗で印刷しやすいJPGを保存します。' },
      ],
    },
  },
}

Object.assign(localizedPhotoToolPages, {
  es: {
    ...localizedPhotoToolPages.es,
    'shape-crop': {
      label: 'Recorte por forma',
      title: 'Recortar foto en circulo, corazon, avatar redondeado y PNG transparente',
      h1: 'Recorta fotos por forma para avatar, perfil e iconos',
      description:
        'Recorta fotos en circulo, corazon, cuadrado o esquinas redondeadas y descarga PNG transparente.',
      keywords: ['recortar foto en circulo', 'recortar imagen corazon', 'recorte por forma'],
      features: ['Recorte circular', 'Recorte en corazon', 'Avatar cuadrado redondeado', 'PNG transparente', 'Procesamiento local'],
      faqs: [
        { question: 'Puedo recortar una foto en circulo?', answer: 'Si. Sube una imagen, elige Circulo y exporta un PNG transparente.' },
        { question: 'Sirve para avatar o perfil?', answer: 'Si. Puedes crear imagen circular, cuadrada o con esquinas redondeadas para perfiles, credenciales e iconos.' },
        { question: 'La imagen se sube al servidor?', answer: 'No. El recorte se procesa localmente en tu navegador.' },
        { question: 'Que formato conviene descargar?', answer: 'Usa PNG si necesitas transparencia, esquinas limpias o un recorte en corazon.' },
      ],
    },
    'aspect-ratio-crop': {
      label: 'Recorte por proporcion',
      title: 'Recortar foto por proporcion: original, 3:2, 2:3, 4:3, 3:4 y 9:16',
      h1: 'Recorta fotos por proporcion comun para perfil, web y redes',
      description:
        'Recorta fotos en proporcion original, 3:2, 2:3, 4:3, 3:4 o 9:16, mueve la imagen en el marco y exporta JPG o PNG.',
      keywords: ['recortar foto proporcion', 'recortar foto 3:2', 'recortar imagen 9:16'],
      features: ['Proporcion original', 'Formatos 3:2 y 2:3', 'Formatos 4:3 y 3:4', 'Formato 9:16', 'Arrastrar dentro del marco'],
      faqs: [
        { question: 'Puedo recortar una foto a proporcion original o 3:2?', answer: 'Si. Elige la proporcion, mueve la imagen en el marco y exporta el resultado.' },
        { question: 'Puedo arrastrar la imagen dentro del recorte?', answer: 'Si. La vista previa permite ajustar la posicion antes de descargar.' },
        { question: 'La imagen se sube al servidor?', answer: 'No. El recorte se procesa localmente en tu navegador.' },
        { question: 'Que formato conviene descargar?', answer: 'JPG sirve para perfiles y redes. PNG es util si quieres conservar mas calidad o transparencia.' },
      ],
    },
  },
  fr: {
    ...localizedPhotoToolPages.fr,
    'shape-crop': {
      label: 'Recadrage forme',
      title: 'Recadrer une photo en cercle, coeur, avatar arrondi et PNG transparent',
      h1: 'Recadrez une photo par forme pour avatar, profil et icone',
      description:
        'Recadrez une photo en cercle, coeur, carre ou coins arrondis, puis telechargez un PNG transparent.',
      keywords: ['recadrer photo cercle', 'recadrer image coeur', 'recadrage par forme'],
      features: ['Recadrage circulaire', 'Recadrage coeur', 'Avatar carre arrondi', 'PNG transparent', 'Traitement local'],
      faqs: [
        { question: 'Puis-je recadrer une photo en cercle ?', answer: 'Oui. Importez une image, choisissez Cercle et exportez un PNG transparent.' },
        { question: 'Est-ce utile pour un avatar ?', answer: 'Oui. Vous pouvez creer une image circulaire, carree ou arrondie pour profil, badge ou icone.' },
        { question: 'L image est-elle envoyee au serveur ?', answer: 'Non. Le recadrage se fait localement dans le navigateur.' },
        { question: 'Quel format choisir ?', answer: 'Choisissez PNG pour garder la transparence, les coins propres ou un recadrage en coeur.' },
      ],
    },
    'aspect-ratio-crop': {
      label: 'Recadrage ratio',
      title: 'Recadrer une photo par ratio : original, 3:2, 2:3, 4:3, 3:4 et 9:16',
      h1: 'Recadrez une photo par ratio courant pour profil, web et reseaux',
      description:
        'Recadrez une photo au ratio original, 3:2, 2:3, 4:3, 3:4 ou 9:16, deplacez l image dans le cadre et exportez en JPG ou PNG.',
      keywords: ['recadrer photo ratio', 'recadrer photo 3:2', 'recadrer image 9:16'],
      features: ['Ratio original', 'Formats 3:2 et 2:3', 'Formats 4:3 et 3:4', 'Format 9:16', 'Image deplacable dans le cadre'],
      faqs: [
        { question: 'Puis-je recadrer une photo au ratio original ou 3:2 ?', answer: 'Oui. Choisissez le ratio, deplacez l image dans le cadre et exportez le resultat.' },
        { question: 'Puis-je deplacer l image dans la zone de recadrage ?', answer: 'Oui. La previsualisation permet d ajuster la position avant le telechargement.' },
        { question: 'L image est-elle envoyee au serveur ?', answer: 'Non. Le recadrage se fait localement dans le navigateur.' },
        { question: 'Quel format choisir ?', answer: 'JPG convient aux profils et reseaux. PNG est utile pour une sortie plus nette ou avec transparence.' },
      ],
    },
  },
  de: {
    ...localizedPhotoToolPages.de,
    'shape-crop': {
      label: 'Form-Zuschnitt',
      title: 'Foto als Kreis, Herz, runder Avatar und transparentes PNG zuschneiden',
      h1: 'Foto in Form fuer Avatar, Profilbild und Icon zuschneiden',
      description:
        'Schneide Fotos als Kreis, Herz, Quadrat oder mit runden Ecken zu und lade ein transparentes PNG herunter.',
      keywords: ['Foto Kreis zuschneiden', 'Herz Bild zuschneiden', 'Form Zuschnitt'],
      features: ['Kreis-Zuschnitt', 'Herz-Zuschnitt', 'Abgerundeter Avatar', 'Transparentes PNG', 'Lokale Verarbeitung'],
      faqs: [
        { question: 'Kann ich ein Foto als Kreis zuschneiden?', answer: 'Ja. Lade ein Bild hoch, waehle Kreis und exportiere ein transparentes PNG.' },
        { question: 'Eignet es sich fuer Avatare?', answer: 'Ja. Du kannst runde, quadratische oder abgerundete Bilder fuer Profile, Badges und Icons erstellen.' },
        { question: 'Wird das Bild hochgeladen?', answer: 'Nein. Der Zuschnitt laeuft lokal im Browser.' },
        { question: 'Welches Format soll ich waehlen?', answer: 'Nutze PNG fuer transparente Ecken, runde Avatare oder einen Herz-Zuschnitt.' },
      ],
    },
    'aspect-ratio-crop': {
      label: 'Seitenverhaeltnis-Zuschnitt',
      title: 'Foto nach Seitenverhaeltnis zuschneiden: Original, 3:2, 2:3, 4:3, 3:4 und 9:16',
      h1: 'Foto nach gaengigem Seitenverhaeltnis fuer Profil, Web und Social zuschneiden',
      description:
        'Schneide Fotos im Originalverhaeltnis, 3:2, 2:3, 4:3, 3:4 oder 9:16 zu, verschiebe das Bild im Rahmen und exportiere JPG oder PNG.',
      keywords: ['Foto Seitenverhaeltnis zuschneiden', 'Foto 3:2 zuschneiden', 'Bild 9:16 zuschneiden'],
      features: ['Originalverhaeltnis', '3:2 und 2:3 Formate', '4:3 und 3:4 Formate', '9:16 Format', 'Bild im Rahmen verschieben'],
      faqs: [
        { question: 'Kann ich ein Foto im Originalverhaeltnis oder 3:2 zuschneiden?', answer: 'Ja. Waehle das Seitenverhaeltnis, verschiebe das Bild im Rahmen und exportiere das Ergebnis.' },
        { question: 'Kann ich das Bild im Zuschnitt verschieben?', answer: 'Ja. Die Vorschau erlaubt die Positionsanpassung vor dem Download.' },
        { question: 'Wird das Bild hochgeladen?', answer: 'Nein. Der Zuschnitt laeuft lokal im Browser.' },
        { question: 'Welches Format soll ich exportieren?', answer: 'JPG passt fuer Profile und Social Media. PNG ist gut fuer hohe Qualitaet oder Transparenz.' },
      ],
    },
  },
  ja: {
    ...localizedPhotoToolPages.ja,
    'shape-crop': {
      label: '形状切り抜き',
      title: '写真を円形、角丸アバター、透過PNGに切り抜き',
      h1: 'プロフィール画像やアイコン用に写真を形で切り抜き',
      description:
        '写真を円形、正方形、楕円、角丸に切り抜き、透過PNGまたは白背景JPGとして保存できます。',
      keywords: ['写真 円形 切り抜き', '角丸アバター', '形状切り抜き'],
      features: ['円形切り抜き', '角丸アバター', '楕円と角丸長方形', '透過PNG保存', 'ブラウザ内処理'],
      faqs: [
        { question: '写真を円形に切り抜けますか？', answer: 'はい。画像をアップロードし、円形を選んで透過PNGとして保存できます。' },
        { question: 'プロフィール画像に使えますか？', answer: 'はい。円形、正方形、角丸の画像をプロフィール、バッジ、アイコン用に作成できます。' },
        { question: '画像はサーバーに送信されますか？', answer: 'いいえ。切り抜き処理はブラウザ内で行われます。' },
        { question: 'どの形式で保存すればよいですか？', answer: '透明部分が必要ならPNG、白背景でよい場合はJPGを選んでください。' },
      ],
    },
    'aspect-ratio-crop': {
      label: '比率切り抜き',
      title: '写真を原比例、3:2、2:3、4:3、3:4、9:16で切り抜き',
      h1: 'プロフィール、Web、SNS用に写真をよく使う比率で切り抜き',
      description:
        '写真を原比例、3:2、2:3、4:3、3:4、9:16に切り抜き、枠内で位置を調整してJPGまたはPNGで保存できます。',
      keywords: ['写真 比率 切り抜き', '写真 3:2 切り抜き', '画像 9:16 切り抜き'],
      features: ['原比例に対応', '3:2と2:3に対応', '4:3と3:4に対応', '9:16に対応', '枠内で位置調整'],
      faqs: [
        { question: '写真を原比例や3:2に切り抜けますか？', answer: 'はい。比率を選び、枠内で画像を動かしてから保存できます。' },
        { question: '切り抜き枠の中で画像を動かせますか？', answer: 'はい。プレビュー上でドラッグして位置を調整できます。' },
        { question: '画像はサーバーに送信されますか？', answer: 'いいえ。切り抜き処理はブラウザ内で行われます。' },
        { question: 'どの形式で保存すればよいですか？', answer: 'プロフィールやSNSにはJPG、画質や透明部分を重視する場合はPNGを選んでください。' },
      ],
    },
  },
} satisfies Partial<Record<Locale, Partial<Record<PhotoToolPageId, PhotoToolPageTranslation>>>>)

export function getPhotoToolPages(locale: Locale = 'en') {
  if (locale === 'en') {
    return photoToolPages.map((page) => ({
      ...page,
      description: boundedPhotoToolDescription(page.description, locale),
      keywords: page.keywords.slice(0, 3),
    }))
  }

  const translations = localizedPhotoToolPages[locale] || {}
  return photoToolPages.map((page) => {
    const localizedPage = {
      ...page,
      ...(translations[page.id] || {}),
    }

    return {
      ...localizedPage,
      description: boundedPhotoToolDescription(localizedPage.description, locale),
      keywords: localizedPage.keywords.slice(0, 3),
    }
  })
}

export function getPhotoToolPage(id: string, locale: Locale = 'en') {
  return getPhotoToolPages(locale).find((page) => page.id === id)
}

function boundedPhotoToolDescription(value: string, locale: Locale) {
  const maxLength = locale === 'ja' ? 90 : 140
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 3).replace(/\s+\S*$/, '')}...`
}

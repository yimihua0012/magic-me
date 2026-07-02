import type { Locale } from '@/lib/i18n'

type AuthContent = {
  signInTitle: string
  registerTitle: string
  signInSubtitle: string
  registerSubtitle: string
  google: string
  x: string
  divider: string
  fullName: string
  email: string
  password: string
  signIn: string
  createAccount: string
  noAccount: string
  signUp: string
  hasAccount: string
  termsPrefix: string
  terms: string
  privacyJoin: string
  privacy: string
  errorDefault: string
  errorMissingCode: string
  errorExchangeFailed: string
  errorSessionMissing: string
}

export const localizedAuthContent: Record<Locale, AuthContent> = {
  en: {
    signInTitle: 'Welcome Back',
    registerTitle: 'Create Account',
    signInSubtitle: 'Sign in to generate your AI headshots',
    registerSubtitle: 'Start creating professional headshots today',
    google: 'Continue with Google',
    x: 'Continue with X',
    divider: 'or',
    fullName: 'Full name',
    email: 'Email address',
    password: 'Password',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    hasAccount: 'Already have an account?',
    termsPrefix: 'By continuing, you agree to our',
    terms: 'Terms of Service',
    privacyJoin: 'and',
    privacy: 'Privacy Policy',
    errorDefault: 'Social sign-in failed. Please try again.',
    errorMissingCode: 'Social sign-in did not return an authorization code. Please try again.',
    errorExchangeFailed: 'Social sign-in could not be completed. Please check the authorized redirect URL in the authentication provider.',
    errorSessionMissing: 'Social sign-in completed, but the login session was not saved. Please try again.',
  },
  es: {
    signInTitle: 'Bienvenido de nuevo',
    registerTitle: 'Crear cuenta',
    signInSubtitle: 'Inicia sesion para generar tus retratos IA',
    registerSubtitle: 'Empieza a crear retratos profesionales hoy',
    google: 'Continuar con Google',
    x: 'Continuar con X',
    divider: 'o',
    fullName: 'Nombre completo',
    email: 'Correo electronico',
    password: 'Contrasena',
    signIn: 'Iniciar sesion',
    createAccount: 'Crear cuenta',
    noAccount: 'No tienes cuenta?',
    signUp: 'Registrate',
    hasAccount: 'Ya tienes cuenta?',
    termsPrefix: 'Al continuar, aceptas nuestros',
    terms: 'Terminos del servicio',
    privacyJoin: 'y nuestra',
    privacy: 'Politica de privacidad',
    errorDefault: 'El inicio de sesion social fallo. Intentalo de nuevo.',
    errorMissingCode: 'El proveedor no devolvio un codigo de autorizacion. Intentalo de nuevo.',
    errorExchangeFailed: 'No se pudo completar el inicio de sesion social.',
    errorSessionMissing: 'El inicio de sesion se completo, pero no se guardo la sesion. Intentalo de nuevo.',
  },
  fr: {
    signInTitle: 'Bon retour',
    registerTitle: 'Creer un compte',
    signInSubtitle: 'Connectez-vous pour generer vos portraits IA',
    registerSubtitle: 'Commencez a creer des portraits professionnels',
    google: 'Continuer avec Google',
    x: 'Continuer avec X',
    divider: 'ou',
    fullName: 'Nom complet',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    signIn: 'Connexion',
    createAccount: 'Creer un compte',
    noAccount: 'Pas encore de compte ?',
    signUp: 'Inscription',
    hasAccount: 'Vous avez deja un compte ?',
    termsPrefix: 'En continuant, vous acceptez nos',
    terms: 'Conditions d utilisation',
    privacyJoin: 'et notre',
    privacy: 'Politique de confidentialite',
    errorDefault: 'La connexion sociale a echoue. Veuillez reessayer.',
    errorMissingCode: 'Le fournisseur n a pas renvoye de code d autorisation. Veuillez reessayer.',
    errorExchangeFailed: 'La connexion sociale n a pas pu etre terminee.',
    errorSessionMissing: 'La connexion est terminee, mais la session n a pas ete enregistree. Veuillez reessayer.',
  },
  de: {
    signInTitle: 'Willkommen zuruck',
    registerTitle: 'Konto erstellen',
    signInSubtitle: 'Melde dich an, um deine KI-Headshots zu erstellen',
    registerSubtitle: 'Erstelle noch heute professionelle Headshots',
    google: 'Mit Google fortfahren',
    x: 'Mit X fortfahren',
    divider: 'oder',
    fullName: 'Vollstandiger Name',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    signIn: 'Anmelden',
    createAccount: 'Konto erstellen',
    noAccount: 'Noch kein Konto?',
    signUp: 'Registrieren',
    hasAccount: 'Du hast bereits ein Konto?',
    termsPrefix: 'Mit der Fortsetzung akzeptierst du unsere',
    terms: 'Nutzungsbedingungen',
    privacyJoin: 'und unsere',
    privacy: 'Datenschutzrichtlinie',
    errorDefault: 'Die Anmeldung ist fehlgeschlagen. Bitte versuche es erneut.',
    errorMissingCode: 'Der Anbieter hat keinen Autorisierungscode zuruckgegeben. Bitte versuche es erneut.',
    errorExchangeFailed: 'Die Anmeldung konnte nicht abgeschlossen werden.',
    errorSessionMissing: 'Die Anmeldung wurde abgeschlossen, aber die Sitzung wurde nicht gespeichert. Bitte versuche es erneut.',
  },
  ja: {
    signInTitle: 'おかえりなさい',
    registerTitle: 'アカウント作成',
    signInSubtitle: 'ログインしてAIヘッドショットを作成',
    registerSubtitle: 'プロ向けヘッドショットの作成を開始',
    google: 'Googleで続行',
    x: 'Xで続行',
    divider: 'または',
    fullName: '氏名',
    email: 'メールアドレス',
    password: 'パスワード',
    signIn: 'ログイン',
    createAccount: 'アカウント作成',
    noAccount: 'アカウントをお持ちでないですか？',
    signUp: '登録',
    hasAccount: 'すでにアカウントをお持ちですか？',
    termsPrefix: '続行すると、以下に同意したものとみなされます：',
    terms: '利用規約',
    privacyJoin: 'および',
    privacy: 'プライバシーポリシー',
    errorDefault: 'ソーシャルログインに失敗しました。もう一度お試しください。',
    errorMissingCode: '認証コードが返されませんでした。もう一度お試しください。',
    errorExchangeFailed: 'ソーシャルログインを完了できませんでした。',
    errorSessionMissing: 'ログインは完了しましたが、セッションを保存できませんでした。もう一度お試しください。',
  },
}

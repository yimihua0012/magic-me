import LoginPageView from '@/components/auth/login-page-view'
import { privatePageMetadata } from '@/lib/private-page-metadata'

export const metadata = {
  ...privatePageMetadata,
  title: 'Sign In',
}

export default function LoginPage() {
  return <LoginPageView />
}

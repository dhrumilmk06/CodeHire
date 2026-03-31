import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import {BrowserRouter} from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// Import your Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

const clerkAppearance = {
  variables: {
    colorPrimary: '#22c55e',
    colorBackground: '#111111',
    colorText: '#ffffff',
    colorTextSecondary: '#888888',
    colorInputBackground: '#1a1a1a',
    colorInputText: '#ffffff',
    colorInputPlaceholder: '#555555',
    borderRadius: '0.75rem',
    colorDanger: '#ef4444',
    colorSuccess: '#22c55e',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  elements: {
    // Modal card
    card: {
      background: '#111111',
      border: '1px solid #2a2a2a',
      boxShadow: '0 0 60px rgba(34, 197, 94, 0.08), 0 25px 50px rgba(0,0,0,0.8)',
    },
    // Header
    headerTitle: { color: '#ffffff', fontWeight: 800 },
    headerSubtitle: { color: '#888888' },
    // Social button (Google)
    socialButtonsBlockButton: {
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      color: '#ffffff',
    },
    socialButtonsBlockButton__hover: {
      background: '#222222',
      borderColor: '#22c55e',
    },
    // Divider
    dividerLine: { background: '#2a2a2a' },
    dividerText: { color: '#555555' },
    // Form labels & inputs
    formFieldLabel: { color: '#888888', fontSize: '0.8rem' },
    formFieldInput: {
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      color: '#ffffff',
      borderRadius: '0.625rem',
    },
    formFieldInput__focus: { borderColor: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.15)' },
    // Primary button
    formButtonPrimary: {
      background: '#22c55e',
      color: '#000000',
      fontWeight: 700,
      borderRadius: '0.75rem',
    },
    formButtonPrimary__hover: { background: '#16a34a' },
    // Footer links
    footerActionText: { color: '#888888' },
    footerActionLink: { color: '#22c55e', fontWeight: 600 },
    // "Secured by Clerk" footer
    footer: { background: '#0d0d0d', borderTop: '1px solid #2a2a2a' },
    footerPages: { background: '#0d0d0d' },
    // Internal card background
    cardBox: { background: '#111111' },
    // Alert errors
    alert: { background: '#1a1a1a', border: '1px solid #ef4444' },
    alertText: { color: '#ffffff' },
    // Identifier (email preview)
    identityPreviewText: { color: '#ffffff' },
    identityPreviewEditButton: { color: '#22c55e' },

    // ── UserButton Popover (avatar dropdown) ──────────────────────────────
    userButtonPopoverCard: {
      background: '#111111',
      border: '1px solid #2a2a2a',
      boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(34,197,94,0.06)',
      borderRadius: '0.75rem',
    },
    userButtonPopoverMain: {
      background: '#111111',
    },
    userButtonPopoverActions: {
      background: '#111111',
    },
    userButtonPopoverActionButton: {
      background: 'transparent',
      color: '#cccccc',
      borderRadius: '0.5rem',
    },
    'userButtonPopoverActionButton:hover': {
      background: '#1a1a1a',
      color: '#ffffff',
    },
    userButtonPopoverActionButtonText: {
      color: '#cccccc',
    },
    userButtonPopoverActionButtonIcon: {
      color: '#888888',
    },
    'userButtonPopoverActionButtonIcon:hover': {
      color: '#22c55e',
    },
    userButtonPopoverFooter: {
      background: '#0d0d0d',
      borderTop: '1px solid #2a2a2a',
      borderRadius: '0 0 0.75rem 0.75rem',
    },
    // User info section inside popover
    userPreviewMainIdentifier: { color: '#ffffff', fontWeight: 600 },
    userPreviewSecondaryIdentifier: { color: '#888888' },
    userButtonAvatarBox: { width: '2rem', height: '2rem' },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
        <ClerkProvider
          publishableKey={PUBLISHABLE_KEY}
          appearance={clerkAppearance}
          afterSignInUrl="/"
          afterSignUpUrl="/select-role"
        >
          <App />
        </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)

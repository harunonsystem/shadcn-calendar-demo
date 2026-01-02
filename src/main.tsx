import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'jotai'
import { NuqsAdapter } from 'nuqs/adapters/react'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuqsAdapter>
      <Provider>
        <App />
      </Provider>
    </NuqsAdapter>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BudgetProvider } from './context/BudgetContext.tsx'
import { NextUIProvider } from "@nextui-org/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NextUIProvider>
      <BudgetProvider>
        <App />
      </BudgetProvider>
    </NextUIProvider>
  </StrictMode>,
)

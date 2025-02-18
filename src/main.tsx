import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "@radix-ui/themes/styles.css";
import {
  Theme,
  // ThemePanel 
} from "@radix-ui/themes";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme grayColor="sand" panelBackground="solid" radius="none" scaling="95%" appearance='dark'>
      <App />
      {/* <ThemePanel /> */}
    </Theme>
  </StrictMode>,
)

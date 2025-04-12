import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import NewTask from './components/NewTask.tsx'
import EditTask from './components/EditTask.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='nueva-tarea' element={<NewTask />} />
        <Route path="/tarea/:id" element={<EditTask />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

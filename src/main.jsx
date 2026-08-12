import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import MapList from './pages/MapList.jsx'
import MapUpload from './pages/MapUpload.jsx'
import MapDetail from './pages/MapDetail.jsx'

// 各担当は，自分のページができたらここに <Route> を1行足してください．
// 1行の追加なら，同じファイルを触っても衝突はほぼ起きません．
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapList />} />
        <Route path="/maps/new" element={<MapUpload />} />
        <Route path="/maps/:id" element={<MapDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

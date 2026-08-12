import { Routes, Route, Link } from "react-router-dom";
import MapList from "./pages/MapList.jsx";
import MapUpload from "./pages/MapUpload.jsx";
import MapDetail from "./pages/MapDetail.jsx";

/**
 * アプリ全体の入れ物．
 *
 * ここには2つの役割があります．
 *   1. 全ページに共通で出る見た目（上のヘッダー）を置く
 *   2. どのURLでどのページを表示するかを決める（<Routes> の部分）
 *
 * ページを追加したら，下の <Routes> の中に <Route> を1行足してください．
 * 1行の追加なら，同じファイルを触っても衝突はほぼ起きません．
 */

export default function App() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <Link to="/" className="text-xl font-bold text-slate-800">
          memop
        </Link>
        <Link
          to="/maps/new"
          className="rounded bg-slate-800 px-3 py-1.5 text-sm text-white"
        >
          新しいマップ
        </Link>
      </header>

      <main className="min-h-0 flex-1">
        <Routes>
          <Route path="/" element={<MapList />} />
          <Route path="/maps/new" element={<MapUpload />} />
          <Route path="/maps/:id" element={<MapDetail />} />
        </Routes>
      </main>
    </div>
  );
}

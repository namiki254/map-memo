/**
 * マップ詳細ページ（雛形）．
 *
 * URL: /maps/:id
 *
 * ここでやること：
 *   - URL の :id から該当する maps の1行を取得する
 *   - そのマップに紐づく pins を取得する
 *   - MapView に渡して表示する
 *   - ピンをクリックしたら PinPanel を開く
 *   - 画面のどこかに共有用のURLを表示する
 *
 * URL からIDを受け取る方法：
 *   import { useParams } from "react-router-dom";
 *   const { id } = useParams();
 *
 * ピンの取得の例：
 *   const { data } = await supabase
 *     .from("pins")
 *     .select("*")
 *     .eq("map_id", id);
 *
 * このページが，A（地図表示）とB（ピン操作）の成果物を組み立てる場所になります．
 * MapView の props の形は確定しているので，中身が未実装でも繋ぎ込みは先に進められます．
 */

import { MapView } from "../components/MapView";

export default function MapDetail() {
  // Supabase から取得するまでの仮データ．繋ぎ込んだら消してください．
  const map = {
    id: "placeholder",
    title: "（マップ未取得）",
    description: "",
    image_url: null,
    created_at: "",
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-bold text-slate-800">{map.title}</h2>
        <p className="text-sm text-slate-500">準備中です．</p>
      </header>
      <main className="min-h-0 flex-1">
        <MapView map={map} pins={[]} />
      </main>
    </div>
  );
}

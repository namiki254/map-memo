import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
/**
 * マップ一覧ページ（雛形）．
 *
 * URL: /
 *
 * ここでやること：
 *   - Supabase の maps テーブルから一覧を取得して並べる
 *   - 「新しいマップを作る」ボタンを置く
 *   - 各マップをクリックしたら /maps/:id へ移動する
 *
 * データの取り方の例：
 *   import { supabase } from "../lib/supabase";
 *   const { data, error } = await supabase
 *     .from("maps")
 *     .select("*")
 *     .order("created_at", { ascending: false });
 *
 * 他のページへ移動したいときは react-router の Link を使います．
 *   import { Link } from "react-router-dom";
 *   <Link to={`/maps/${map.id}`}>{map.title}</Link>
 */

export default function MapList() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("maps")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        setMaps(data ?? []);
        setLoading(false);
      });
  }, []);
  if (loading) {
  return <p className="p-6">読み込み中...</p>;
}
if (maps.length === 0) {
  return <p className="p-6">まだマップがありません</p>;
}
return (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-slate-800">マップ一覧</h2>

    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {maps.map((map) => (
        <Link
          key={map.id}
          to={`/maps/${map.id}`}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          {map.image_url ? (
            <img
              src={map.image_url}
              alt={map.title}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="h-40 w-full bg-slate-200" />
          )}

          <div className="p-4">
            <h3 className="font-bold text-slate-800">{map.title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {map.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);
  
}

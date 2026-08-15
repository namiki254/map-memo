import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMaps() {
      setLoading(true);
      setError(null);

      // Supabase からデータを取得
      const { error } = await supabase
        .from("maps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error);
      }
      setLoading(false);
    }

    fetchMaps();
  }, []);

  // 1. 読み込み中は Loading コンポーネントを表示
  if (loading) {
    return <Loading />;
  }

  // 2. エラー時は ErrorMessage コンポーネントを表示（error.messageを渡す）
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // 3. 通常時（元のデザインを完全維持）
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800">マップ一覧</h2>
      <p className="mt-2 text-slate-500">準備中です．</p>
    </div>
  );
}
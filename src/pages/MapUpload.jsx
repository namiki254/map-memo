import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

/**
 * マップ新規作成ページ（雛形）．
 *
 * URL: /maps/new
 *
 * ここでやること：
 *   - タイトルと説明の入力欄を置く
 *   - 画像ファイルを選ばせて Supabase Storage にアップロードする
 *   - アップロードで得た公開URLを maps テーブルの image_url に保存する
 *   - 保存できたら /maps/:id へ移動する
 *
 * Storage へのアップロードの例（バケット名は map-images）：
 *   import { supabase } from "../lib/supabase";
 *
 *   const path = `${crypto.randomUUID()}-${file.name}`;
 *   const { error } = await supabase.storage
 *     .from("map-images")
 *     .upload(path, file);
 *
 *   const { data } = supabase.storage
 *     .from("map-images")
 *     .getPublicUrl(path);
 *   // data.publicUrl を maps.image_url に入れる
 *
 * 注意：画像をそのままデータベースに入れてはいけません．
 * Storage に置いて，URLだけをデータベースに保存します．
 *
 * 余裕があれば，アップロード前に長辺1600px程度へ縮小する処理を入れてください．
 * 無圧縮の写真をそのまま上げると，Supabase の無料枠をすぐ使い切ります．
 */

export default function MapUpload() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkStorage() {
      setLoading(true);
      setError(null);

      // 初期化チェックとして Storage バケットへのアクセスを確認
      const { error } = await supabase.storage.from("map-images").list();

      if (error) {
        setError(error);
      }
      setLoading(false);
    }

    checkStorage();
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
      <h2 className="text-2xl font-bold text-slate-800">新しいマップを作る</h2>
      <p className="mt-2 text-slate-500">準備中です．</p>
    </div>
  );
}
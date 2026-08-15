import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { MapView } from "../components/MapView";

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

export default function MapDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Supabase から取得するまでの仮データ．繋ぎ込んだら消してください．
  const map = {
    id: "placeholder",
    title: "（マップ未取得）",
    description: "",
    image_url: null,
    created_at: "",
  };

  useEffect(() => {
    async function fetchMapDetail() {
      setLoading(true);
      setError(null);

      // Supabase からデータを取得
      const { error } = await supabase
        .from("maps")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error);
      }
      setLoading(false);
    }

    fetchMapDetail();
  }, [id]);

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
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-6 py-3">
        <h2 className="text-lg font-bold text-slate-800">{map.title}</h2>
        <p className="text-sm text-slate-500">準備中です．</p>
      </div>
      <div className="min-h-0 flex-1">
        <MapView map={map} pins={[]} />
      </div>
    </div>
  );
}

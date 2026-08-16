import { useCallback, useEffect, useState } from "react";
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
  // /maps/:id の :id を取得する
  const { id } = useParams();
  // Supabaseから取得したデータを保存する
  const [map, setMap] = useState(null);
  const [pins, setPins] = useState([]);
  // 画面の状態
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // マップとピンを取得する
  const loadMapDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMap(null);
    setPins([]);

    try {
      // 1. mapsテーブルから、URLのIDに一致するマップを取得
      const { data: mapData, error: mapError } = await supabase
        .from("maps")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (mapError?.code === "22P02") {
        return;
      }

      if (mapError) {
        throw mapError;
      }

      // 該当するマップが存在しない場合
      if (!mapData) {
        return;
      }

      // 2. pinsテーブルから、そのマップのピンを取得
      const { data: pinData, error: pinError } = await supabase
        .from("pins")
        .select("*")
        .eq("map_id", id)
        .order("created_at", { ascending: true });

      if (pinError) {
        throw pinError;
      }

      // 3. 取得したデータをstateへ保存
      setMap(mapData);
      setPins(pinData ?? []);
    } catch (fetchError) {
      setError(fetchError);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMapDetail();
  }, [loadMapDetail]);

  // 1. 読み込み中は Loading コンポーネントを表示
  if (loading) {
    return <Loading />;
  }

  // 2. エラー時は ErrorMessage コンポーネントを表示（error.messageを渡す）
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // URLのIDに一致するマップがなかった場合
  if (!map) {
    return (
      <div className="grid h-full place-items-center p-8 text-slate-600">
        <p className="text-lg font-semibold">マップが見つかりません</p>
      </div>
    );
  }

  // 3. 通常時（元のデザインを完全維持）
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-6 py-3">
        <h2 className="text-lg font-bold text-slate-800">{map.title}</h2>
        {map.description && (
          <p className="mt-1 text-sm text-slate-500">
            {map.description}
          </p>
        )}
      </div>
      <div className="min-h-0 flex-1">
        <MapView map={map} pins={pins} />
      </div>
    </div>
  );
}

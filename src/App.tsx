import { MapView } from "./components/MapView";
import type { MapDoc, Pin } from "./types";

// 動作確認用の仮データ．Supabase に繋いだら消してください．
const sampleMap: MapDoc = {
  id: "sample-japan",
  name: "日本全国",
  type: "geo",
  image_url: null,
  width: null,
  height: null,
  owner_id: null,
  created_at: "2026-08-11T00:00:00Z",
};

const samplePins: Pin[] = [
  {
    id: "pin-1",
    map_id: "sample-japan",
    x: 135.5023,
    y: 34.6937,
    title: "大阪",
    body: "ここから市内の地図へ潜る",
    kind: "link",
    child_map_id: "sample-osaka",
    planned_date: "2026-08-30",
    order_index: 0,
    visited_at: null,
  },
  {
    id: "pin-2",
    map_id: "sample-japan",
    x: 139.7671,
    y: 35.6812,
    title: "東京駅",
    body: "出発地点",
    kind: "note",
    child_map_id: null,
    planned_date: "2026-08-29",
    order_index: 0,
    visited_at: null,
  },
];

export default function App() {
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-800">map-memo</h1>
        <p className="text-sm text-slate-500">
          セットアップ確認用の画面です．担当ごとのページができたら差し替えます．
        </p>
      </header>
      <main className="min-h-0 flex-1">
        <MapView map={sampleMap} pins={samplePins} />
      </main>
    </div>
  );
}

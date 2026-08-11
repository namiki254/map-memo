import { MapView } from "./components/MapView";

// 動作確認用の仮データ．Supabase に繋いだら消してください．
const sampleMap = {
  id: "sample-1",
  title: "サンプルマップ",
  description: "セットアップ確認用のダミーデータです",
  image_url: null,
  created_at: "2026-08-11T00:00:00Z",
};

// x と y は画像に対する割合（0〜1）です．ピクセルではありません．
const samplePins = [
  {
    id: "pin-1",
    map_id: "sample-1",
    x: 0.35,
    y: 0.62,
    title: "サンプルのピン",
    content: "画像の左から35%，上から62%の位置",
    pin_type: "default",
    created_at: "2026-08-11T00:00:00Z",
  },
  {
    id: "pin-2",
    map_id: "sample-1",
    x: 0.7,
    y: 0.25,
    title: "もう1つのピン",
    content: "画像の左から70%，上から25%の位置",
    pin_type: "default",
    created_at: "2026-08-11T00:00:00Z",
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

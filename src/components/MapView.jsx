/**
 * 地図表示コンポーネント（仮実装）．
 *
 * まだ中身は作っていません．今は「ここに地図が入る」という枠だけを表示します．
 * 実装するときは，このファイルの中身だけを書き換えてください．
 * 受け取る props の形は下のとおり確定しているので，
 * 中身が変わっても他の人のコードは影響を受けません．
 *
 * props:
 *   map        maps テーブルの1行．{ id, title, description, image_url, created_at }
 *   pins       pins テーブルの配列．{ id, map_id, x, y, title, content, pin_type, created_at }
 *   onPinClick ピンがクリックされたときに呼ぶ．引数はそのピン
 *   onMapClick 何もない場所がクリックされたときに呼ぶ．引数は x と y（どちらも0〜1）
 *
 * 座標について：
 *   x と y は「画像に対する割合」です．ピクセルではありません．
 *   x = 0.35, y = 0.62 なら「画像の左から35%，上から62%の位置」という意味です．
 *
 *   クリック位置から割合を出すときは，画像の表示サイズで割ります．
 *     const rect = 画像の要素.getBoundingClientRect();
 *     const x = (e.clientX - rect.left) / rect.width;
 *     const y = (e.clientY - rect.top) / rect.height;
 *
 *   逆に，割合からピンの表示位置を出すときはCSSのパーセント指定を使います．
 *     style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
 *
 *   こうしておくと，画面や画像の大きさが変わってもピンがずれません．
 *
 * 地図ライブラリについて：
 *   MVP（アップロードした画像にピンを立てる）は，ライブラリなしで作れます．
 *   img タグとクリック座標の計算だけで足ります．
 *   現実の地図をスクロールさせたくなった場合に限り Leaflet の導入を検討します．
 *   この判断はまだ確定していません．README の「地図の表示方法」を見てください．
 */

export function MapView({ map, pins = [] }) {
  return (
    <div className="grid h-full w-full place-items-center bg-slate-200 text-slate-500">
      <div className="text-center">
        <p className="text-lg font-bold">地図（未実装）</p>
        <p className="mt-2 text-sm">
          {map.title} / ピン {pins.length} 件
        </p>
      </div>
    </div>
  );
}

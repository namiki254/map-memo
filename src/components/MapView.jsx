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




// （以下を変更）

// ブラウザを縮小したとき、画像を極限まで縮小せずスクロールバーを導入する場合（1. ）と、
// スクロールバーを導入せず画像を極限まで縮小して表示する場合（2. ）を作成しました。
// PR時には（1. ）を採用しています。

// ブラウザ拡大縮小のテストページとして src/pages/TestMapView.jsx も追加しました。
// TestMapView.jsxでも重要な設定がある（らしい、Geminiが言ってた）ので、確認お願いします。



// 1. スクロールを導入する場合
// （ブラウザがあるところより縮小された場合スクロールでmap全域を見ることができる）

export function MapView({ map, pins = [], onPinClick }) {
  if (!map?.image_url) {
    return (
      <div className="grid h-full w-full place-items-center bg-slate-200 text-slate-500">
        <div className="text-center">
          <p className="text-lg font-bold">地図画像がありません</p>
          <p className="mt-2 text-sm">
            {map?.title || "未選択"} / ピン {pins.length} 件
          </p>
        </div>
      </div>
    );
  }

  return (
    /* 
       1. 一番外側のコンテナ
       overflow-auto を指定して、ここを「スクロールが発生する枠」にする
    */
    <div className="h-full w-full overflow-auto p-4">
      {/* 
         2. 中央寄せるためのラッパー
         m-auto を使うことで、画像が領域より小さい時は中央に寄り、
         大きい時は正しくスクロール領域が広がります
      */}
      <div className="flex min-h-full min-w-full items-center justify-center">
        {/* 
           3. 箱（親要素）
           relative: この箱を基準にピンを配置する
           w-fit h-fit: 画像サイズと完全に一致させる
        */}
        <div className="relative h-fit w-fit leading-none">
          {/* 地図画像 */}
          <img
            src={map.image_url}
            alt={map.title || "マップ画像"}
            /* 
               画像の最大サイズを指定（必要に応じて調整）
               max-w-none や固定サイズにするとスクロールのテストがしやすくなります
            */
            className="block max-h-[80vh] max-w-full object-contain"
          />

          {/* ピンの描画 */}
          {pins.map((pin) => (
            <button
              key={pin.id}
              type="button"
              onClick={() => onPinClick?.(pin)}
              style={{
                left: `${pin.x * 100}%`,
                top: `${pin.y * 100}%`,
              }}
              /* 
                 absolute なので、スクロールしても「箱（imgと同一サイズ）」の中の
                 指定%の位置に留まり続け、画像と一緒にスクロールされます
              */
              className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-125 focus:outline-none"
              title={pin.title}
            >
              <span className="text-2xl drop-shadow">📍</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}





// 2. スクロールを導入しない場合
// （ブラウザの縮小に対して、画像を極限まで縮小する）

// import { useState } from "react";

// export function MapView({ map, pins = [], onPinClick }) {
//   // 画像の元の縦横比（横/縦）を保持するステート
//   const [aspectRatio, setAspectRatio] = useState(null);

//   if (!map?.image_url) {
//     return (
//       <div className="grid h-full w-full place-items-center bg-slate-200 text-slate-500">
//         <div className="text-center">
//           <p className="text-lg font-bold">地図画像がありません</p>
//           <p className="mt-2 text-sm">
//             {map?.title || "未選択"} / ピン {pins.length} 件
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // 画像読み込み完了時にアスペクト比を計算
//   const handleImageLoad = (e) => {
//     const { naturalWidth, naturalHeight } = e.currentTarget;
//     if (naturalWidth && naturalHeight) {
//       setAspectRatio(naturalWidth / naturalHeight);
//     }
//   };

//   return (
//     <div className="flex h-full w-full items-center justify-center overflow-hidden p-4">
//       {/* 
//          箱（親要素）:
//          aspectRatio がセットされたら、画像と『まったく同じ縦横比』に固定される。
//          これで余白が消え、left: X% が画像上の正確な位置を指すようになる。
//       */}
//       <div
//         className="relative max-h-full max-w-full leading-none"
//         style={{
//           aspectRatio: aspectRatio ? `${aspectRatio}` : "auto",
//         }}
//       >
//         {/* 地図画像 */}
//         <img
//           src={map.image_url}
//           alt={map.title || "マップ画像"}
//           onLoad={handleImageLoad}
//           className="block h-full w-full max-h-full max-w-full object-contain"
//         />

//         {/* ピンの描画 */}
//         {pins.map((pin) => (
//           <button
//             key={pin.id}
//             type="button"
//             onClick={() => onPinClick?.(pin)}
//             style={{
//               left: `${pin.x * 100}%`,
//               top: `${pin.y * 100}%`,
//             }}
//             className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-125 focus:outline-none"
//             title={pin.title}
//           >
//             <span className="text-2xl drop-shadow">📍</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }







// （元のスクリプト）
// export function MapView({ map, pins = [] }) {
//   return (
//     <div className="grid h-full w-full place-items-center bg-slate-200 text-slate-500">
//       <div className="text-center">
//         <p className="text-lg font-bold">地図（未実装）</p>
//         <p className="mt-2 text-sm">
//           {map.title} / ピン {pins.length} 件
//         </p>
//       </div>
//     </div>
//   );
// }
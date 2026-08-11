import type { MapDoc, Pin } from "../types";

/**
 * 地図表示コンポーネント（仮実装）．
 *
 * 地図ライブラリの選定が未確定のため，今は空の箱を表示するだけです．
 * 選定が決まったら，このファイルの中身だけを書き換えます．
 *
 * 下の Props の形は確定です．他の担当はこの形で呼び出してください．
 * 中身が差し替わっても呼び出し側は影響を受けません．
 */

type Props = {
  /** 表示する地図．type が "geo" なら実地図，"image" なら画像地図 */
  map: MapDoc;
  /** この地図の上に立っているピン */
  pins: Pin[];
  /** ピンがクリックされたとき */
  onPinClick?: (pin: Pin) => void;
  /** 地図の何もない場所がクリックされたとき．新しいピンを立てる用 */
  onMapClick?: (x: number, y: number) => void;
};

export function MapView({ map, pins }: Props) {
  return (
    <div className="grid h-full w-full place-items-center bg-slate-200 text-slate-500">
      <div className="text-center">
        <p className="text-lg font-bold">地図（未実装）</p>
        <p className="mt-2 text-sm">
          {map.name} / {map.type === "geo" ? "実地図" : "画像地図"} / ピン {pins.length} 件
        </p>
      </div>
    </div>
  );
}

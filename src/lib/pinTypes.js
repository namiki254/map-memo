/**
 * ピンの種類の一覧．
 *
 * MapView.jsx（見た目の切り替え）と PinPanel.jsx（選択欄）の両方から使うので，
 * ここに1箇所だけ定義する．
 *
 * "default" は，これまで pin_type に自動で入っていた値．
 * 既存のピンを壊さないよう一覧の中に残し，これまでと同じ📍を割り当てている．
 */
export const PIN_TYPES = [
  { value: "default", label: "メモ", emoji: "📍" },
  { value: "recommend", label: "おすすめ", emoji: "⭐" },
  { value: "photo", label: "写真スポット", emoji: "📷" },
  { value: "caution", label: "注意", emoji: "⚠️" },
];

const EMOJI_BY_TYPE = Object.fromEntries(
  PIN_TYPES.map((type) => [type.value, type.emoji]),
);

const FALLBACK_EMOJI = "📍";

/**
 * pin_type に対応する絵文字を返す．
 * 一覧に無い値（今後知らない種類が増えた場合など）が来ても，
 * 既定の📍にフォールバックして表示が崩れないようにする．
 */
export function getPinEmoji(pinType) {
  return EMOJI_BY_TYPE[pinType] ?? FALLBACK_EMOJI;
}

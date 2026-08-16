import { useEffect, useState } from "react";

/**
 * ピンの入力・表示パネル．
 *
 * 画面の下（広い画面では右下）に固定で出る．
 *
 * props:
 *   pin      表示するピン．
 *            新しく作るときは座標だけが入った { x, y } を渡す（id が無い）．
 *            既にあるピンを見るときは pins テーブルの1行をそのまま渡す（id がある）．
 *   saving   保存中かどうか
 *   error    保存に失敗したときの文言
 *   onSave   { title, content } を受け取って保存する．新規作成のときだけ使う
 *   onClose  閉じる
 *
 * id があるかどうかで «表示» と «新規作成» を切り替える．
 * 既存ピンの編集と削除はこのコンポーネントには入れていない（#40 の担当範囲）．
 */
export function PinPanel({ pin, saving = false, error = "", onSave, onClose }) {
  const isNew = !pin?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 別のピンを選び直したときに入力欄を作り直す．
  // pin.id が無い（新規作成）ときは座標を鍵にして，
  // 別の場所をクリックしたら空の状態に戻るようにする．
  const key = pin?.id ?? `${pin?.x}-${pin?.y}`;
  useEffect(() => {
    setTitle("");
    setContent("");
  }, [key]);

  function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;
    if (!title.trim()) return;
    onSave?.({ title: title.trim(), content: content.trim() });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80 sm:rounded sm:border">
      {isNew ? (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-800">ここにピンを立てる</p>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="text-sm text-slate-500 underline disabled:opacity-50"
            >
              キャンセル
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              // 日本語の変換を確定する Enter で送信されないようにする
              if (e.key === "Enter" && e.nativeEvent.isComposing) {
                e.preventDefault();
              }
            }}
            disabled={saving}
            maxLength={100}
            placeholder="タイトル（例：おすすめのカフェ）"
            className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={saving}
            maxLength={500}
            rows={3}
            placeholder="メモ（任意）"
            className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
          />

          {error && (
            <p className="mt-2 rounded bg-red-50 p-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || title.trim() === ""}
            className="mt-3 w-full rounded bg-slate-800 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? "保存中..." : "このピンを保存"}
          </button>

          {!saving && title.trim() === "" && (
            <p className="mt-2 text-xs text-slate-500">
              タイトルを入れると保存できます．
            </p>
          )}
        </form>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold break-words text-slate-800">{pin.title}</p>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-sm text-slate-500 underline"
            >
              閉じる
            </button>
          </div>

          {pin.content ? (
            <p className="mt-2 text-sm break-words whitespace-pre-wrap text-slate-600">
              {pin.content}
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">メモはありません．</p>
          )}
        </div>
      )}
    </div>
  );
}

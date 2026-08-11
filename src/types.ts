/**
 * アプリ全体で共有する型定義．
 *
 * このファイルはチーム全員のコードが依存しています．
 * 変更するときは必ず Slack で相談してください．黙って変えると全員のコードが同時に壊れます．
 *
 * プロパティ名がスネークケース（image_url など）なのは意図的です．
 * データベースの列名と1文字ずつ一致させることで，変換処理を不要にしています．
 */

export type MapType = "geo" | "image";

/** 地図．実地図（geo）と画像地図（image）の両方をこの型で表す */
export type MapDoc = {
  id: string;
  name: string;
  type: MapType;
  /** type が "image" のときだけ入る．アップロードした画像のURL */
  image_url: string | null;
  /** 画像の幅（ピクセル）．type が "image" のときだけ入る */
  width: number | null;
  /** 画像の高さ（ピクセル）．type が "image" のときだけ入る */
  height: number | null;
  owner_id: string | null;
  created_at: string;
};

/** ピンの種類．note はメモを持つ，link は下位の地図へ潜る */
export type PinKind = "note" | "link";

/**
 * ピン．
 *
 * 座標は x と y の数値2つだけで表します．実地図も画像地図も画面上は平面なので，
 * 実地図なら経度と緯度を，画像地図ならピクセル座標を，同じ列に入れます．
 *
 * 計画と旅行記でテーブルを分けません．planned_date が入っていれば計画，
 * visited_at が入っていれば訪問済みとして扱い，同じデータを3つのビューで見せます．
 */
export type Pin = {
  id: string;
  map_id: string;
  /** geo なら経度（longitude），image ならピクセルのX座標 */
  x: number;
  /** geo なら緯度（latitude），image ならピクセルのY座標 */
  y: number;
  title: string;
  body: string;
  kind: PinKind;
  /** kind が "link" のときだけ入る．潜った先の地図のID */
  child_map_id: string | null;
  /** "2026-08-30" 形式．入っていれば「計画」として日程表に出る */
  planned_date: string | null;
  /** 同じ日の中での訪問順 */
  order_index: number;
  /** 入っていれば「訪問済み」として旅行記に出る */
  visited_at: string | null;
};

export type Photo = {
  id: string;
  pin_id: string;
  url: string;
  caption: string;
};

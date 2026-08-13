# MVP機能とIssue草案

作成：2026年8月12日

この文書は，MVPの各機能をGitHubのIssueとして登録するための下書きです．各Issueの本文は，そのまま貼り付ければ使える形にしてあります．AIに実装を手伝わせる前提で，ファイルパス・データの形・呼び出し方まで書いてあります．

**Issue番号は21まで使用済みなので，新しく作るものは #22 からになります．**

---

## 目次

- [1. MVPの検討結果](#1-mvpの検討結果)
- [2. Issue草案](#2-issue草案)
  - [A. Supabaseのテーブル・Storage・アクセス設定を作る](#a-supabaseのテーブルstorageアクセス設定を作る)
  - [B. マップ一覧を表示する](#b-マップ一覧を表示する)
  - [C. 新しいマップを作成する（画像アップロード込み）](#c-新しいマップを作成する画像アップロード込み)
  - [D. マップ詳細ページを組み立てる](#d-マップ詳細ページを組み立てる)
  - [E. 画像を表示してピンを描画する](#e-画像を表示してピンを描画する)
  - [F. 画像をクリックしてピンを作る](#f-画像をクリックしてピンを作る)
  - [G. マップのURLを共有できるようにする](#g-マップのurlを共有できるようにする)
  - [H. ピンを削除できるようにする](#h-ピンを削除できるようにする)
  - [I. 読み込み中とエラーの表示を揃える](#i-読み込み中とエラーの表示を揃える)
- [3. 着手順と割り当ての提案](#3-着手順と割り当ての提案)

---

# 1. MVPの検討結果

元々挙げていた9項目は次のとおりです．

1. マップ一覧を表示
2. 新しいマップを作成
3. マップ用画像をアップロード
4. マップ画像を表示
5. 画像上をクリックしてピンを設置
6. ピンにタイトル・文章を書く
7. ピンをデータベースへ保存
8. 保存されたピンを他のユーザーも閲覧
9. マップごとのURLで共有

このうち**削るべきものはありません．** どれもアプリとして成立するために必要です．ただし，Issueの切り方は変えた方がよい箇所があります．

## 統合すべきもの

**6と7は同じ作業です．** 保存しないと文章を書く意味がないので，分けると片方が単独では完結しません．1つのIssueにします．

**8は機能ではなく結果です．** ピンがデータベースに入り，マップ詳細ページがそれを読み込めば自動的に満たされます．独立したIssueにすると「何を実装すればいいか分からない」ものになるので，**他のIssueの完了条件**として書きます．

**4と5は同じファイル（`src/components/MapView.jsx`）を触ります．** 別の人に割り当てるとコンフリクトが確実に起きます．1人が続けて担当します．

**2と3も同じ画面**（マップ作成フォーム）なので統合します．

## 足りないもの

**Supabaseのテーブルとバケットの作成が入っていません．** これが最優先で，かつ全機能の前提です．これがないと誰も1行も進められません．

**ピンの削除を入れるべきです．** 現在「余裕があれば」に分類されていますが，**デモ中に誤クリックでピンが増えたとき，消せないと詰みます．** 開発中もテストデータが溜まり続けます．実装は30分程度なので，保険として入れる価値があります．編集は不要で，削除だけで十分です．

**画像の縮小処理が要ります．** スマホ写真をそのまま上げると1枚3〜5MBです．Supabaseの無料枠（転送量 月5GB）を数日で使い切り，発表当日に画像が表示されない事故が起きます．アップロード時に長辺1600px程度へ縮小すれば回避できます．

**ローディングとエラーの表示が要ります．** 画像アップロードは数秒かかるので，何も表示されないと「壊れた」ように見えます．デモの印象に直結します．

## 結論

9個のIssueではなく，**9個（A〜I）に再編**します．内訳は，元の9項目を6個に統合し，足りない3つ（Supabase設定・ピン削除・ローディング表示）を追加した形です．画像の縮小はCの中に含めています．

**チームの合意が必要な点が2つあります．** 「ピンの削除をMVPに入れる」ことと，「画像の縮小を必須にする」ことです．

---

# 2. Issue草案

難易度は3段階です．

| 表記 | 目安 | 想定 |
| --- | --- | --- |
| 易 | 1〜2時間 | 初心者向け |
| 中 | 半日 | 調べながらできる |
| 難 | 1日 | 経験者向け |

---

## A. Supabaseのテーブル・Storage・アクセス設定を作る

**難易度：中**（作業自体は短いが，間違えると全員が止まる）
**担当の目安：Supabaseの管理画面を触れる人が1人で．他の全Issueの前提**

````markdown
## 概要
アプリが使うデータベースのテーブルと，画像を置くStorageを作る．
これができるまで他の機能は一切動かないので最優先で行う．

## 対象
- [ ] maps テーブルの作成
- [ ] pins テーブルの作成
- [ ] map-images バケットの作成
- [ ] アクセス制御（RLS）の設定
- [ ] アプリから読み書きできることの確認

## 実装内容

Supabaseの管理画面 → 左メニューの「SQL Editor」を開き，
以下をそのまま貼り付けて実行する．

```sql
-- マップ（1枚の画像＝1つのマップ）
create table maps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  image_url text,
  created_at timestamptz not null default now()
);

-- ピン（マップ上の1点）
create table pins (
  id uuid primary key default gen_random_uuid(),
  map_id uuid not null references maps(id) on delete cascade,
  x double precision not null,  -- 画像に対する割合 0〜1
  y double precision not null,  -- 画像に対する割合 0〜1
  title text not null,
  content text default '',
  pin_type text default 'default',
  created_at timestamptz not null default now()
);

-- マップごとのピン取得を速くする
create index pins_map_id_idx on pins(map_id);

-- 画像を置くバケット（公開設定）
insert into storage.buckets (id, name, public)
values ('map-images', 'map-images', true);

-- アクセス制御を有効にする
alter table maps enable row level security;
alter table pins enable row level security;

-- ログイン機能を作らないので，誰でも読み書きできるようにする
create policy "read_all"   on maps for select using (true);
create policy "insert_all" on maps for insert with check (true);
create policy "update_all" on maps for update using (true);

create policy "read_all"   on pins for select using (true);
create policy "insert_all" on pins for insert with check (true);
create policy "update_all" on pins for update using (true);
create policy "delete_all" on pins for delete using (true);

-- 画像の読み書き
create policy "image_read"   on storage.objects
  for select using (bucket_id = 'map-images');
create policy "image_insert" on storage.objects
  for insert with check (bucket_id = 'map-images');
```

## 完了条件
- Supabaseの Table Editor で maps と pins が見える
- Storage に map-images バケットが見える
- アプリから `supabase.from("maps").select("*")` を実行して
  エラーにならない（空配列が返ればOK）

## 備考
maps には削除のポリシーを**わざと入れていない**．
誤操作でマップごと消えると復旧できないため．
必要になったら後から追加する．
````

---

## B. マップ一覧を表示する

**難易度：易**
**ファイル：`src/pages/MapList.jsx`**
**前提：A**

````markdown
## 概要
トップページ（/）に，作成済みのマップを一覧で表示する．

## 対象
- [ ] Supabase から maps を取得する
- [ ] カード形式で並べる（サムネイル・タイトル・説明）
- [ ] クリックで /maps/:id に移動する
- [ ] 1件もないときの表示
- [ ] 読み込み中の表示

## 実装内容

`src/pages/MapList.jsx` を編集する．

データの取得：

```js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const [maps, setMaps] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  supabase
    .from("maps")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error) console.error(error);
      setMaps(data ?? []);
      setLoading(false);
    });
}, []);
```

表示は Tailwind のグリッドで3列程度．
各カードは `<Link to={`/maps/${map.id}`}>` で包む．
サムネイルは `map.image_url` を `<img>` で表示し，
`image_url` が null のときはグレーの箱を出す．

## 完了条件
- マップが0件のとき「まだマップがありません」と出る
- 1件以上あるとき，カードが並ぶ
- カードをクリックすると詳細ページに移動する
- 読み込み中に「読み込み中...」が出る

## 備考
新規作成ボタンはヘッダー（App.jsx）に既にあるので追加不要．
````

---

## C. 新しいマップを作成する（画像アップロード込み）

**難易度：難**（このMVPで一番重い．経験者向け）
**ファイル：`src/pages/MapUpload.jsx`**
**前提：A**

````markdown
## 概要
タイトル・説明を入力し，画像をアップロードして新しいマップを作る．
画像は Supabase Storage に保存し，そのURLを maps.image_url に入れる．

## 対象
- [ ] タイトル・説明の入力フォーム
- [ ] 画像ファイルの選択
- [ ] 選んだ画像のプレビュー表示
- [ ] アップロード前に画像を縮小する
- [ ] Storage へアップロード
- [ ] maps テーブルに登録
- [ ] 完了したら /maps/:id へ移動
- [ ] アップロード中の表示とエラー表示

## 実装内容

`src/pages/MapUpload.jsx` を編集する．

### 1. 画像の縮小（必須）

スマホ写真は1枚3〜5MBある．そのまま上げると無料枠を数日で
使い切り，発表当日に画像が出なくなる．必ず縮小してから上げる．

```js
async function shrinkImage(file, maxSize = 1600) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85)
  );
}
```

### 2. アップロードと登録

```js
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

async function handleSubmit(file, title, description) {
  const blob = await shrinkImage(file);
  const path = `${crypto.randomUUID()}.jpg`;

  const { error: upErr } = await supabase.storage
    .from("map-images")
    .upload(path, blob, { contentType: "image/jpeg" });
  if (upErr) throw upErr;

  const { data: urlData } = supabase.storage
    .from("map-images")
    .getPublicUrl(path);

  const { data, error } = await supabase
    .from("maps")
    .insert({ title, description, image_url: urlData.publicUrl })
    .select()
    .single();
  if (error) throw error;

  navigate(`/maps/${data.id}`);
}
```

`.select().single()` を付けないと，作成したマップのIDが返ってこない．
これがないと移動先が分からないので必須．

## 完了条件
- タイトル未入力では送信できない
- 画像を選ぶとプレビューが出る
- 送信中はボタンが押せなくなり「アップロード中...」が出る
- 完了すると作成したマップの詳細ページへ移動する
- 失敗したら画面にエラーメッセージが出る
  （コンソールだけに出して終わらない）
- アップロード後，Supabaseの Storage に1600px以下の画像が入っている

## 備考
画像は正方形とは限らないので，プレビューは object-contain で表示する．
````

---

## D. マップ詳細ページを組み立てる

**難易度：中**
**ファイル：`src/pages/MapDetail.jsx`**
**前提：A（EとFと並行して進められる）**

````markdown
## 概要
URLのIDから対象のマップとピンを取得し，MapView に渡して表示する．
このページが，他の人が作った部品を組み立てる場所になる．

## 対象
- [ ] URLの :id からマップを1件取得
- [ ] そのマップのピンを取得
- [ ] MapView に渡す
- [ ] 存在しないIDのときの表示
- [ ] 読み込み中の表示

## 実装内容

`src/pages/MapDetail.jsx` を編集する．

```js
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { MapView } from "../components/MapView";

const { id } = useParams();
const [map, setMap] = useState(null);
const [pins, setPins] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function load() {
    const { data: m } = await supabase
      .from("maps").select("*").eq("id", id).single();
    const { data: p } = await supabase
      .from("pins").select("*").eq("map_id", id)
      .order("created_at");
    setMap(m);
    setPins(p ?? []);
    setLoading(false);
  }
  load();
}, [id]);
```

ピンが追加・削除されたときに再取得できるよう，
load 関数を子コンポーネントに渡せる形にしておく．

## 完了条件
- 既存のマップIDでアクセスすると，画像とピンが表示される
- 存在しないIDのとき「マップが見つかりません」と出る（真っ白にしない）
- 読み込み中の表示が出る

## 備考
この Issue が「保存されたピンを他のユーザーも閲覧できる」を
実現する部分にあたる．**別のブラウザで同じURLを開いて
同じピンが見えること**を必ず確認すること．
````

---

## E. 画像を表示してピンを描画する

**難易度：中**
**ファイル：`src/components/MapView.jsx`**
**前提：A**

````markdown
## 概要
マップ画像を表示し，その上にピンを重ねて表示する．
座標は「画像に対する割合（0〜1）」で受け取る．

## 対象
- [ ] 画像を画面に収まるサイズで表示
- [ ] ピンを正しい位置に重ねる
- [ ] ピンをクリックしたら onPinClick を呼ぶ
- [ ] 画像がないマップのときの表示

## 実装内容

`src/components/MapView.jsx` を編集する．
受け取る props は既に決まっているので変えないこと．

```jsx
<div className="relative inline-block">
  <img src={map.image_url} alt={map.title}
       className="max-h-full max-w-full object-contain" />
  {pins.map((pin) => (
    <button
      key={pin.id}
      onClick={() => onPinClick?.(pin)}
      className="absolute -translate-x-1/2 -translate-y-full text-2xl"
      style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
    >
      📍
    </button>
  ))}
</div>
```

**重要な注意が2つある．**

1. ピンを載せる箱と画像のサイズを一致させること．
   箱が画像より大きいと，パーセント指定の基準がずれて
   ピンが実際の位置からずれる．画像を包む div は
   inline-block にして画像と同じ大きさにする．

2. `-translate-x-1/2 -translate-y-full` は，ピンの
   「先端」が座標を指すようにするためのもの．
   これがないとピンの左上が座標になり，見た目がずれる．

## 完了条件
- 画像が画面からはみ出さずに表示される
- ブラウザの幅を変えてもピンが画像の同じ場所に留まる
- ピンをクリックすると onPinClick が呼ばれる（console.log で確認）

## 備考
拡大縮小やドラッグ移動はこの Issue では作らない．
必要になったら別Issueで Leaflet の導入を検討する．
````

---

## F. 画像をクリックしてピンを作る

**難易度：難**
**ファイル：`src/components/MapView.jsx` と `src/components/PinPanel.jsx`**
**前提：E（同じファイルを触るので E の完了後に着手）**

````markdown
## 概要
画像の好きな場所をクリックすると入力欄が開き，
タイトルと本文を入れて保存すると，その位置にピンが立つ．

## 対象
- [ ] 画像クリックで座標（0〜1）を計算する
- [ ] タイトル・本文の入力パネルを出す
- [ ] pins テーブルに保存する
- [ ] 保存後すぐ画面にピンが出る
- [ ] キャンセルできる

## 実装内容

### 1. クリック位置を割合に直す（MapView.jsx）

```js
function handleImageClick(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  onMapClick?.(x, y);
}
```

`getBoundingClientRect()` は画像の**表示サイズ**を返す．
元画像のピクセルサイズではないので，どんな大きさで表示していても
同じ割合になる．これが割合で保存する理由．

### 2. 入力パネル（PinPanel.jsx を新規作成）

props は次の形にする．

- `pin`：表示中のピン（新規作成中は座標だけ入った仮オブジェクト）
- `onSave`：`{ title, content }` を受け取って保存する
- `onClose`：閉じる

画面右側または下部に固定表示する．

### 3. 保存

```js
const { data, error } = await supabase
  .from("pins")
  .insert({ map_id: mapId, x, y, title, content, pin_type: "default" })
  .select()
  .single();
```

保存できたら MapDetail の再取得を呼ぶか，
返ってきた data を pins に追加して即座に表示する．

## 完了条件
- 画像をクリックすると入力パネルが開く
- タイトルを入れて保存すると，クリックした位置にピンが立つ
- ページをリロードしてもピンが残っている
- 別のブラウザで同じURLを開いても同じピンが見える
- キャンセルするとピンは作られない

## 備考
既にあるピンをクリックしたときは，新規作成ではなく
そのピンの内容を表示すること（E の onPinClick と繋げる）．
````

---

## G. マップのURLを共有できるようにする

**難易度：易**
**ファイル：`src/pages/MapDetail.jsx`**
**前提：D**

````markdown
## 概要
マップ詳細ページに，URLをコピーするボタンを置く．

## 対象
- [ ] 「URLをコピー」ボタンを設置
- [ ] クリックでクリップボードにコピー
- [ ] コピーできたことを画面で知らせる

## 実装内容

ルーティングは既に /maps/:id で動いているので，
URL自体は何もしなくても共有できる状態にある．
このIssueで作るのはコピーボタンだけ．

```js
async function copyUrl() {
  await navigator.clipboard.writeText(window.location.href);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}
```

## 完了条件
- ボタンを押すとURLがコピーされる
- 「コピーしました」が2秒間表示される
- コピーしたURLを別のブラウザで開くと同じマップが見える

## 備考
navigator.clipboard は https か localhost でしか動かない．
Vercel上でもローカルでも動くので問題ないが，
社内LANのIPアドレス直打ちなどでは動かない点に注意．
````

---

## H. ピンを削除できるようにする

**難易度：易**
**ファイル：`src/components/PinPanel.jsx`**
**前提：F**

````markdown
## 概要
間違えて置いたピンを消せるようにする．

## 対象
- [ ] ピン詳細パネルに削除ボタンを置く
- [ ] 確認してから削除する
- [ ] 削除後すぐ画面から消える

## 実装内容

```js
const { error } = await supabase.from("pins").delete().eq("id", pin.id);
```

削除前に `window.confirm` で確認を挟む．

## 完了条件
- 削除ボタンを押すと確認が出る
- OKするとピンが画面から消える
- リロードしても復活しない

## 備考
本来は「余裕があれば」の機能だが，**デモ中の誤クリック対策として
MVPに入れる．** 発表本番で間違ったピンが消せないと詰む．
編集機能は不要で，削除だけでよい．
````

---

## I. 読み込み中とエラーの表示を揃える

**難易度：易**
**ファイル：`src/components/` に新規**
**前提：なし（いつでも着手可能）**

````markdown
## 概要
各ページでバラバラに書かれる「読み込み中」「エラー」の表示を
共通の部品にまとめる．

## 対象
- [ ] Loading コンポーネント
- [ ] ErrorMessage コンポーネント
- [ ] 各ページで使う

## 実装内容

`src/components/Loading.jsx` と `src/components/ErrorMessage.jsx`
を作り，各ページの読み込み中・エラー時にそれを表示する．

## 完了条件
- 3つのページすべてで同じ見た目の読み込み表示が出る
- Supabaseの通信に失敗したとき，画面にエラーが出る
  （コンソールだけに出して画面が真っ白，という状態をなくす）

## 備考
地味だが，**アップロードに数秒かかる間に何も出ないと
「壊れた」と見える．** デモの印象に直結する．
初心者が最初に取り組むタスクとして適している．
````

---

# 3. 着手順と割り当ての提案

## 依存関係

```
A（Supabase設定）  ← 全ての前提．これが終わるまで誰も進めない
 ├─ B（マップ一覧）      独立
 ├─ C（作成・アップロード） 独立
 ├─ E（画像とピンの表示）  独立
 │   └─ F（クリックでピン作成） Eの完了待ち（同じファイル）
 │       └─ H（ピン削除）      Fの完了待ち
 └─ D（詳細ページ）      EとFの成果を組み立てる
     └─ G（URL共有）      Dの完了待ち

I（ローディング表示）  いつでも着手可能
```

## 進め方

**まずAを1人が最優先で片付けます．** これが終わらないと全員が待ち状態になります．

Aの完了後は，**B・C・E・I** の4つを同時に進められます．

**F** はEの完了待ちです．同じ `MapView.jsx` を触るので，並行させるとコンフリクトします．

**D** は中盤以降，**G と H** は仕上げです．

## 難易度の分布

**Cが最も重く，次がFです．** この2つは経験のある2人に割り当ててください．

**B・G・H・I は初心者向け**です．特にIは，Supabaseの設定を待たずに着手できるので，最初の1つとして適しています．

**A・D・E は中程度**で，調べながら進められる人向けです．

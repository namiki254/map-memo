import { createClient } from "@supabase/supabase-js";

/**
 * Supabase クライアント．
 *
 * 環境変数は .env.local に書きます．必要な項目は .env.example を見てください．
 *
 * Vite では環境変数名を必ず VITE_ で始める必要があり，
 * 読み出しは process.env ではなく import.meta.env です．
 * AI が NEXT_PUBLIC_ や process.env を使うコードを出してきたら，それは Next.js 用の書き方です．
 *
 * ここで使うのは anon（publishable）キーだけです．
 * service_role（secret）キーは全権限を持つので，絶対にここへ書かないでください．
 *
 * 注意：Supabase のプロジェクトがまだ存在しないため，このファイルは現時点でどこからも
 * import されていません．プロジェクトが用意できたら .env.local を作って使い始めてください．
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    "Supabase の環境変数が未設定です．.env.local に VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を書いてください．",
  );
}

export const supabase = createClient(url, key);

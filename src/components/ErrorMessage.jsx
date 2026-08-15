export default function ErrorMessage({ message }) {
    return (
        <div className="my-4 rounded-md bg-red-50 p-4 border border-red-200 text-red-700">
            <p className="font-bold">エラーが発生しました</p>
            <p className="mt-1 text-sm">{message || "予期せぬエラーが発生しました。"}</p>
        </div>
    );
}
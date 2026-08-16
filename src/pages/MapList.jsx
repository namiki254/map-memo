import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function MapList() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMaps() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("maps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      setMaps(data ?? []);
      setLoading(false);
    }

    fetchMaps();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (maps.length === 0) {
    return <p className="p-6">まだマップがありません</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800">マップ一覧</h2>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {maps.map((map) => (
          <Link
            key={map.id}
            to={`/maps/${map.id}`}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            {map.image_url ? (
              <img
                src={map.image_url}
                alt={map.title}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="h-40 w-full bg-slate-200" />
            )}

            <div className="p-4">
              <h3 className="font-bold text-slate-800">{map.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {map.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
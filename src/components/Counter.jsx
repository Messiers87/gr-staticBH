// ViewCounter.js
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ViewCounter({ slug = "home" }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const viewedKey = `viewed-${slug}`;

    if (sessionStorage.getItem(viewedKey)) {
      console.log(`[ViewCounter] Already viewed '${slug}' in this session.`);
      fetchCount(); 
      return;
    }

    async function fetchCount() {
      const { data, error } = await supabase
        .from("page_views")
        .select("count")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("[ViewCounter] Fetch error:", error.message);
      } else {
        setCount(data?.count ?? 0);
      }
    }

    async function incrementAndFetch() {
      console.log("[ViewCounter] Incrementing view count via RPC...");

      const { error } = await supabase.rpc("increment_view", {
        slug_input: slug,
      });

      if (error) {
        console.error("[ViewCounter] RPC error:", error.message);
        return;
      }

      sessionStorage.setItem(viewedKey, "true");
      await fetchCount();
    }

    incrementAndFetch();
  }, [slug]);

  return (
    <div style={{
      position: 'absolute',
      left: 10,
      bottom: 10,
      color: '#ccc',
      background: 'rgba(0,0,0,0.4)',
      padding: '5px 10px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 1000
    }}>
      Views: {count !== null ? count : 'Loading...'}
    </div>
  );
}

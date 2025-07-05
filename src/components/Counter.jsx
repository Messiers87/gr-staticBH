import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ViewCounter({ slug = 'blackhole-visualization' }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const viewedKey = `viewed-${slug}`;

    async function fetchCountOnly() {
      const { data, error } = await supabase
        .from('page_views')
        .select('count')
        .eq('slug', slug)
        .single();

      if (data) {
        setCount(data.count);
      } else {
        console.error('[ViewCounter] Fetch error:', error.message);
      }
    }

    async function updateViews() {
      try {
        // Try to fetch the row
        let { data, error } = await supabase
          .from('page_views')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error && error.code === 'PGRST116') {
          // No row exists — create new
          const { data: inserted, error: insertError } = await supabase
            .from('page_views')
            .insert([{ slug, count: 1 }])
            .select()
            .single();

          if (insertError) throw insertError;
          setCount(inserted.count);
        } else if (data) {
          const updatedCount = data.count + 1;
          const { data: updated, error: updateError } = await supabase
            .from('page_views')
            .update({ count: updatedCount })
            .eq('slug', slug)
            .select()
            .single();

          if (updateError) throw updateError;
          setCount(updated.count);
        }

        sessionStorage.setItem(viewedKey, 'true');
      } catch (err) {
        console.error('[ViewCounter] Error updating views:', err.message);
      }
    }

    if (sessionStorage.getItem(viewedKey)) {
      console.log(`[ViewCounter] Already viewed '${slug}' in this session.`);
      fetchCountOnly(); // fetch even if already viewed
    } else {
      updateViews(); // increment + fetch
    }
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
      fontSize: '14px'
    }}>
      Views: {count !== null ? count : 'Loading...'}
    </div>
  );
}

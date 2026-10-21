'use client';

// Put this at hooks/useRegisteredCreators.ts
// Requires the list_creators() SQL function to exist in Supabase.

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

export interface RegisteredCreator {
    id: string;
    name: string;
    initials: string;
    joinedAt: string | null;
}

export function useRegisteredCreators() {
    const [creators, setCreators] = useState<RegisteredCreator[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const { data, error } = await supabase.rpc('list_creators');
            if (cancelled) return;

            if (error) {
                console.error('list_creators failed:', error);
                setError(error.message);
            } else {
                setCreators(
                    (data ?? []).map((row: any) => {
                        const name =
                            [row.first_name, row.last_name].filter(Boolean).join(' ') || 'Unnamed creator';
                        return {
                            id: row.id,
                            name,
                            initials: name
                                .split(' ')
                                .map((w: string) => w[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2),
                            joinedAt: row.joined_at ?? null,
                        };
                    })
                );
            }
            setLoading(false);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return { creators, loading, error };
}
'use client';

/**
 * ProfileAvatar
 * - Shows the logged-in user's uploaded profile photo (users.avatar_url).
 * - Falls back to their Google photo, then to initials.
 * - When `editable` is true, clicking it opens a file picker and uploads
 *   the new photo to the Supabase Storage bucket "avatars".
 * - After an upload, every ProfileAvatar on the page (sidebar + navbar)
 *   updates instantly via the "fewsion:avatar-updated" browser event.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';

const AVATAR_EVENT = 'fewsion:avatar-updated';
const BUCKET = 'avatars';
const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ProfileAvatarProps {
    initials: string;
    size?: number; // in px
    editable?: boolean;
    className?: string; // classes for the initials fallback circle
}

export function ProfileAvatar({
    initials,
    size = 36,
    editable = false,
    className = 'bg-gradient-to-br from-[oklch(0.8_0.16_75)] to-[oklch(0.72_0.18_45)] text-black',
}: ProfileAvatarProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load the saved photo once
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user || cancelled) return;

            const { data } = await supabase
                .from('users')
                .select('avatar_url')
                .eq('id', user.id)
                .maybeSingle();

            const url =
                data?.avatar_url ||
                user.user_metadata?.avatar_url || // Google / LinkedIn login photo
                user.user_metadata?.picture ||
                null;

            if (!cancelled) {
                setAvatarUrl(url);
                setImgFailed(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Stay in sync when the photo is changed anywhere on the page
    useEffect(() => {
        const onUpdate = (e: Event) => {
            setAvatarUrl((e as CustomEvent<string>).detail);
            setImgFailed(false);
        };
        window.addEventListener(AVATAR_EVENT, onUpdate);
        return () => window.removeEventListener(AVATAR_EVENT, onUpdate);
    }, []);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // let the same file be picked again later
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert('Please choose a JPG, PNG or WebP image.');
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`Image is too large. Please keep it under ${MAX_SIZE_MB} MB.`);
            return;
        }

        setUploading(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('You are not logged in.');

            const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `avatar-${Date.now()}.${ext}`;
            const path = `${user.id}/${fileName}`;

            // 1. Upload the image
            const { error: uploadError } = await supabase.storage
                .from(BUCKET)
                .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
            if (uploadError) throw uploadError;

            // 2. Get its public link
            const {
                data: { publicUrl },
            } = supabase.storage.from(BUCKET).getPublicUrl(path);

            // 3. Save the link on the user's row
            const { error: dbError } = await supabase
                .from('users')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);
            if (dbError) throw dbError;

            // 4. Clean up older photos of this user (not critical if it fails)
            const { data: oldFiles } = await supabase.storage.from(BUCKET).list(user.id);
            const toDelete = (oldFiles ?? [])
                .filter((f) => f.name !== fileName)
                .map((f) => `${user.id}/${f.name}`);
            if (toDelete.length) await supabase.storage.from(BUCKET).remove(toDelete);

            // 5. Update every avatar on the page
            setAvatarUrl(publicUrl);
            setImgFailed(false);
            window.dispatchEvent(new CustomEvent(AVATAR_EVENT, { detail: publicUrl }));
        } catch (err: any) {
            console.error('Avatar upload failed:', err);
            alert(`Could not upload photo: ${err?.message || 'unknown error'}`);
        } finally {
            setUploading(false);
        }
    };

    const showImage = avatarUrl && !imgFailed;

    const circle = (
        <div
            className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-extrabold uppercase ${showImage ? 'bg-[oklch(0.2_0.02_80)]' : className
                }`}
            style={{ width: size, height: size, fontSize: Math.max(10, size * 0.33) }}
        >
            {showImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={avatarUrl!}
                    alt="Profile photo"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                />
            ) : (
                <span>{initials || 'U'}</span>
            )}

            {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 size={size * 0.45} className="animate-spin text-white" />
                </div>
            )}
        </div>
    );

    if (!editable) return circle;

    return (
        <>
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Change profile photo"
                aria-label="Change profile photo"
                className="group relative shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.8_0.16_75)]"
            >
                {circle}
                {/* Dark overlay on hover */}
                {!uploading && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                        <Camera size={size * 0.4} className="text-white" />
                    </span>
                )}
                {/* Small camera badge, always visible so people know it's clickable */}
                <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[oklch(0.12_0.01_80)] bg-[oklch(0.8_0.16_75)]">
                    <Camera size={8} className="text-black" />
                </span>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                className="hidden"
                onChange={handleFile}
            />
        </>
    );
}

export default ProfileAvatar;
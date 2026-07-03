'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'wn_saved_jobs';
const EVENT = 'wn-saved-jobs-changed';

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function writeSaved(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
  window.dispatchEvent(new Event(EVENT));
}

// Browser-local job bookmarks — no login needed.
export function useSavedJobs() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const sync = () => setSaved(readSaved());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isSaved = useCallback(
    (slug) => saved.some((j) => j.slug === slug),
    [saved]
  );

  const toggleSave = useCallback((job) => {
    if (!job || !job.slug) return;
    const list = readSaved();
    const exists = list.some((j) => j.slug === job.slug);
    const next = exists
      ? list.filter((j) => j.slug !== job.slug)
      : [
          {
            slug: job.slug,
            title: job.title || '',
            org: job.org || '',
            category: job.category || '',
            savedAt: new Date().toISOString(),
          },
          ...list,
        ].slice(0, 200);
    writeSaved(next);
  }, []);

  const removeSaved = useCallback((slug) => {
    writeSaved(readSaved().filter((j) => j.slug !== slug));
  }, []);

  return { saved, isSaved, toggleSave, removeSaved };
}

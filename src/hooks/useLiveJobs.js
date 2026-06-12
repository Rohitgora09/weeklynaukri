import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useLiveJobs(force = false) {
  const [data, setData] = useState({ latestJobs: [], admitCards: [], results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async (isForced = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/jobs${isForced ? '?force=true' : ''}`;
      const res = await api.get(url);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        throw new Error(res.error || 'Failed to fetch job lists');
      }
    } catch (err) {
      console.error("useLiveJobs error:", err);
      setError(err.message || 'Something went wrong while loading live jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(force);
  }, []);

  return {
    ...data,
    loading,
    error,
    refresh: () => fetchJobs(true)
  };
}

import { useEffect, useCallback, useRef, useState } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number; // milliseconds
  enabled?: boolean;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export const useAutoSave = <T>({
  data,
  onSave,
  delay = 30000, // 30 seconds default
  enabled = true,
  onSaveSuccess,
  onSaveError
}: UseAutoSaveOptions<T>) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef<T>(data);

  const save = useCallback(async () => {
    if (!enabled || isSaving) return;

    try {
      setIsSaving(true);
      setError(null);
      await onSave(data);
      setLastSaved(new Date());
      onSaveSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Auto-save failed');
      setError(error.message);
      onSaveError?.(error);
    } finally {
      setIsSaving(false);
    }
  }, [data, enabled, isSaving, onSave, onSaveSuccess, onSaveError]);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(save, delay);
  }, [save, delay]);

  // Auto-save when data changes
  useEffect(() => {
    const hasChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current);
    if (hasChanged && enabled) {
      lastDataRef.current = data;
      debouncedSave();
    }
  }, [data, enabled, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save();
  }, [save]);

  const hasUnsavedChanges = JSON.stringify(data) !== JSON.stringify(lastDataRef.current) && !isSaving;

  return {
    isSaving,
    lastSaved,
    error,
    forceSave,
    hasUnsavedChanges
  };
};
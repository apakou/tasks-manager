import { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/utils';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => 
    getFromLocalStorage(key, defaultValue)
  );

  useEffect(() => {
    saveToLocalStorage(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
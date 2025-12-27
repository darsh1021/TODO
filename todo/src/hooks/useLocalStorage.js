import { useState, useEffect, useRef } from "react";

const useLocalStorage = (key, initialValue, userId) => {
  // 🔒 Freeze key forever (NO re-computation)
  const storageKeyRef = useRef(
    userId ? `${key}-${userId}` : key
  );

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKeyRef.current);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // ✅ Write ONLY when value changes
  useEffect(() => {
    localStorage.setItem(
      storageKeyRef.current,
      JSON.stringify(value)
    );
  }, [value]);

  return [value, setValue];
};

export default useLocalStorage;

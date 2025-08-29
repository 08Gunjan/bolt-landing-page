import { useState, useEffect } from 'react';

export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setCopyError(null);
    } catch (err) {
      setIsCopied(false);
      setCopyError(err as Error);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Reset isCopied after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return { isCopied, copyError, copyToClipboard };
}

import { useEffect, useState } from "react";

type Props = {
  value: string;
  delay: number;
};

export default function useDebounce({ value, delay }: Props) {
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

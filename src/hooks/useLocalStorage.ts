import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item !== null ? (JSON.parse(item) as T) : initial;
        } catch {
            return initial;
        }
    });

    useEffect(() => {
        if (value === null || value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue] as const;
}
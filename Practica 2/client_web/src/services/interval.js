import { useRef, useEffect } from "react";

export const useInterval = (callback, delay) => {
    const savedCallback = useRef();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        let id = setInterval(()=>{
            savedCallback.current();
        }, delay);
        return () => clearInterval(id);
    }, [delay]);
}
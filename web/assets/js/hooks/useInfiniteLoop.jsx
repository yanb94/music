import React, {useEffect, useRef, useState} from "react";

export default function useInfiniteLoop({loadMore, stopLoad})
{
    const containerRef = useRef(null)

    const options = {
        root: null,
        rootMargin: "0px",
        threshold:1.0
    }

    const callbackFunction = (entries) => {
        const [ entry ] = entries
        if(entry.isIntersecting)
        {
            loadMore()
        }
    }

    useEffect(() => {
    
        const observer = new IntersectionObserver(callbackFunction, options)
        if (stopLoad() && containerRef.current) observer.observe(containerRef.current)
        
        return () => {
          if(containerRef && containerRef.current) observer.unobserve(containerRef.current)
        }
    }, [containerRef, options])

    return [containerRef]
}
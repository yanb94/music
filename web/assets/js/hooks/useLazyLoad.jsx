import React, {useEffect, useRef} from "react";

export default function useLazyLoad()
{
    const containerRef = useRef(null)

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: .25
    }

    const callbackFunction = (entries) => {
        const [ entry ] = entries
        if(entry.isIntersecting && entry.target.hasAttribute('data-src'))
        {
            const target = entry.target;
            const dataSrc = target.getAttribute('data-src')
            target.setAttribute('src',dataSrc);
            target.removeAttribute('data-src')
        }
    }

    useEffect(() => {
    
        const observer = new IntersectionObserver(callbackFunction, options)
        if (containerRef.current && containerRef.current.hasAttribute('data-src')) observer.observe(containerRef.current)
        
        return () => {
          if(containerRef && containerRef.current) observer.unobserve(containerRef.current)
        }
    }, [containerRef, options])

    return [containerRef]
}
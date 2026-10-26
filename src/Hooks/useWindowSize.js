import { useEffect, useState } from "react";

function useWindowSize(){
    const[width,setWidth]=useState(window.innerWidth)

    useEffect(()=>{
        function HandleResize(){
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize',HandleResize)
        return()=>{
            window.removeEventListener('resize',HandleResize)
        }
    },[])
    return {width}
}
export default  useWindowSize;
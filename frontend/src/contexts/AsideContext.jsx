/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react"


const AsideContext = createContext()

export function AsideProvider({children}){

    const [collapsed, setCollapsed] = useState(window.innerWidth < 768)

    return (
        <AsideContext.Provider value={{collapsed, setCollapsed}}>
            {children}
        </AsideContext.Provider>
    )
}

export const useAside = () => useContext(AsideContext)
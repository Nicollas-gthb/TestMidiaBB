import { createContext, useCallback, useContext, useState } from "react"
import { ToastContainer } from "../components/toast/Toast"


export const ToastContext = createContext()

export function ToastProvider({children}){
    
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((mensagem, tipo = "sucesso") => {
        const id = Date.now()

        setToasts(prev => [...prev, {id, mensagem, tipo}])

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)

    }, [])


    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast}/>
        </ToastContext.Provider>
    )
}

export function useToast(){
    return useContext(ToastContext)
}
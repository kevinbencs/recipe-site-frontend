import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type userData = {
    userName: string,
    setName: (val: string) => void,
    loading: boolean
}

const UserContext = createContext<userData | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userName, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('/getaccount')
        .then(data =>data.json())
        .then(res => {
            setName(res.name)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
        })

    }, [])



    return (
        <UserContext.Provider value={{ userName, setName, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useLogged = () => {
    const context = useContext(UserContext)
    if (context === undefined)
        throw new Error('useLogged must be use in isLoggedProvider.')

    return context
}
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useSWR from "swr";

type userData = {
    userName: string,
    setName: (val: string) => void
}

const UserContext = createContext<userData | undefined>(undefined);

const fetcher = async (url: string): Promise<{ name: string }> => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error();
        error.cause = res.json().then((data: { error: string }) => data.error)
        console.error(error.cause);
        throw error;
    }

    return res.json()
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userName, setName] = useState<string>('');

    const { data, error, isLoading } = useSWR('/getaccount', fetcher)

    useEffect(() => {
        if (data) {
            setName(data.name)
        }
    }, [data])

    return (
        <UserContext.Provider value={{ userName, setName }}>
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
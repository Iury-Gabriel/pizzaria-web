
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";

type AuthContextData = {
    user: UserProps
    isAuthenticated: boolean
    signIn: (credentials: SignInProps) => Promise<void>
    signOut: () => void
    signUp: (credentials: SignUpProps) => Promise<void>
}

type UserProps = {
    name: string;
    email: string;
    id: string;
}

type SignInProps = {
    email: string
    password: string
}

type AuthProviderProps = {
    children: ReactNode
}

type SignUpProps = {
    name: string
    email: string
    password: string
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        window.location.href = '/'
    } catch (error) {
        console.log(error)
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({} as UserProps)
    const isAuthenticated = !!user;

    useEffect(() => {
        const { '@nextauth.token': token } = parseCookies();

        if (token) {
            api.get('/me').then(response => {
                const { id, name, email } = response.data;
                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                signOut();
            })
        }

    }, [])
    
    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            })

            console.log(response.data)

            const { id, name, token } = response.data

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })

            setUser({
                id,
                name,
                email
            })

            api.defaults.headers['Authorization'] = `${token}`

            toast.success('Login realizado com sucesso!')

            window.location.href = '/dashboard'
            
        } catch (error) {
            console.log(error)
            toast.error('Email ou senha incorretos!')
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success('Conta criada com sucesso!')

            window.location.href = '/'
        } catch (error) {
            toast.error('Erro ao criar conta!')
            console.log(error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}
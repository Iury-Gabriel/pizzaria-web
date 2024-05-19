import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";
import { signOut } from "../contexts/AuthContext";
import { GetServerSidePropsContext } from "next";

export function setupAPIClient(ctx: GetServerSidePropsContext | undefined = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'https://api-pizzaria-gzls.onrender.com',
        headers: {
            Authorization: `${cookies['@nextauth.token']}`
        }
    });

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                signOut();
            } else {
                return Promise.reject(new AuthTokenError());
            }
        }

        return Promise.reject(error);
    });

    return api;
}

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export function canSSRAuth<P extends { [key: string]: any }>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies['@nextauth.token'];

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            };
        }

        try {
            const result = await fn(ctx);

            if (!result) {
                throw new Error("No result from getServerSideProps");
            }

            return result;
        } catch (err) {
            if (err instanceof AuthTokenError) {
                destroyCookie(ctx, '@nextauth.token');
                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                };
            }

            return {
                props: {} as P 
            };
        }
    };
}

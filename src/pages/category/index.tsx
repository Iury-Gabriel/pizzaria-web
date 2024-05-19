import styles from './styles.module.scss'

import { Header } from '../../components/Header'
import Head from 'next/head'
import { FormEvent, useState } from 'react'
import { setupAPIClient } from '@/src/services/api'
import { toast } from 'react-toastify'
import { canSSRAuth } from '@/src/utils/canSSRAuth'

export default function Category() {
    const [name, setName] = useState('')
    
    async function handleRegister(event: FormEvent) {
        event.preventDefault()

        if(name === '') {
            return
        }

        const apClient = setupAPIClient()

        await apClient.post('/category', {
            name: name
        })

        toast.success('Cadastrado com sucesso!')

        setName('')
    }

    return (
        <>
            <Head>
                <title>Nova categoria | Sujeito Pizzaria</title>
            </Head>

            <div>
                <Header />
                
                <main className={styles.container}>
                    <h1>Cadastrar categorias</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <input
                            placeholder="Digite o nome da categoria"
                            type='text'
                            className={styles.input}
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />

                        <button className={styles.buttonAdd} type='submit'>Cadastrar</button>
                    
                    </form>
                </main>
            </div>

        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})
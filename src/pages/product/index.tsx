import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '@/src/components/Header';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { FiUpload } from 'react-icons/fi';
import { ChangeEvent, FormEvent, useState } from 'react';
import { setupAPIClient } from '@/src/services/api';
import { toast } from 'react-toastify';

type ItemsProps = {
    id: string;
    name: string;
}

interface CategoryProps {
    categoryList: ItemsProps[];
}

export default function Product({ categoryList }: CategoryProps) {
    console.log(categoryList);

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState<File | null>(null);

    const [categories, setCategories] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState(0);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const image = e.target.files[0];

        if (image && (image.type === 'image/jpeg' || image.type === 'image/png')) {
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(image));
        }
    }

    const handleRegister = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const data = new FormData();

            if (name === '' || price === '' || description === '' || imageAvatar === null) {
                toast.error('Preencha todos os campos');
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            const apiClient = setupAPIClient();

            await apiClient.post('/product', data);

            toast.success('Cadastrado com sucesso');

            setName('');
            setPrice('');
            setDescription('');
            setAvatarUrl('');
            setImageAvatar(null);
        } catch (error) {
            console.log(error);
            toast.error('Erro ao cadastrar');
        }
    }

    return (
        <>
            <Head>
                <title>Novo produto | Sujeito Pizzaria</title>
            </Head>

            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Novo produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={25} color='#FFF' />
                            </span>

                            <input type="file" accept="image/png, image/jpeg" onChange={handleChange} />

                            {avatarUrl && (
                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Foto do usuário"
                                    width={250}
                                    height={250}
                                />
                            )}
                        </label>

                        <select value={categorySelected} onChange={(e) => setCategorySelected(Number(e.target.value))}>
                            {categories.map((category, index) => {
                                return (
                                    <option value={index} key={category.id}>
                                        {category.name}
                                    </option>
                                );
                            })}
                        </select>

                        <input
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Digite o preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder="Descreva seu produto"
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button type="submit" className={styles.buttonAdd}>
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/categories');

    return {
        props: {
            categoryList: response.data
        }
    };
});

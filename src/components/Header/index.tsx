import Link from 'next/link';
import styles from './styles.module.scss';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '@/src/contexts/AuthContext';
import { useContext } from 'react';

export function Header() {
    const { signOut } = useContext(AuthContext)

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <img src="/logo.svg" alt="Logo Pizzaria" width={190} height={60} />
                </Link>

                <nav className={styles.menuItems}>
                    <Link href="/category">
                        Categoria
                    </Link>

                    <Link href="/product">
                        Cardapio
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color="#fff" size={24} />
                    </button>
                </nav>
            </div>
        </header>
    )
}
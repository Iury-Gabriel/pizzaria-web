import { Header } from "@/src/components/Header"
import { canSSRAuth } from "@/src/utils/canSSRAuth"
import Head from "next/head"
import styles from "./styles.module.scss"
import { FiRefreshCcw } from "react-icons/fi"
import { setupAPIClient } from "@/src/services/api"
import { useState } from "react"

import Modal from "react-modal"
import { ModalOrder } from "@/src/components/ModalOrder"

type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
}

interface DashboardProps {
    orders: OrderProps[];
}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    Order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}

export default function Dashboard({ orders }: DashboardProps) {
    const [ordersList, setOrdersList] = useState(orders || [])

    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false)

    function closeModal() {
        setModalVisible(false)
    }

    async function handleOpenModalView(id: string) {
        const apiCLient = setupAPIClient()

        const response = await apiCLient.get('/order/detail', {
            params: {
                order_id: id
            }
        })

        setModalItem(response.data)
        setModalVisible(true)
    }

    async function handleFinishModal(id: string) {
        const apiClient = setupAPIClient()
        apiClient.put('/order/finish', {
            order_id: id
        })

        const response = await apiClient.get('/orders')

        setOrdersList(response.data)

        setModalVisible(false)
    }

    const handleRefreshorders = async () => {
        const apiClient = setupAPIClient()
        const response = await apiClient.get('/orders')
        setOrdersList(response.data)
    }

    Modal.setAppElement("#__next")

    return (
        <>
            <Head>
                <title>Painel | Pizzaria</title>                
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>

                        <button onClick={handleRefreshorders}>
                            <FiRefreshCcw size={25} color="#3fffa3" />
                        </button>

                    </div>

                    <article className={styles.listOrders}>
                        {ordersList.length === 0 && (
                            <span className={styles.emptyList}>
                                Nenhum pedido em andamento
                            </span>
                        )}

                        {ordersList.map(order => (
                            <section key={order.id} className={styles.order}>
                                <button className={styles.buttonOrder} onClick={() => handleOpenModalView(order.id)}>
                                    <span className={styles.tag}></span>
                                    <span>Mesa {order.table}</span>
                                </button>
                            </section>
                        ))}
                    </article>
                </main>

                {modalVisible && modalItem && (
                    <ModalOrder
                        isOpen={modalVisible}
                        order={modalItem}
                        onRequestClose={closeModal}
                        handleFinishOrder={ handleFinishModal }
                    />
                )}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/orders');

    return {
        props: {
            orders: response.data
        }
    }
})
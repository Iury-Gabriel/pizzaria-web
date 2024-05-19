import styles from './styles.module.scss'

import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Input({...rest}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <input className={styles.input} {...rest}/>
        </div>
    )
}

export function TextArea({...rest}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <textarea className={styles.input} {...rest}/>
        </div>
    )
}
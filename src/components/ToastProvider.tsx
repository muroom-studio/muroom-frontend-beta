'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ToastContext = createContext((_message: string) => {});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const showToast = (newMessage: string) => {
        setMessage(newMessage);
        setIsVisible(true);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div
                className={`
                fixed z-50 left-1/2 -translate-x-1/2
                bg-gray-700 text-base-s-12-1 text-white
                px-3 py-3 rounded-lg shadow-lg
                transition-all duration-500 ease-in-out
                ${isVisible ? 'bottom-10 opacity-100' : 'bottom-[-100px] opacity-0'}
            `}
            >
                <span>{message}</span>
            </div>
        </ToastContext.Provider>
    );
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    onSuccess?: () => void;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    children: React.ReactNode;
}

export default function LoadingButton({ isLoading: externalLoading, onClick, children, className = '', ...props }: Props) {
    const [isInternalSuccess, setIsInternalSuccess] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (externalLoading || isInternalSuccess) return;

        if (onClick) {
            await onClick(e);
            // Trigger success state
            setIsInternalSuccess(true);
            setTimeout(() => setIsInternalSuccess(false), 2000);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={externalLoading || isInternalSuccess}
            className={`
        relative overflow-hidden flex items-center justify-center gap-2
        bg-gradient-to-r from-blue-600 to-violet-600 text-white
        font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30
        hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed
        ${className}
      `}
            {...props}
        >
            <AnimatePresence mode="wait">
                {externalLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute inset-0 flex items-center justify-center bg-inherit"
                    >
                        <Loader2 className="animate-spin" size={20} />
                    </motion.div>
                ) : isInternalSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center bg-green-500"
                    >
                        <Check size={20} />
                    </motion.div>
                ) : (
                    <motion.span
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                    >
                        {children}
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}

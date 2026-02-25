import { motion } from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        y: 16,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1], // custom ease-out-expo curve
        },
    },
    exit: {
        opacity: 0,
        y: -12,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

export const PageTransition = ({ children }) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ width: "100%", height: "100%" }}
        >
            {children}
        </motion.div>
    );
};

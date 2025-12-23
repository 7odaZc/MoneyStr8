import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const PAGE_EASE = [0.2, 0.8, 0.2, 1];

export default function PageTransition({ children, className = "" }) {
  const reduceMotion = useReducedMotion();
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.4, ease: PAGE_EASE };

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "initial"}
      animate="animate"
      exit={reduceMotion ? undefined : "exit"}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

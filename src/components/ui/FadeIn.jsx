import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.2, 0.8, 0.2, 1];

export default function FadeIn({
  children,
  index = 0,
  className = "",
  delayStep = 0.06,
  offsetY = 12,
}) {
  const reduceMotion = useReducedMotion();
  const variants = {
    hidden: { opacity: 0, y: offsetY },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: EASE,
        delay: reduceMotion ? 0 : i * delayStep,
      },
    }),
  };

  return (
    <motion.div
      className={className}
      custom={index}
      variants={variants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

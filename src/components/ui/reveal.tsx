"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article";
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Gentle single-shot reveal. Disabled entirely when the visitor prefers reduced motion. */
export function Reveal({ children, className, delay = 0, y = 14, as = "div" }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = (as === "li" ? motion.li : as === "article" ? motion.article : motion.div) as typeof motion.div;

  if (reduceMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

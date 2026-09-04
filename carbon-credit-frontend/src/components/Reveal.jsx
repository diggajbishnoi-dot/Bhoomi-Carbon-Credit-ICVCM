import { motion } from 'framer-motion';

/**
 * Wraps children in a fade + slide-up animation that triggers once,
 * when the element scrolls into view. Use `delay` to stagger siblings.
 */
export default function Reveal({ children, delay = 0, y = 20, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

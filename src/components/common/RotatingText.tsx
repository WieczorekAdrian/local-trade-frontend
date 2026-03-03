import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["bezpiecznie", "korzystnie", "nowocześnie"];

export const RotatingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="translate-y-[0.2px] inline-flex items-baseline h-[1em] relative overflow-hidden w-[290px] text-left ml-1 md:ml-0 align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          /* KLUCZ: Usunęliśmy absolute, daliśmy relative i inline-block.
           Dzięki temu słowo 'bezpiecznie' raportuje swoją wysokość do h1!
        */
          className="relative inline-block text-primary font-bold whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

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
    <span className="translate-y-[0.5px] inline-flex items-center justify-start h-[1.5em] relative w-[290px] text-left ml-1 md:ml-0 align-middle [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative inline-block text-primary font-bold whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

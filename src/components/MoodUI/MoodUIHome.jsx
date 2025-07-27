import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const text = "DichtM"; 
function MoodUIHome() {
    
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    //   onFinish(); // Notify parent that loading is done
    }, 3000); // 3 seconds
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black flex justify-center items-center z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex space-x-2 text-white text-5xl font-bold tracking-widest">
            {[...text].map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MoodUIHome

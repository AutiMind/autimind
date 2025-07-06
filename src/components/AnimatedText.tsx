import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedText = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="mb-8"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <motion.h1 
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        variants={itemVariants}
      >
        <span className="block bg-gradient-to-r from-teal-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
          Built with Purpose.
        </span>
        <motion.span 
          className="block bg-gradient-to-r from-orange-400 via-red-400 to-teal-400 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Evolving with Vision.
        </motion.span>
      </motion.h1>
    </motion.div>
  );
};

export default AnimatedText;
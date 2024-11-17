'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Layer 1 - Deepest wave  */}
        <motion.path
          d="M0,150 Q180,180 360,150 T720,150 T1080,150 T1440,150 V400 H0 Z"
          fill="rgba(0, 0, 0, 0.08)"
          initial={{ y: 40 }}
          animate={{
            y: [40, 20, 40],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />

        {/* Layer 2 - Back wave */}
        <motion.path
          d="M0,180 Q360,100 720,180 T1440,180 V400 H0 Z"
          fill="rgba(0, 0, 0, 0.03)"
          initial={{ y: 50 }}
          animate={{
            y: [50, 30, 50],
            transition: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />

        {/* Layer 3 - Middle wave  */}
        <motion.path
          d="M0,220 Q240,160 480,220 T960,220 T1440,220 V400 H0 Z"
          fill="rgba(0, 0, 0, 0.04)"
          style={{ mixBlendMode: 'multiply' }}
          initial={{ y: 30 }}
          animate={{
            y: [30, 50, 30],
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }
          }}
        />

        {/* Layer 4 - Accent wave */}
        <motion.path
          d="M0,200 Q480,150 960,200 T1440,200 V400 H0 Z"
          fill="rgba(0, 0, 0, 0.1)"
          style={{ mixBlendMode: 'multiply' }}
          initial={{ y: 25 }}
          animate={{
            y: [25, 45, 25],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }
          }}
        />

        {/* Layer 5 - Front wave  */}
        <motion.path
          d="M0,260 Q180,240 360,260 T720,260 T1080,260 T1440,260 V400 H0 Z"
          fill="rgba(0, 0, 0, 0.02)"
          style={{ mixBlendMode: 'multiply' }}
          initial={{ y: 20 }}
          animate={{
            y: [20, 40, 20],
            transition: {
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }
          }}
        />

        {/* Layer 6 - Subtle accent wave  */}
        <motion.path
          d="M0,240 Q360,220 720,240 T1440,240 V400 H0 Z"
          fill="rgba(0, 0, 0, 0.06)"
          style={{ mixBlendMode: 'multiply' }}
          initial={{ y: 15 }}
          animate={{
            y: [15, 35, 15],
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }
          }}
        />

        {/* Decorative lines với animation chậm hơn */}
        <motion.path
          d="M-200,150 C480,100 960,200 1640,150"
          fill="none"
          stroke="rgba(0, 0, 0, 0.15)"
          strokeWidth="1.5"
          initial={{ opacity: 0, x: -2000 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [-2000, 0, 2000, 2000],
            transition: {
              duration: 8,
              repeat: Infinity,
              repeatDelay: 2,
              times: [0, 0.2, 0.8, 1],
              ease: "easeInOut"
            }
          }}
        />
        
        <motion.path
          d="M-200,180 C480,220 960,140 1640,180"
          fill="none"
          stroke="rgba(0, 0, 0, 0.21)"
          strokeWidth="1"
          initial={{ opacity: 0, x: 2000 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [2000, 0, -2000, -2000],
            transition: {
              duration: 5,
              repeat: Infinity,
              repeatDelay: 1.5,
              times: [0, 0.2, 0.8, 1],
              ease: "easeInOut",
              delay: 2
            }
          }}
        />

        <motion.path
          d="M-200,165 C480,195 960,135 1640,165"
          fill="none"
          stroke="rgba(0, 0, 0, 0.18)"
          strokeWidth="1.2"
          initial={{ opacity: 0, x: -2000 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [-2000, 0, 2000, 2000],
            transition: {
              duration: 6.5,
              repeat: Infinity,
              repeatDelay: 1.8,
              times: [0, 0.2, 0.8, 1],
              ease: "easeInOut",
              delay: 1
            }
          }}
        />

        <motion.path
          d="M-200,195 C480,165 960,205 1640,195"
          fill="none"
          stroke="rgba(0, 0, 0, 0.12)"
          strokeWidth="1.3"
          initial={{ opacity: 0, x: 2000 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [2000, 0, -2000, -2000],
            transition: {
              duration: 6,
              repeat: Infinity,
              repeatDelay: 1.2,
              times: [0, 0.2, 0.8, 1],
              ease: "easeInOut",
              delay: 3
            }
          }}
        />
      </svg>
    </div>
  )
} 
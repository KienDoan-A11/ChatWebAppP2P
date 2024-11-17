'use client'

import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import messageAnimation from '../../public/Message.json' 

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-64 h-64" // Điều chỉnh kích thước theo ý muốn
        >
          <Lottie
            animationData={messageAnimation}
            loop={true}
            autoplay={true}
          />
        </motion.div>

        {/* Dots loading animation */}
        <div className="flex space-x-2 mt-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-gray-600 rounded-full"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 
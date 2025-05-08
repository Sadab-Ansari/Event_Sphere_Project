"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function FlipBox() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-40 h-40">
        <motion.div
          className="absolute w-full h-full rounded-2xl shadow-lg flex items-center justify-center cursor-pointer"
          style={{
            backgroundColor: flipped ? "green" : "red",
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={() => setFlipped(!flipped)}
          >
            <RotateCcw size={20} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
`$(process.env.NEXT_PUBLIC_API_URL)/api/traffic/data`;

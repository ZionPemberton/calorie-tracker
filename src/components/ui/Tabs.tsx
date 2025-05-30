// components/ui/Tabs.tsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Tab = {
    label: string;
    content: React.ReactNode;
};

type TabsProps = {
    tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="w-full">
            <div className="flex justify-center space-x-4 mb-4">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`px-4 py-2 rounded transition ${idx === activeIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="w-full"> 
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }} //this is to make the seemless transition between tabs!
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {tabs[activeIndex].content}
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    );
}

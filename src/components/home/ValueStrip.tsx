'use client';

import React from 'react';
import { Target, Zap, Eye, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ValueStrip() {
  const { t } = useLanguage();

  const differentiators = [
    {
      icon: Target,
      title: t('trust1Title'),
      description: t('trust1Desc')
    },
    {
      icon: Zap,
      title: t('trust2Title'),
      description: t('trust2Desc')
    },
    {
      icon: Eye,
      title: t('trust3Title'),
      description: t('trust3Desc')
    },
    {
      icon: HeartHandshake,
      title: t('trust4Title'),
      description: t('trust4Desc')
    }
  ];

  return (
    <section className="bg-[#FAF9F6] py-12 border-b border-[#171512]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white transition-colors duration-300 border border-transparent hover:border-[#171512]/5"
              >
                <div className="w-10 h-10 rounded-full bg-[#748C8C]/15 text-[#748C8C] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#171512] font-sans-ui whitespace-nowrap">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6F6255] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

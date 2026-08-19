'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '@/data/testimonials';
import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] border-y border-[#171512]/10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A2234]">
            TÉMOIGNAGES CLIENTS
          </span>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-light text-[#171512] leading-tight">
            Ce que disent nos propriétaires & locataires.
          </h2>
          <p className="text-sm text-[#6F6255] font-light">
            Une confiance accordée au quotidien pour la gestion et la valorisation de leur patrimoine immobilier à Bordeaux.
          </p>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testi, idx) => (
            <motion.div
              key={testi.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white rounded-2xl p-8 border border-[#171512]/10 shadow-sm flex flex-col justify-between space-y-6 relative"
            >
              <Quote className="w-8 h-8 text-[#7A2234]/20 absolute top-6 right-6" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 text-[#7A2234]">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="font-serif-display text-lg text-[#171512] italic leading-relaxed">
                  « {testi.quote} »
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-[#171512]/5 flex items-center space-x-3">
                {testi.image && (
                  <img
                    src={testi.image}
                    alt={testi.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#171512]/10"
                  />
                )}
                <div>
                  <h3 className="text-sm font-semibold text-[#171512] flex items-center space-x-1.5">
                    <span>{testi.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7A2234]" />
                  </h3>
                  <p className="text-[11px] text-[#6F6255]">{testi.role} — {testi.location}</p>
                  <span className="inline-block mt-0.5 text-[10px] bg-[#FAF9F6] text-[#7A2234] font-medium px-2 py-0.5 rounded-full border border-[#171512]/5">
                    {testi.propertyType}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

'use client'

import { Button } from '@/components/ui/button'
import { Target, Award, DollarSign, Shield } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/languageContext'

export function About() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Award,
      title: t.about.expertise,
      description: t.about.expertiseDesc,
    },
    {
      icon: DollarSign,
      title: t.about.competitivePrices,
      description: t.about.competitivePricesDesc,
    },
    {
      icon: Shield,
      title: t.about.confidentiality,
      description: t.about.confidentialityDesc,
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                <Target className="w-4 h-4" />
                {t.about.badge}
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-slate-100 leading-tight">
                {t.about.title}
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
                <p>{t.about.intro}</p>
                
                <div className="pl-8 border-l-4 border-orange-500 py-4">
                  <p className="font-semibold text-gray-900 dark:text-slate-100 text-xl mb-3">{t.about.aimTitle}</p>
                  <p>{t.about.aimText}</p>
                </div>
              </div>

              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-orange-600 hover:to-orange-700 text-white rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                <Link href="#contact">{t.about.getInTouch}</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gray-50 dark:bg-slate-800 rounded-2xl p-10 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-600 group-hover:bg-orange-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors duration-300">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-base">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
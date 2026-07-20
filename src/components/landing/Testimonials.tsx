"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "@/lib/icon-map";
import { useTestimonials } from "@/hooks/useTestimonials";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function Testimonials() {
  const { data: reviews = [] } = useTestimonials();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative py-12 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            What Our Patients Say
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Real feedback from people who transformed their healthcare experience.
          </p>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={cardVariants}
              whileHover={{ scale: 1.01, y: -4, transition: { duration: 0.2 } }}
              className="relative rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6 sm:p-8 transition-all duration-200 group"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-[var(--color-secondary)]/10 dark:text-[var(--color-secondary)]/15" />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${
                      j < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/20 px-2.5 py-0.5 text-[10px] font-medium text-[var(--color-secondary)]">
                  {review.condition}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] text-xs font-bold text-white">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {review.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(review.date)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

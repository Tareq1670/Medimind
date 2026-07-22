"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Star, Quote } from "@/lib/icon-map";
import { useTestimonials } from "@/hooks/useTestimonials";

import "swiper/css";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Testimonials() {
  const { data: reviews = [] } = useTestimonials();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const totalSlides = reviews.length;
  const progressPct = totalSlides > 1 ? (activeIndex / (totalSlides - 1)) * 100 : 100;

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

        <div className="mt-10">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            grabCursor
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={handleSlideChange}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="select-none"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <motion.div
                  whileHover={{ scale: 1.01, y: -4, transition: { duration: 0.2 } }}
                  className="relative h-full rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6 sm:p-8 transition-all duration-200 group"
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
              </SwiperSlide>
            ))}
          </Swiper>

          {totalSlides > 1 && (
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="relative flex-1 h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-heading text-xs font-semibold text-slate-400 dark:text-slate-500 tabular-nums tracking-wider">
                {String(activeIndex + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(totalSlides).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

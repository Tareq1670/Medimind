"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Star, Eye, Pill as PillIcon } from "lucide-react";
import { Skeleton } from "@heroui/react";
import { useFeaturedMedicines } from "@/hooks/useFeaturedMedicines";

import "swiper/css";

export function FeaturedMedicines() {
  const { data: medicines = [], isLoading } = useFeaturedMedicines();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = medicines.length;

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const handleDotClick = useCallback((index: number) => {
    swiperRef.current?.slideTo(index);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative py-12 md:py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Featured Medicines
            </h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Trusted medications from verified pharmaceutical partners.
            </p>
          </div>
          <Link
            href="/medicines"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] dark:text-[var(--color-secondary)] hover:underline"
          >
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-900/80"
                >
                  <Skeleton className="h-48 w-full rounded-none">
                    <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                  </Skeleton>
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4 rounded-lg">
                      <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                    </Skeleton>
                    <Skeleton className="h-4 w-1/2 rounded-lg">
                      <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                    </Skeleton>
                    <Skeleton className="h-4 w-2/3 rounded-lg">
                      <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                    </Skeleton>
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-6 w-16 rounded-lg">
                        <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                      </Skeleton>
                      <Skeleton className="h-9 w-24 rounded-[var(--radius-button)]">
                        <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                      </Skeleton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : medicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PillIcon className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No medicines available right now.</p>
            </div>
          ) : (
            <div>
              <Swiper
                modules={[Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                grabCursor
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={handleSlideChange}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 24 },
                }}
                className="!pb-2 select-none"
              >
                {medicines.map((med) => (
                  <SwiperSlide key={med.id}>
                    <div className="group relative h-full rounded-[var(--radius-card)] bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.2)] dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] hover:border-[var(--color-primary)]/20 dark:hover:border-[var(--color-primary)]/10 hover:-translate-y-1.5">
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/40 to-teal-50 dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-900">
                        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 dark:bg-white/[0.03]" />
                        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[var(--color-secondary)]/5 dark:bg-white/[0.03]" />
                        <div className="flex h-full w-full items-center justify-center">
                          <PillIcon className="h-14 w-14 text-[var(--color-primary)]/15 dark:text-white/[0.07] transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:text-[var(--color-primary)]/25 dark:group-hover:text-white/[0.12]" />
                        </div>
                        {med.isPrescriptionRequired && (
                          <span className="absolute top-3 left-3 rounded-full bg-white/80 dark:bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm">
                            RX
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col justify-between p-5">
                        <div>
                          <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50 line-clamp-1">
                            {med.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {med.genericName}
                          </p>
                          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                            {med.manufacturer}
                          </p>
                          <div className="mt-2.5 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`h-3.5 w-3.5 ${
                                  j < Math.floor(med.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                              {med.rating}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-heading text-lg font-bold text-slate-900 dark:text-slate-50">
                            ${med.price.toFixed(2)}
                          </span>
                          <Link
                            href={`/medicines/${med.id}`}
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-primary)]/90 hover:shadow-md active:scale-95"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {totalSlides > 1 && (
                <div className="mt-8 flex items-center justify-center">
                  <div className="relative flex items-center gap-1.5">
                    {Array.from({ length: totalSlides }).map((_, i) => {
                      const isActive = i === activeIndex;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleDotClick(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          className={`relative rounded-full transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
                            isActive
                              ? "w-8 h-2 bg-[var(--color-primary)] dark:bg-[var(--color-secondary)]"
                              : "w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                          }`}
                        >
                          <span className="sr-only">Slide {i + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/medicines"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] dark:text-[var(--color-secondary)] hover:underline"
          >
            View All Medicines <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

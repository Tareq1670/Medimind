"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Star, CalendarDays, BadgeCheck, Stethoscope } from "@/lib/icon-map";
import { Skeleton } from "@heroui/react";
import { useDoctors } from "@/hooks/useDoctors";

import "swiper/css";

export function DoctorRoster() {
  const { data: doctors = [], isLoading } = useDoctors();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = doctors.length;

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const pad = (n: number) => String(n + 1).padStart(2, "0");

  const progressPct =
    totalSlides > 1 ? (activeIndex / (totalSlides - 1)) * 100 : 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Verified Healthcare Professionals
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Board-certified specialists available for online and in-person consultations.
          </p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-900/80">
                  <Skeleton className="h-40 w-full rounded-none">
                    <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                  </Skeleton>
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-2/3 rounded-lg">
                      <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                    </Skeleton>
                    <Skeleton className="h-4 w-1/2 rounded-lg">
                      <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                    </Skeleton>
                    <Skeleton className="h-4 w-3/4 rounded-lg">
                      <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                    </Skeleton>
                    <div className="flex items-center justify-between pt-1">
                      <Skeleton className="h-6 w-16 rounded-lg">
                        <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                      </Skeleton>
                      <Skeleton className="h-9 w-32 rounded-[var(--radius-button)]">
                        <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
                      </Skeleton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
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
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={handleSlideChange}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 24 },
                }}
                className="select-none"
              >
                {doctors.map((doc) => (
                  <SwiperSlide key={doc.id}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="card-doctor rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 overflow-hidden transition-all duration-200 group"
                    >
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[var(--color-secondary)]/10 to-[var(--color-primary)]/10 dark:from-slate-800 dark:to-slate-900">
                        <div className="flex h-full items-center justify-center">
                          <Stethoscope className="h-14 w-14 text-[var(--color-secondary)]/20 dark:text-[var(--color-secondary)]/15" />
                        </div>
                        {doc.isVerified && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                            <BadgeCheck className="h-3 w-3" />
                            Verified
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent h-16" />
                        <div className="absolute bottom-3 left-4">
                          <p className="text-sm font-semibold text-white drop-shadow-sm">
                            {doc.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <div className="inline-flex items-center rounded-md bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 px-2.5 py-1 text-xs font-medium text-[var(--color-primary)] dark:text-[var(--color-primary)]">
                            {doc.specialty}
                          </div>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {doc.hospitalAffiliation}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {doc.experienceYears} years experience
                          </p>
                          <div className="mt-2 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`h-3.5 w-3.5 ${
                                  j < Math.floor(doc.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                              {doc.rating}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-heading text-lg font-bold text-slate-900 dark:text-slate-50">
                            ${doc.consultationFee}
                            <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                              /visit
                            </span>
                          </span>
                          <Link
                            href={`/doctors/${doc.id}`}
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-button)] bg-[var(--color-secondary)] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-secondary)]/90 hover:shadow-md active:scale-95"
                          >
                            <CalendarDays className="h-3.5 w-3.5" />
                            Book Appointment
                          </Link>
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
                    {pad(activeIndex)}&thinsp;/&thinsp;{pad(totalSlides - 1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

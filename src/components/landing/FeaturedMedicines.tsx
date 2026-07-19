"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Star, Eye, Pill as PillIcon } from "lucide-react";
import { Skeleton } from "@heroui/react";
import { useFeaturedMedicines } from "@/hooks/useFeaturedMedicines";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export function FeaturedMedicines() {
  const { data: medicines = [], isLoading } = useFeaturedMedicines();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative py-12 md:py-20"
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
                <div key={i} className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-900/80">
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
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="!pb-12"
            >
              {medicines.map((med) => (
                <SwiperSlide key={med.id}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="card-medicine rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 overflow-hidden transition-all duration-200 group"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 dark:from-slate-800 dark:to-slate-900">
                      <div className="flex h-full items-center justify-center">
                        <PillIcon className="h-12 w-12 text-[var(--color-primary)]/20 dark:text-[var(--color-secondary)]/20" />
                      </div>
                      {med.isPrescriptionRequired && (
                        <span className="absolute top-3 left-3 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                          RX
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4">
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
                        <div className="mt-2 flex items-center gap-1">
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
                      <div className="mt-3 flex items-center justify-between">
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
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <div className="mt-6 text-center sm:hidden">
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

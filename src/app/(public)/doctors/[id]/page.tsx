"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useDoctor } from "@/hooks/useDoctorsList";
import { StarRating, LoadingSpinner } from "@/components/shared";
import { Stethoscope, UserCheck, Phone, MapPin, Clock, ChevronLeft, CalendarDays } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

const TAB_KEYS = ["about", "services", "schedule", "reviews"] as const;
type TabKey = (typeof TAB_KEYS)[number];
const TAB_LABELS: Record<TabKey, string> = {
  about: "About",
  services: "Services",
  schedule: "Schedule",
  reviews: "Reviews",
};

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: doctor, isLoading, isError } = useDoctor(id);
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading doctor profile..." />
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Stethoscope className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">Doctor Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The doctor you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/doctors" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/doctors" className="hover:text-primary transition-colors">Doctors</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{doctor.name}</span>
      </nav>

      <div className="card-standard overflow-hidden mb-8">
        <div className="relative h-48 bg-gradient-to-br from-accent/10 to-primary/10">
          {doctor.isVerified && (
            <span className="absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>
        <div className="px-6 pb-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-28 h-28 rounded-2xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden flex items-center justify-center">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-primary">{doctor.name?.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 pt-2">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {doctor.name}
              </h1>
              <p className="text-primary font-medium">{doctor.specialty}</p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={doctor.rating || 0} size="sm" showValue />
                <span className="text-xs text-slate-400">({doctor.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="card-standard p-4 text-center">
              <p className="text-2xl font-bold text-primary">{doctor.experienceYears}+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Years Experience</p>
            </div>
            <div className="card-standard p-4 text-center">
              <p className="text-2xl font-bold text-primary">{doctor.reviewCount || 0}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Patient Reviews</p>
            </div>
            <div className="card-standard p-4 text-center">
              <p className="text-2xl font-bold text-primary">{doctor.rating?.toFixed(1)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Rating</p>
            </div>
            <div className="card-standard p-4 text-center">
              <p className="text-2xl font-bold text-primary">${doctor.consultationFee?.toFixed(0)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consultation Fee</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-0 -mb-px overflow-x-auto">
              {TAB_KEYS.map((key) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={cn("px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                    activeTab === key ? "border-primary text-primary" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
                  )}
                >
                  {TAB_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {activeTab === "about" && (
              <div>
                {doctor.bio && (
                  <div className="card-standard p-6 mb-4">
                    <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Biography</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{doctor.bio}</p>
                  </div>
                )}
                {doctor.education && (
                  <div className="card-standard p-6 mb-4">
                    <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Education</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{doctor.education}</p>
                  </div>
                )}
                <div className="card-standard p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Hospital Affiliation</h3>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    {doctor.hospitalAffiliation || "Not specified"}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "services" && (
              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Services</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {doctor.specialty ? `Specialized in ${doctor.specialty} with ${doctor.experienceYears} years of experience.` : "Service details not available."}
                </p>
              </div>
            )}
            {activeTab === "schedule" && (
              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Availability Schedule</h3>
                {doctor.availability && doctor.availability.length > 0 ? (
                  <div className="space-y-2">
                    {doctor.availability.map((slot, i) => (
                      <div key={i} className={cn(
                        "flex items-center justify-between p-3 rounded-lg border text-sm",
                        slot.isAvailable ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50",
                      )}>
                        <div className="flex items-center gap-2">
                          <CalendarDays className={cn("w-4 h-4", slot.isAvailable ? "text-green-600" : "text-slate-400")} />
                          <span className={cn("font-medium", slot.isAvailable ? "text-slate-900 dark:text-white" : "text-slate-400")}>{slot.day}</span>
                        </div>
                        {slot.isAvailable ? (
                          <span className="text-xs text-green-600 dark:text-green-400">{slot.startTime} - {slot.endTime}</span>
                        ) : (
                          <span className="text-xs text-slate-400">Unavailable</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Schedule information not available.</p>
                )}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Patient Reviews</h3>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">{doctor.rating?.toFixed(1)}</span>
                  <div>
                    <StarRating rating={doctor.rating || 0} size="md" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Based on {doctor.reviewCount || 0} reviews</p>
                  </div>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-4">Review functionality coming soon.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card-standard p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Contact</h3>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              Contact via hospital
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              {doctor.hospitalAffiliation || "Not specified"}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              {doctor.experienceYears} years experience
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-2xl font-bold text-primary mb-1">${doctor.consultationFee?.toFixed(0)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Consultation fee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

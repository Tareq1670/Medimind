"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { post } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  MessageSquareText,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Instagram,
} from "@/lib/icon-map";
import { cn } from "@/lib/utils";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be under 2000 characters"),
});

type ContactInput = z.infer<typeof ContactSchema>;

const subjects = [
  "General Inquiry",
  "Technical Support",
  "Partnership Opportunity",
  "Bug Report",
  "Feature Request",
  "Medical Accuracy Concern",
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "hello@medimind.dev",
    sub: "We respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+1 (555) 123-4567",
    sub: "Mon–Fri, 9 AM – 6 PM PT",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "San Francisco, CA",
    sub: "Telehealth-first platform",
  },
];

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      await post("/contact", data);
      setIsSubmitted(true);
      reset();
      toast.success("Message sent! We'll get back to you soon.", {
      style: {
        borderRadius: "var(--radius-button)",
        background: "var(--toast-success-bg)",
        color: "var(--toast-success-color)",
        border: "1px solid var(--toast-success-border)",
      },
      iconTheme: {
        primary: "var(--toast-success-color)",
        secondary: "var(--toast-success-bg)",
      },
    });
    setTimeout(() => setIsSubmitted(false), 4000);
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const renderError = (msg: string | undefined) =>
    msg ? (
      <p className="mt-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400">{msg}</p>
    ) : null;

  return (
    <>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative pt-28 pb-4 md:pt-32 md:pb-6 text-center"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-[var(--color-secondary)]/5 dark:bg-[var(--color-secondary)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-secondary)]">
            <MessageSquareText className="h-3 w-3" />
            Contact Us
          </span>

          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Let&apos;s Talk
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
            Have a question, feedback, or partnership idea? We&apos;d love to
            hear from you. Our team typically responds within one business day.
          </p>
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative py-10 md:py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contactInfo.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
                className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 flex flex-col items-center text-center p-6"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] shadow-lg">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--color-primary)]">
                  {item.detail}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {item.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Form + Sidebar */}
      <section className="relative pb-12 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <div className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-sm">
                    <Send className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-50">
                      Send a Message
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Fields marked with * are required
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="space-y-1">
                          <label
                            htmlFor="contact-name"
                            className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400"
                          >
                            Full Name *
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            placeholder="Jane Doe"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            className={cn(
                              "w-full rounded-xl border bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 dark:bg-slate-800/40",
                              fieldState.invalid
                                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-300/20 dark:border-red-700"
                                : "border-slate-200 dark:border-slate-700 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:focus:ring-[var(--color-secondary)]/20"
                            )}
                          />
                          {renderError(fieldState.error?.message)}
                        </div>
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div className="space-y-1">
                          <label
                            htmlFor="contact-email"
                            className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400"
                          >
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                            <input
                              id="contact-email"
                              type="email"
                              placeholder="jane@example.com"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              className={cn(
                                "w-full rounded-xl border bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 dark:bg-slate-800/40",
                                fieldState.invalid
                                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-300/20 dark:border-red-700"
                                  : "border-slate-200 dark:border-slate-700 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:focus:ring-[var(--color-secondary)]/20"
                              )}
                            />
                          </div>
                          {renderError(fieldState.error?.message)}
                        </div>
                      )}
                    />
                  </div>

                  {/* Subject */}
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-1">
                        <label
                          htmlFor="contact-subject"
                          className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400"
                        >
                          Subject *
                        </label>
                        <div className="relative">
                          <select
                            id="contact-subject"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            className={cn(
                              "w-full appearance-none rounded-xl border bg-slate-50/50 px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-white outline-none transition-all duration-200 dark:bg-slate-800/40",
                              fieldState.invalid
                                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-300/20 dark:border-red-700"
                                : "border-slate-200 dark:border-slate-700 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:focus:ring-[var(--color-secondary)]/20"
                            )}
                          >
                            <option value="" disabled>
                              Select a subject...
                            </option>
                            {subjects.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {renderError(fieldState.error?.message)}
                      </div>
                    )}
                  />

                  {/* Message */}
                  <Controller
                    name="message"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="contact-message"
                            className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400"
                          >
                            Message *
                          </label>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {field.value.length}/2000
                          </span>
                        </div>
                        <textarea
                          id="contact-message"
                          rows={5}
                          placeholder="Tell us how we can help..."
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className={cn(
                            "w-full resize-none rounded-xl border bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all duration-200 dark:bg-slate-800/40",
                            fieldState.invalid
                              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-300/20 dark:border-red-700"
                              : "border-slate-200 dark:border-slate-700 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:focus:ring-[var(--color-secondary)]/20"
                          )}
                        />
                        {renderError(fieldState.error?.message)}
                      </div>
                    )}
                  />

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-[var(--radius-button)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                      isSubmitted
                        ? "bg-emerald-500 shadow-emerald-500/20"
                        : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] shadow-primary/20 dark:shadow-primary/10 hover:shadow-xl hover:shadow-primary/25"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Message Sent
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Response Time */}
              <div className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] shadow-sm">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Expected Response Time
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Within 24 hours on business days
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "General inquiries", time: "24 hours" },
                    { label: "Technical support", time: "12 hours" },
                    { label: "Urgent medical concerns", time: "4 hours" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6">
                <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  Common Questions
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "Is MediMind a replacement for my doctor?",
                      a: "No. MediMind provides AI-assisted insights to help you understand your health. All recommendations should be reviewed by a licensed professional.",
                    },
                    {
                      q: "Is my health data secure?",
                      a: "Yes. All data is encrypted end-to-end, stored on HIPAA-compliant infrastructure, and never sold to third parties.",
                    },
                    {
                      q: "Can I integrate MediMind with my hospital system?",
                      a: "We are working on FHIR-based integrations. Contact us for early access to our API.",
                    },
                  ].map((item) => (
                    <div key={item.q}>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {item.q}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6">
                <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 dark:hover:border-[var(--color-secondary)]/30 dark:hover:text-[var(--color-secondary)] dark:hover:bg-[var(--color-secondary)]/5"
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

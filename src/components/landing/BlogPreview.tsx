"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Clock, ArrowRight, BookText } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getReadTime(): string {
  return "5 min read";
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function BlogPreview() {
  const { data: blogs = [] } = useBlogs();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Latest Medical Articles
            </h2>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Expert-written guides and research summaries.
            </p>
          </div>
          <Link
            href="/blogs"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] dark:text-[var(--color-secondary)] hover:underline"
          >
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 overflow-hidden transition-all duration-200"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 dark:from-slate-800 dark:to-slate-900">
                <div className="flex h-full items-center justify-center">
                  <BookText className="h-14 w-14 text-[var(--color-primary)]/15 dark:text-[var(--color-secondary)]/15" />
                </div>
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 2 && (
                    <span className="rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      +{blog.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(blog.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getReadTime()}
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-base font-semibold text-slate-900 dark:text-slate-50 line-clamp-2 group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-secondary)] transition-colors duration-200">
                  {blog.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-[10px] font-bold text-white">
                      {blog.authorName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {blog.authorName}
                    </span>
                  </div>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    Read Article
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] dark:text-[var(--color-secondary)] hover:underline"
          >
            View All Articles <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

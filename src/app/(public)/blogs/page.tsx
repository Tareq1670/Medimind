"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBlogsList } from "@/hooks/useBlogsList";
import { useURLFilters } from "@/hooks/useURLFilters";
import { Pagination, EmptyState, ActiveFilters } from "@/components/shared";
import { Search, BookOpen, User, Clock, ArrowRight, Tags } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { LandingBlog } from "@/types";

const BLOGS_PER_PAGE = 9;

const CATEGORY_TABS = [
  { value: "", label: "All" },
  { value: "Allergies", label: "Allergies" },
  { value: "Gut Health", label: "Gut Health" },
  { value: "Mental Health", label: "Mental Health" },
  { value: "Heart", label: "Heart" },
  { value: "Skin Care", label: "Skin Care" },
  { value: "Diabetes", label: "Diabetes" },
];

const filterSchema = {
  search: { debounce: 300 },
  tag: {},
} as const;

function BlogCard({ blog }: { blog: LandingBlog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="card-standard overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <Image src={blog.coverImage} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex flex-col flex-1 p-4">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {blog.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">{tag}</span>
            ))}
          </div>
        )}
        <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug">{blog.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.authorName}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.date}</span>
          </div>
          <span className="text-primary group-hover:translate-x-0.5 transition-transform"><ArrowRight className="w-3.5 h-3.5" /></span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedBlogCard({ blog }: { blog: LandingBlog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="card-standard overflow-hidden group transition-all duration-300 hover:shadow-lg grid grid-cols-1 md:grid-cols-2">
      <div className="relative h-56 md:h-full min-h-[200px] bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        <Image src={blog.coverImage} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-6 md:p-8 flex flex-col justify-center">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-primary/10 text-primary">{tag}</span>
            ))}
          </div>
        )}
        <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-900 dark:text-white line-clamp-2">{blog.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {blog.authorName}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {blog.date}</span>
        </div>
      </div>
    </Link>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="card-standard overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2"><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16" /><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-20" /></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const { filters: f, page, set, setPage, resetAll, activeFilterCount } = useURLFilters(filterSchema);
  const [searchInput, setSearchInput] = useState(f.search);

  useEffect(() => { setSearchInput(f.search); }, [f.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== f.search) set("search", searchInput || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, f.search, set]);

  const search = f.search;
  const tag = f.tag;

  const filter = {
    search: search || undefined,
    tag: tag || undefined,
    status: "Published" as const,
    sortBy: "createdAt" as const,
    sortOrder: "desc" as const,
    page,
    limit: BLOGS_PER_PAGE,
  };

  const { data, isLoading, isError } = useBlogsList(filter);
  const blogs = data?.data || [];
  const pagination = data?.pagination;
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Health Articles</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Expert insights, health tips, and medical knowledge</p>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search articles..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search articles"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {CATEGORY_TABS.map((tab) => (
              <button key={tab.value} onClick={() => set("tag", tab.value || undefined)}
                className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                  tag === tab.value ? "bg-primary text-white border-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ActiveFilters
            totalCount={activeFilterCount}
            onClearAll={() => { resetAll(); setSearchInput(""); }}
            chips={[
              ...(search ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }] : []),
              ...(tag ? [{ key: "tag", label: "Tag", value: tag, onRemove: () => set("tag", undefined) }] : []),
            ]}
          />

          {isLoading ? (
            <div className="space-y-8">
              <div className="card-standard overflow-hidden animate-pulse grid grid-cols-1 md:grid-cols-2">
                <div className="h-56 bg-slate-200 dark:bg-slate-800" />
                <div className="p-6 space-y-3"><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-32" /><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" /><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
              </div>
            </div>
          ) : isError ? (
            <EmptyState icon={<BookOpen className="w-12 h-12" />} title="Failed to load articles" description="Something went wrong. Please try again later." />
          ) : blogs.length === 0 ? (
            <EmptyState icon={<BookOpen className="w-12 h-12" />} title="No articles found" description="Try adjusting your search or filter."
              action={<button onClick={() => { resetAll(); setSearchInput(""); }} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">Clear Filters</button>}
            />
          ) : (
            <>
              {featured && <div className="mb-8"><FeaturedBlogCard blog={featured} /></div>}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
                </div>
              )}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    perPage={BLOGS_PER_PAGE}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <div className="card-standard p-5">
            <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Tags className="w-4 h-4 text-primary" /> Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Allergies", "Gut Health", "Mental Health", "Heart", "Skin Care", "Diabetes", "Research", "AI Technology", "Treatment"].map((t) => (
                <button key={t} onClick={() => set("tag", t === tag ? undefined : t)}
                  className={cn("px-3 py-1 text-xs font-medium rounded-full transition-colors border",
                    tag === t ? "bg-primary text-white border-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="card-standard p-5">
            <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white mb-3">Health Tip of the Day</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Stay hydrated! Drinking at least 8 glasses of water daily helps maintain optimal body function, improves energy levels, and supports overall health.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

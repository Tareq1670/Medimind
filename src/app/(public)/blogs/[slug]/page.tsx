"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBlogDetail } from "@/hooks/useBlogsList";
import { LoadingSpinner } from "@/components/shared";
import { BookOpen, ChevronLeft, User, Clock, Eye } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { PopulatedUser } from "@/types";

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: blog, isLoading, isError } = useBlogDetail(slug);
  const [liked, setLiked] = useState(false);

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" text="Loading article..." /></div>;
  }

  if (isError || !blog) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">Article Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/blogs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>
    );
  }

  const authorData = blog.author && typeof blog.author === "object"
    ? (blog.author as PopulatedUser)
    : typeof blog.authorId === "object" && blog.authorId
    ? (blog.authorId as PopulatedUser)
    : null;
  const authorName = authorData?.name || "Unknown Author";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blogs" className="hover:text-primary transition-colors">Health Articles</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{blog.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          {blog.coverImage && (
            <div className="card-standard overflow-hidden mb-8">
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary/10 to-secondary/10">
                <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" />
              </div>
            </div>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
              ))}
            </div>
          )}

          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {authorName}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}</span>
            {blog.viewCount !== undefined && (
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {blog.viewCount} views</span>
            )}
          </div>

          <div className="mt-8 card-standard p-6 md:p-8">
            {blog.content ? (
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 italic">No content available for this article.</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button onClick={() => setLiked(!liked)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                liked ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
              )}
            >
              {liked ? "Liked" : "Like"}
            </button>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="card-standard p-5">
            <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white mb-4">Table of Contents</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary hover:underline">Introduction</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Key Points</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Summary</a></li>
            </ul>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="card-standard p-5">
              <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <Link key={i} href={`/blogs?tag=${tag}`}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="card-standard p-5">
            <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white mb-3">Author</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{authorName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Healthcare Writer</p>
              </div>
            </div>
          </div>

          <div className="card-standard p-5">
            <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white mb-3">Related Articles</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Related articles will appear here.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

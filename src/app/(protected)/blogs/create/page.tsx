"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateBlog } from "@/hooks/useBlogsList";
import { imageUploader } from "@/lib/imageUploader";
import { Sparkles, Loader2, X } from "@/lib/icon-map";
import toast from "react-hot-toast";

export default function CreateBlogPage() {
  const router = useRouter();
  const createBlog = useCreateBlog();

  const [form, setForm] = useState({
    title: "", content: "", excerpt: "", tags: "", coverImage: "", status: "Draft" as "Draft" | "Published",
  });
  const [uploading, setUploading] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiAudience, setAiAudience] = useState("general");
  const [aiTone, setAiTone] = useState("professional");
  const [aiLength, setAiLength] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const data = await imageUploader(file);
      update("coverImage", data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiTopic) { toast.error("Please enter a topic"); return; }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const sampleContent = `## Introduction\n\n${aiTopic} is an important topic in modern healthcare. Understanding its implications can help patients make informed decisions about their health and wellbeing.\n\n## Key Points\n\n- Regular monitoring and early detection are crucial\n- Consultation with healthcare providers is recommended for personalized advice\n- Lifestyle modifications can significantly impact outcomes\n- Stay informed about the latest research and treatment options\n\n## When to Seek Help\n\nIf you experience persistent symptoms or have concerns about ${aiTopic.toLowerCase()}, please consult a healthcare professional. Early intervention often leads to better outcomes.\n\n## Conclusion\n\nStaying informed about ${aiTopic.toLowerCase()} empowers you to take control of your health journey. MediMind is here to support you with AI-powered insights and connections to trusted healthcare providers.`;

    update("title", `Understanding ${aiTopic}: A Comprehensive Guide`);
    update("excerpt", `Learn about ${aiTopic.toLowerCase()}, its symptoms, treatment options, and when to seek medical help. A comprehensive guide for patients and caregivers.`);
    update("content", sampleContent);
    update("tags", `${aiTopic}, Health, Wellness, Medical Guide`);
    setGenerating(false);
    toast.success("AI content generated");
  };

  const handleSubmit = async (e: React.FormEvent, publishStatus: "Draft" | "Published") => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    try {
      await createBlog.mutateAsync({
        title: form.title,
        content: form.content,
        excerpt: form.excerpt || undefined,
        tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        coverImage: form.coverImage || undefined,
        status: publishStatus,
      });
      router.push("/blogs/manage");
    } catch { /* handled */ }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Write Article</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a new health article with AI assistance</p>
        </div>
        <button onClick={() => setShowAiPanel(!showAiPanel)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-4 h-4" /> {showAiPanel ? "Hide AI" : "AI Generate"}
        </button>
      </div>

      {showAiPanel && (
        <div className="card-standard p-6 border-l-4 border-l-primary">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Content Generator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic *</label>
              <input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Diabetes Management, Heart Health"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Audience</label>
              <select value={aiAudience} onChange={(e) => setAiAudience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="general">General Public</option>
                <option value="patients">Patients</option>
                <option value="caregivers">Caregivers</option>
                <option value="medical">Medical Professionals</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tone</label>
              <select value={aiTone} onChange={(e) => setAiTone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="empathetic">Empathetic</option>
                <option value="educational">Educational</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Length</label>
              <select value={aiLength} onChange={(e) => setAiLength(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="short">Short (~300 words)</option>
                <option value="medium">Medium (~600 words)</option>
                <option value="long">Long (~1000 words)</option>
              </select>
            </div>
          </div>
          <button onClick={handleAiGenerate} disabled={generating || !aiTopic}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Content</>}
          </button>
        </div>
      )}

      <form className="space-y-6">
        <div className="card-standard p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Article Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Enter article title"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} placeholder="Brief summary of the article..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (comma-separated)</label>
              <input type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="e.g. Heart Health, Wellness, Prevention"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="card-standard p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Content *</h2>
          <textarea value={form.content} onChange={(e) => update("content", e.target.value)} rows={16} placeholder="Write your article content here... Markdown supported."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono"
          />
        </div>

        <div className="card-standard p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Cover Image</h2>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input type="file" accept="image/jpeg,image/png,image/gif" onChange={handleImageUpload} disabled={uploading}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {uploading && <p className="text-xs text-primary mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</p>}
            </div>
            {form.coverImage && (
              <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                <img src={form.coverImage} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => update("coverImage", "")}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {form.content && (
          <div className="card-standard p-6">
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Preview</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {form.content.slice(0, 500)}
              {form.content.length > 500 && <span className="text-primary">... (content truncated in preview)</span>}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, "Draft")} disabled={createBlog.isPending}
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Save as Draft
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, "Published")} disabled={createBlog.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createBlog.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}

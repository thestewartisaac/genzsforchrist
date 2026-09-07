import imgSecretPlaceLogo from "@/imports/Homepage/2ce99f59ffd657ef0bb367464fc2ecb9136f1918.png";
import imgWhatWeDoSecretPlace from "@/imports/Homepage/f5348df6f5df01c615d6da6ff80c656b0f3abad1.png";
import imgWhatWeDoDaily from "@/imports/Homepage/8cfb78f68128e08761f1d331859ac14bf6168641.png";
import imgHumanitarian from "@/imports/Homepage/1d49bcef55f2ac1e7412fa22bcceb6d4b41953a6.png";
import imgCarousel1 from "@/imports/Homepage/62c881e484a773c554732bdd3a21d7feea1dd996.png";
import imgCarousel2 from "@/imports/Homepage/ee341b9f360edf170fcd9e64ea7bbdd2baed5316.png";
import imgCarousel3 from "@/imports/Homepage/3486655db75152df5483c1fb8bc7cc9bd4d5b749.png";
import imgCarousel4 from "@/imports/Homepage/5a58b780d0d9b93164f071a91b87b98716d31737.png";

export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  date: string;
  dateFormatted?: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  categoryLabel?: string;
  categoryBadgeBg?: string;
  categoryBadgeText?: string;
  coverImage: string;
  readTime: string;
  featured?: boolean;
  tags?: string[];
  content: string;
  order?: number;
}

export interface BlogCategory {
  id: string;
  label: string;
  bg: string;
  text: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: "all", label: "All Articles", bg: "bg-[#210901]", text: "text-white" },
  { id: "faith-culture", label: "Faith & Culture", bg: "bg-[#fbb222]", text: "text-[#210901]" },
  { id: "devotional", label: "Devotionals & Word", bg: "bg-[#d7f741]", text: "text-[#210901]" },
  { id: "revival-stories", label: "Revival Stories", bg: "bg-[#e62129]", text: "text-white" },
  { id: "community-impact", label: "Community & Impact", bg: "bg-[#00CEE7]", text: "text-[#210901]" },
  { id: "youth-purpose", label: "Youth & Purpose", bg: "bg-[#26103d]", text: "text-white" },
];

const IMAGE_MAP: Record<string, string> = {
  "/uploads/2ce99f59ffd657ef0bb367464fc2ecb9136f1918.png": imgSecretPlaceLogo,
  "/uploads/f5348df6f5df01c615d6da6ff80c656b0f3abad1.png": imgWhatWeDoSecretPlace,
  "/uploads/8cfb78f68128e08761f1d331859ac14bf6168641.png": imgWhatWeDoDaily,
  "/uploads/1d49bcef55f2ac1e7412fa22bcceb6d4b41953a6.png": imgHumanitarian,
  "/uploads/62c881e484a773c554732bdd3a21d7feea1dd996.png": imgCarousel1,
  "/uploads/ee341b9f360edf170fcd9e64ea7bbdd2baed5316.png": imgCarousel2,
  "/uploads/3486655db75152df5483c1fb8bc7cc9bd4d5b749.png": imgCarousel3,
  "/uploads/5a58b780d0d9b93164f071a91b87b98716d31737.png": imgCarousel4,
};

export function resolveBlogImage(img?: string): string {
  if (!img) return imgWhatWeDoSecretPlace;
  if (IMAGE_MAP[img]) return IMAGE_MAP[img];
  return img;
}

export function getCategoryMeta(categoryKey?: string): { label: string; bg: string; text: string } {
  switch (categoryKey) {
    case "faith-culture":
      return { label: "Faith & Culture", bg: "bg-[#fbb222]", text: "text-[#210901]" };
    case "devotional":
      return { label: "Devotionals & Word", bg: "bg-[#d7f741]", text: "text-[#210901]" };
    case "revival-stories":
      return { label: "Revival Stories", bg: "bg-[#e62129]", text: "text-white" };
    case "community-impact":
      return { label: "Community & Impact", bg: "bg-[#00CEE7]", text: "text-[#210901]" };
    case "youth-purpose":
      return { label: "Youth & Purpose", bg: "bg-[#26103d]", text: "text-white" };
    default:
      return { label: "Gen Z Faith", bg: "bg-[#fbb222]", text: "text-[#210901]" };
  }
}

export function getBlogPosts(): BlogPost[] {
  try {
    const modules = import.meta.glob<Record<string, any>>(
      "/content/blog/*.json",
      { eager: true }
    );
    const posts: BlogPost[] = [];

    for (const path in modules) {
      const data = (modules[path] as any)?.default || modules[path];
      if (data && data.title) {
        const catMeta = getCategoryMeta(data.category);
        posts.push({
          slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          title: data.title,
          subtitle: data.subtitle || "",
          excerpt: data.excerpt || "",
          date: data.date || new Date().toISOString(),
          dateFormatted: data.dateFormatted || formatDate(data.date),
          authorName: data.authorName || "Gen Zs for Christ",
          authorRole: data.authorRole || "Editorial Contributor",
          authorAvatar: data.authorAvatar ? resolveBlogImage(data.authorAvatar) : imgSecretPlaceLogo,
          category: data.category || "faith-culture",
          categoryLabel: catMeta.label,
          categoryBadgeBg: catMeta.bg,
          categoryBadgeText: catMeta.text,
          coverImage: resolveBlogImage(data.coverImage),
          readTime: data.readTime || "4 min read",
          featured: Boolean(data.featured),
          tags: Array.isArray(data.tags) ? data.tags : [],
          content: data.content || "",
          order: data.order ?? 99,
        });
      }
    }

    if (posts.length > 0) {
      return posts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 99) - (b.order || 99);
      });
    }
  } catch (err) {
    console.warn("Could not load dynamic blog posts from content/blog:", err);
  }

  // Fallback defaults
  return [
    {
      slug: "unashamed-generation",
      title: "Unashamed: Why Gen Z is Running to the Altar, Not the World",
      subtitle: "A generation labeled as disillusioned is discovering an unfiltered, radical hunger for the presence of Jesus.",
      excerpt: "Culture said our generation was leaving faith behind. But on campuses, in bedrooms, and on nightly prayer altars, something holy is breaking out.",
      date: "2026-09-07T08:00:00.000Z",
      dateFormatted: "September 7, 2026",
      authorName: "Efe Eruemulor",
      authorRole: "Founder, Gen Zs for Christ",
      authorAvatar: imgSecretPlaceLogo,
      category: "faith-culture",
      categoryLabel: "Faith & Culture",
      categoryBadgeBg: "bg-[#fbb222]",
      categoryBadgeText: "text-[#210901]",
      coverImage: imgWhatWeDoSecretPlace,
      readTime: "5 min read",
      featured: true,
      tags: ["Revival", "Prayer", "Campus Ministry", "Gen Z"],
      content: "For years, sociologists predicted that Generation Z would be the most secular generation in history...\n\nWhat they didn't realize is that superficial religion never had the power to keep a generation anyway. What Gen Z walked away from wasn't Jesus—it was performance Christianity.",
      order: 1,
    },
  ];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const all = getBlogPosts();
  return all.find((p) => p.slug === slug);
}

export function getFeaturedBlogPost(): BlogPost | undefined {
  const all = getBlogPosts();
  return all.find((p) => p.featured) || all[0];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recent";
  }
}

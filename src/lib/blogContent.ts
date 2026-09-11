import imgHandWithHeart from "@/imports/hand-with-heart.png";
import imgManKneeling from "@/imports/man-kneeling.png";
import imgManPraying from "@/imports/man-praying.png";
import imgUniversityStudent from "@/imports/university-student.png";
import imgSecretPlaceLogo from "@/imports/Homepage/2ce99f59ffd657ef0bb367464fc2ecb9136f1918.png";
import imgEfe from "@/people/efe.JPG";
import imgGenzsIcon from "@/people/genzs_icon.png";

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
  "/uploads/man-praying.png": imgManPraying,
  "/uploads/man-kneeling.png": imgManKneeling,
  "/uploads/hand-with-heart.png": imgHandWithHeart,
  "/uploads/university-student.png": imgUniversityStudent,
  "/uploads/efe.JPG": imgEfe,
  "/src/people/efe.JPG": imgEfe,
  "efe.JPG": imgEfe,
  "/uploads/genzs_icon.png": imgGenzsIcon,
  "/src/people/genzs_icon.png": imgGenzsIcon,
  "genzs_icon.png": imgGenzsIcon,
  "man-praying.png": imgManPraying,
  "man-kneeling.png": imgManKneeling,
  "hand-with-heart.png": imgHandWithHeart,
  "university-student.png": imgUniversityStudent,
  "/uploads/f5348df6f5df01c615d6da6ff80c656b0f3abad1.png": imgManPraying,
  "/uploads/1d49bcef55f2ac1e7412fa22bcceb6d4b41953a6.png": imgHandWithHeart,
  "/uploads/62c881e484a773c554732bdd3a21d7feea1dd996.png": imgUniversityStudent,
  "/uploads/2ce99f59ffd657ef0bb367464fc2ecb9136f1918.png": imgSecretPlaceLogo,
};

export function resolveBlogImage(img?: string): string {
  if (!img) return imgManPraying;
  if (IMAGE_MAP[img]) return IMAGE_MAP[img];
  if (img.toLowerCase().includes("efe")) return imgEfe;
  if (img.toLowerCase().includes("genzs_icon") || img.toLowerCase().includes("genz")) return imgGenzsIcon;
  if (img.includes("hand-with-heart")) return imgHandWithHeart;
  if (img.includes("man-kneeling")) return imgManKneeling;
  if (img.includes("man-praying")) return imgManPraying;
  if (img.includes("university-student")) return imgUniversityStudent;
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
      coverImage: imgManPraying,
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
  const normalized = (slug || "").trim().toLowerCase();
  return all.find(
    (p) =>
      p.slug.toLowerCase() === normalized ||
      p.slug.toLowerCase().replace(/[^a-z0-9]/g, "-") === normalized.replace(/[^a-z0-9]/g, "-") ||
      p.slug.toLowerCase().replace(/-/g, "") === normalized.replace(/-/g, "")
  );
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

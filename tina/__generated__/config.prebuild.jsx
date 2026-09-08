// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get this from tina.io once you register your project
  clientId: process.env.TINA_CLIENT_ID || process.env.NEXT_PUBLIC_TINA_CLIENT_ID || process.env.VITE_TINA_CLIENT_ID || typeof import.meta !== "undefined" && import.meta.env?.VITE_TINA_CLIENT_ID || "37dc3ba5-1d37-49ce-a046-bcb3ae4a98ba",
  token: process.env.TINA_TOKEN || process.env.VITE_TINA_TOKEN || typeof import.meta !== "undefined" && import.meta.env?.VITE_TINA_TOKEN || "72bebcdc29641394171b225f1de0c76d8614a04c",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "events",
        label: "Events & Activities",
        path: "content/events",
        format: "json",
        ui: {
          router: ({ document }) => {
            return `/events/${document._sys.filename}`;
          },
          filename: {
            slugify: (values) => {
              return `${values?.order || "00"}-${(values?.title || "").toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
            }
          }
        },
        fields: [
          {
            type: "string",
            name: "slug",
            label: "Event Slug / ID (e.g. secret-place-2026, daily-prayers)"
          },
          {
            type: "string",
            name: "title",
            label: "Event Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "subtitle",
            label: "Short Subtitle / Tagline"
          },
          {
            type: "string",
            name: "status",
            label: "Event Status",
            options: [
              { label: "Upcoming (Calculates Days to Go)", value: "upcoming" },
              { label: "Ongoing (Regular Rhythm / Altar)", value: "ongoing" },
              { label: "Event Finished (Past Event)", value: "past" },
              { label: "Event Cancelled", value: "cancelled" }
            ],
            required: true
          },
          {
            type: "datetime",
            name: "targetDate",
            label: "Target Date (For calculating 'In X Days' countdown)"
          },
          {
            type: "string",
            name: "date",
            label: "Date Display String (e.g. August 1st, 2026 / Fridays at 5:30 PM WAT / Nightly)",
            required: true
          },
          {
            type: "string",
            name: "venue",
            label: "Venue / Location (e.g. Live on Telegram / Main Bowl Stadium / Lagos Hub)",
            required: true
          },
          {
            type: "string",
            name: "category",
            label: "Category Filter",
            options: [
              { label: "Daily Prayers & Word", value: "daily" },
              { label: "Weekly Fellowship", value: "weekly" },
              { label: "Monthly Chats", value: "monthly" },
              { label: "Physical City Hubs", value: "city" },
              { label: "Sports & Fun Events", value: "fun" },
              { label: "Annual Gathering", value: "annual" }
            ]
          },
          {
            type: "image",
            name: "image",
            label: "Banner / Card Photo"
          },
          {
            type: "image",
            name: "logo",
            label: "Event Logo (Optional)"
          },
          {
            type: "string",
            name: "cardBg",
            label: "Card Color Theme",
            options: [
              { label: "Dark Purple (#26103d)", value: "bg-[#26103d]" },
              { label: "Teal Green (#00434a)", value: "bg-[#00434a]" },
              { label: "Lime Yellow (#d7f741)", value: "bg-[#d7f741]" },
              { label: "Deep Indigo (#1e1b4b)", value: "bg-[#1e1b4b]" },
              { label: "Warm White (#fff4ef)", value: "bg-[#fff4ef]" },
              { label: "Vibrant Red (#e62129)", value: "bg-[#e62129]" },
              { label: "Clean White (#ffffff)", value: "bg-white" }
            ]
          },
          {
            type: "string",
            name: "shadowColor",
            label: "Neo-brutalist Shadow Color (Hex e.g. #fbb222, #d7f741, #210901)"
          },
          {
            type: "string",
            name: "description",
            label: "Brief Description (For overview & card)",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "fullDescription",
            label: "Full Rich Narrative (For Dedicated Event Page)",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "highlights",
            label: "Key Highlights & Takeaways",
            list: true
          },
          {
            type: "object",
            name: "timezones",
            label: "Timezones (Optional for Prayer Altars)",
            list: true,
            fields: [
              { type: "string", name: "zone", label: "Zone (e.g. WAT, GMT)" },
              { type: "string", name: "region", label: "Region (e.g. Nigeria & Cameroon)" },
              { type: "string", name: "time", label: "Time (e.g. 9:00 PM)" }
            ]
          },
          {
            type: "string",
            name: "actionUrl",
            label: "Primary Action URL (e.g. Telegram / Registration / YouTube)"
          },
          {
            type: "string",
            name: "actionText",
            label: "Primary Action Button Text (e.g. Join on Telegram / Register / Watch Replays)"
          },
          {
            type: "number",
            name: "order",
            label: "Sort Order Priority"
          }
        ]
      },
      {
        name: "gallery",
        label: "Photo Gallery Reel",
        path: "content/gallery",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Gallery Section Heading"
          },
          {
            type: "object",
            name: "photos",
            label: "Gallery Photos",
            list: true,
            fields: [
              { type: "string", name: "id", label: "Photo ID" },
              { type: "image", name: "src", label: "Image File" },
              { type: "string", name: "alt", label: "Alt Description" },
              { type: "string", name: "caption", label: "Caption" }
            ]
          }
        ]
      },
      {
        name: "blog",
        label: "Blog Posts & Articles",
        path: "content/blog",
        format: "json",
        ui: {
          router: ({ document }) => {
            return `/blog/${document._sys.filename}`;
          },
          filename: {
            slugify: (values) => {
              return `${values?.order ? String(values.order).padStart(2, "0") : "01"}-${(values?.slug || values?.title || "").toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
            }
          }
        },
        fields: [
          {
            type: "string",
            name: "slug",
            label: "Article Slug (e.g. unashamed-generation, lost-art-of-stillness)",
            required: true
          },
          {
            type: "string",
            name: "title",
            label: "Article Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "subtitle",
            label: "Subtitle / Catchphrase"
          },
          {
            type: "string",
            name: "excerpt",
            label: "Short Excerpt / Preview Summary",
            ui: {
              component: "textarea"
            },
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Publication Date",
            required: true
          },
          {
            type: "string",
            name: "dateFormatted",
            label: "Display Date (e.g. September 7, 2026)"
          },
          {
            type: "string",
            name: "authorName",
            label: "Author Name (e.g. Stewart Isaac, GenZs Editorial Team)",
            required: true
          },
          {
            type: "string",
            name: "authorRole",
            label: "Author Role (e.g. Founder & Movement Leader, Contributor)"
          },
          {
            type: "image",
            name: "authorAvatar",
            label: "Author Profile Picture / Avatar"
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: [
              { label: "Faith & Culture", value: "faith-culture" },
              { label: "Devotional & Word", value: "devotional" },
              { label: "Revival Stories", value: "revival-stories" },
              { label: "Community & Impact", value: "community-impact" },
              { label: "Youth & Purpose", value: "youth-purpose" }
            ],
            required: true
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image / Hero Photo",
            required: true
          },
          {
            type: "string",
            name: "readTime",
            label: "Estimated Read Time (e.g. 4 min read)"
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured Article (Highlight as Main Story)"
          },
          {
            type: "string",
            name: "tags",
            label: "Topic Tags (e.g. Prayer, Campus, Revival, Lifestyle)",
            list: true
          },
          {
            type: "string",
            name: "content",
            label: "Article Body Content (Supports multi-paragraph text and headings)",
            ui: {
              component: "textarea"
            },
            required: true
          },
          {
            type: "number",
            name: "order",
            label: "Sort Order / Priority"
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};

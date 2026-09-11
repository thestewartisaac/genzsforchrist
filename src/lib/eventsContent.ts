// Image asset imports for fallback and direct mapping
import imgSecretPlaceLogo from "@/imports/Homepage/2ce99f59ffd657ef0bb367464fc2ecb9136f1918.png";
import imgWhatWeDoSecretPlace from "@/imports/Homepage/f5348df6f5df01c615d6da6ff80c656b0f3abad1.png";
import imgWhatWeDoDaily from "@/imports/Homepage/8cfb78f68128e08761f1d331859ac14bf6168641.png";
import imgHumanitarian from "@/imports/Homepage/1d49bcef55f2ac1e7412fa22bcceb6d4b41953a6.png";
import bibleStudy from "@/imports/bible-study.png";
import praying from "@/imports/praying.png";
import gameMeetup2 from "@/imports/game-meetup-2.jpg";
import sportsFiesta1 from "@/imports/sports-fiesta-1.jpg";
import imgLagosHangoutAnniversary from "@/imports/lagos-hangout-anniversity.jpeg";
import imgCarousel1 from "@/imports/Homepage/62c881e484a773c554732bdd3a21d7feea1dd996.png";
import imgCarousel2 from "@/imports/Homepage/ee341b9f360edf170fcd9e64ea7bbdd2baed5316.png";
import imgCarousel3 from "@/imports/Homepage/3486655db75152df5483c1fb8bc7cc9bd4d5b749.png";
import imgCarousel4 from "@/imports/Homepage/5a58b780d0d9b93164f071a91b87b98716d31737.png";

// Events Page Gallery Images
import img3Guys from "@/imports/3-guys.jpg";
import img5Ladies from "@/imports/5-ladies.jpg";
import imgEfeRaiseMioc from "@/imports/efe-raise-mioc.JPG";
import imgGenzEx from "@/imports/genz-ex.jpg";
import imgGroupLagos from "@/imports/group-lagos.jpg";
import imgGroupPhoto2 from "@/imports/group-photo-2.jpg";
import imgGroupPhoto3 from "@/imports/group-photo-3.jpg";
import imgGroupYaounde from "@/imports/group-yaounde.jpg";
import imgMeetupAbuja from "@/imports/meetup-abuja.jpeg";
import imgMeetupLagos2 from "@/imports/meetup-lagos-2.jpg";
import imgMeetupPeople from "@/imports/meetup-people.jpg";
import imgPrayerMeetup from "@/imports/prayer-meetup.jpg";
import imgSecretPlace2 from "@/imports/secret-place-2.jpg";
import imgSecretPlace3 from "@/imports/secret-place-3.JPG";

export type EventStatus = "upcoming" | "ongoing" | "past" | "cancelled";

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  status: EventStatus;
  targetDate?: string;
  date: string;
  venue: string;
  category?: string;
  categoryLabel?: string;
  image: string;
  logo?: string;
  cardBg?: string;
  cardText?: string;
  titleColor?: string;
  shadowColor?: string;
  description: string;
  fullDescription?: string;
  highlights?: string[];
  timezones?: { zone: string; region: string; time: string }[];
  actionUrl?: string;
  actionText?: string;
  order?: number;
}

export interface StatusBadgeInfo {
  label: string;
  bg: string;
  text: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface GalleryData {
  title: string;
  photos: GalleryPhoto[];
}

// Built-in image map for fast resolving
const IMAGE_MAP: Record<string, string> = {
  "/uploads/2ce99f59ffd657ef0bb367464fc2ecb9136f1918.png": imgSecretPlaceLogo,
  "/uploads/f5348df6f5df01c615d6da6ff80c656b0f3abad1.png": imgWhatWeDoSecretPlace,
  "/uploads/8cfb78f68128e08761f1d331859ac14bf6168641.png": imgWhatWeDoDaily,
  "/uploads/1d49bcef55f2ac1e7412fa22bcceb6d4b41953a6.png": imgHumanitarian,
  "/uploads/bible-study.png": bibleStudy,
  "bible-study.png": bibleStudy,
  "/uploads/praying.png": praying,
  "praying.png": praying,
  "/uploads/game-meetup-2.jpg": gameMeetup2,
  "game-meetup-2.jpg": gameMeetup2,
  "src/imports/game-meetup-2.jpg": gameMeetup2,
  "/src/imports/game-meetup-2.jpg": gameMeetup2,
  "/uploads/sports-fiesta-1.jpg": sportsFiesta1,
  "sports-fiesta-1.jpg": sportsFiesta1,
  "src/imports/sports-fiesta-1.jpg": sportsFiesta1,
  "/src/imports/sports-fiesta-1.jpg": sportsFiesta1,
  "/uploads/lagos-hangout-anniversity.jpeg": imgLagosHangoutAnniversary,
  "lagos-hangout-anniversity.jpeg": imgLagosHangoutAnniversary,
  "/uploads/lagos-hangout-anniversary.jpeg": imgLagosHangoutAnniversary,
  "lagos-hangout-anniversary.jpeg": imgLagosHangoutAnniversary,
  "/uploads/62c881e484a773c554732bdd3a21d7feea1dd996.png": imgCarousel1,
  "/uploads/ee341b9f360edf170fcd9e64ea7bbdd2baed5316.png": imgCarousel2,
  "/uploads/3486655db75152df5483c1fb8bc7cc9bd4d5b749.png": imgCarousel3,
  "/uploads/5a58b780d0d9b93164f071a91b87b98716d31737.png": imgCarousel4,

  // Events Gallery Images
  "/uploads/3-guys.jpg": img3Guys,
  "3-guys.jpg": img3Guys,
  "src/imports/3-guys.jpg": img3Guys,
  "/src/imports/3-guys.jpg": img3Guys,

  "/uploads/5-ladies.jpg": img5Ladies,
  "5-ladies.jpg": img5Ladies,
  "src/imports/5-ladies.jpg": img5Ladies,
  "/src/imports/5-ladies.jpg": img5Ladies,

  "/uploads/efe-raise-mioc.JPG": imgEfeRaiseMioc,
  "efe-raise-mioc.JPG": imgEfeRaiseMioc,
  "efe-raise-mioc.jpg": imgEfeRaiseMioc,
  "src/imports/efe-raise-mioc.JPG": imgEfeRaiseMioc,
  "/src/imports/efe-raise-mioc.JPG": imgEfeRaiseMioc,

  "/uploads/genz-ex.jpg": imgGenzEx,
  "genz-ex.jpg": imgGenzEx,
  "src/imports/genz-ex.jpg": imgGenzEx,
  "/src/imports/genz-ex.jpg": imgGenzEx,

  "/uploads/group-lagos.jpg": imgGroupLagos,
  "group-lagos.jpg": imgGroupLagos,
  "src/imports/group-lagos.jpg": imgGroupLagos,
  "/src/imports/group-lagos.jpg": imgGroupLagos,

  "/uploads/group-photo-2.jpg": imgGroupPhoto2,
  "group-photo-2.jpg": imgGroupPhoto2,
  "src/imports/group-photo-2.jpg": imgGroupPhoto2,
  "/src/imports/group-photo-2.jpg": imgGroupPhoto2,

  "/uploads/group-photo-3.jpg": imgGroupPhoto3,
  "group-photo-3.jpg": imgGroupPhoto3,
  "src/imports/group-photo-3.jpg": imgGroupPhoto3,
  "/src/imports/group-photo-3.jpg": imgGroupPhoto3,

  "/uploads/group-yaounde.jpg": imgGroupYaounde,
  "group-yaounde.jpg": imgGroupYaounde,
  "src/imports/group-yaounde.jpg": imgGroupYaounde,
  "/src/imports/group-yaounde.jpg": imgGroupYaounde,

  "/uploads/meetup-abuja.jpeg": imgMeetupAbuja,
  "meetup-abuja.jpeg": imgMeetupAbuja,
  "src/imports/meetup-abuja.jpeg": imgMeetupAbuja,
  "/src/imports/meetup-abuja.jpeg": imgMeetupAbuja,

  "/uploads/meetup-lagos-2.jpg": imgMeetupLagos2,
  "meetup-lagos-2.jpg": imgMeetupLagos2,
  "src/imports/meetup-lagos-2.jpg": imgMeetupLagos2,
  "/src/imports/meetup-lagos-2.jpg": imgMeetupLagos2,

  "/uploads/meetup-people.jpg": imgMeetupPeople,
  "meetup-people.jpg": imgMeetupPeople,
  "src/imports/meetup-people.jpg": imgMeetupPeople,
  "/src/imports/meetup-people.jpg": imgMeetupPeople,

  "/uploads/prayer-meetup.jpg": imgPrayerMeetup,
  "prayer-meetup.jpg": imgPrayerMeetup,
  "src/imports/prayer-meetup.jpg": imgPrayerMeetup,
  "/src/imports/prayer-meetup.jpg": imgPrayerMeetup,

  "/uploads/secret-place-2.jpg": imgSecretPlace2,
  "secret-place-2.jpg": imgSecretPlace2,
  "src/imports/secret-place-2.jpg": imgSecretPlace2,
  "/src/imports/secret-place-2.jpg": imgSecretPlace2,

  "/uploads/secret-place-3.JPG": imgSecretPlace3,
  "secret-place-3.JPG": imgSecretPlace3,
  "secret-place-3.jpg": imgSecretPlace3,
  "src/imports/secret-place-3.JPG": imgSecretPlace3,
  "/src/imports/secret-place-3.JPG": imgSecretPlace3,
};

export function resolveImage(img?: string): string {
  if (!img) return imgWhatWeDoSecretPlace;
  if (IMAGE_MAP[img]) return IMAGE_MAP[img];
  const cleanName = img.replace(/^\/uploads\//, "").replace(/^\//, "");
  if (IMAGE_MAP[cleanName]) return IMAGE_MAP[cleanName];
  if (IMAGE_MAP[`/uploads/${cleanName}`]) return IMAGE_MAP[`/uploads/${cleanName}`];
  return img;
}

// Automatic contrast & theme guarantor
export function resolveCardColors(
  cardBg?: string,
  customCardText?: string,
  customTitleColor?: string,
  customShadowColor?: string
) {
  const bg = cardBg || "bg-white";

  // Identify whether the card background is dark
  const isDark =
    bg.includes("#26103d") ||
    bg.includes("#00434a") ||
    bg.includes("#e62129") ||
    bg.includes("#1e1b4b") ||
    bg.includes("#210901") ||
    bg.includes("bg-black") ||
    bg.includes("bg-gray-900");

  let cardText = customCardText;
  let titleColor = customTitleColor;
  let shadowColor = customShadowColor || "#210901";

  if (isDark) {
    if (!cardText || cardText === "text-[#210901]") {
      cardText = "text-white";
    }
    if (!titleColor || titleColor === "text-[#210901]" || titleColor === "text-inherit") {
      if (bg.includes("#00434a")) titleColor = "text-[#d7f741]";
      else if (bg.includes("#26103d")) titleColor = "text-[#fbb222]";
      else if (bg.includes("#e62129")) titleColor = "text-[#FED33D]";
      else if (bg.includes("#1e1b4b")) titleColor = "text-[#ffade3]";
      else titleColor = "text-white";
    }
  } else {
    // Light backgrounds (bg-white, bg-[#d7f741], bg-[#fff4ef])
    if (!cardText || cardText === "text-white") {
      cardText = "text-[#210901]";
    }
    if (!titleColor || titleColor === "text-white" || titleColor === "text-inherit") {
      titleColor = "text-[#210901]";
    }
  }

  return { isDark, cardBg: bg, cardText, titleColor, shadowColor };
}

export function getEventStatusBadge(item: ActivityItem): StatusBadgeInfo {
  if (item.status === "cancelled") {
    return {
      label: "Event Cancelled",
      bg: "bg-[#e62129]",
      text: "text-white",
    };
  }

  if (item.status === "past") {
    return {
      label: "Event Finished",
      bg: "bg-[#210901]",
      text: "text-white",
    };
  }

  if (item.status === "ongoing") {
    return {
      label: "Ongoing",
      bg: "bg-[#d7f741]",
      text: "text-[#210901]",
    };
  }

  // Upcoming: calculate days to go
  if (item.targetDate) {
    try {
      const now = new Date();
      const target = new Date(item.targetDate);
      const diffTime = target.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        return { label: "Today", bg: "bg-[#e62129]", text: "text-white" };
      }
      if (diffDays === 1) {
        return { label: "In 1 Day", bg: "bg-[#fbb222]", text: "text-[#210901]" };
      }
      return {
        label: `In ${diffDays} Days`,
        bg: "bg-[#fbb222]",
        text: "text-[#210901]",
      };
    } catch {
      // Fallback
    }
  }

  return {
    label: "Upcoming",
    bg: "bg-[#fbb222]",
    text: "text-[#210901]",
  };
}

// Load events from /content/events/*.json
export function getEventsFromContent(): ActivityItem[] {
  try {
    const modules = import.meta.glob<Record<string, any>>(
      "/content/events/*.json",
      { eager: true }
    );
    const items: ActivityItem[] = [];

    for (const path in modules) {
      const data = (modules[path] as any)?.default || modules[path];
      if (data && data.title) {
        const colors = resolveCardColors(
          data.cardBg,
          data.cardText,
          data.titleColor,
          data.shadowColor
        );

        items.push({
          id: data.slug || data.id || data.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          title: data.title,
          subtitle: data.subtitle || "",
          status: (data.status as EventStatus) || "upcoming",
          targetDate: data.targetDate,
          date: data.date || "Date to be announced",
          venue: data.venue || "Venue to be announced",
          category: data.category || "daily",
          image: resolveImage(data.image),
          logo: data.logo ? resolveImage(data.logo) : undefined,
          cardBg: colors.cardBg,
          cardText: colors.cardText,
          titleColor: colors.titleColor,
          shadowColor: colors.shadowColor,
          description: data.description || "",
          fullDescription: data.fullDescription || data.description || "",
          highlights: Array.isArray(data.highlights) ? data.highlights : [],
          timezones: Array.isArray(data.timezones) ? data.timezones : undefined,
          actionUrl: data.actionUrl || "https://t.me/genzsforchrist",
          actionText: data.actionText || "Read More",
          order: data.order ?? 99,
        });
      }
    }

    if (items.length > 0) {
      return items.sort((a, b) => (a.order || 99) - (b.order || 99));
    }
  } catch (err) {
    console.warn("Could not load dynamic events from content folder:", err);
  }

  // Fallback defaults with guaranteed high-contrast colors matching What We Do on homepage
  return [
    {
      id: "lagos-anniversary-hangout",
      title: "Lagos 2026 Anniversary Hangout",
      subtitle: "Worship, Word, prayer, connections, and joyful fellowship.",
      status: "upcoming",
      targetDate: "2026-09-19T13:00:00Z",
      date: "Saturday 19 September 2026 • 1:00 PM",
      venue: "Ndubuisi Kanu Park, Ikeja, Lagos",
      category: "hangout",
      image: imgLagosHangoutAnniversary,
      cardBg: "bg-[#00434a]",
      cardText: "text-white",
      titleColor: "text-[#d7f741]",
      shadowColor: "#210901",
      description:
        "Join us for our Lagos 2026 Anniversary Hangout! A power-packed day of worship, bible study, prayer, connections, open conversations, and games.",
      fullDescription:
        "Join us for our Lagos 2026 Anniversary Hangout at Ndubuisi Kanu Park, Ikeja, Lagos!\n\nA celebration of God's goodness, revival, and community. We are gathering for unhindered worship, deep bible study, earnest prayer, meaningful connections, open real conversations, and fun games.\n\nCome expectant, invite a friend, and let's make unforgettable memories together in Christ.",
      highlights: [
        "Heartfelt acoustic worship & praise session",
        "Interactive Bible Study & scripture discussions",
        "United prayer & spiritual intercession",
        "Open conversations & authentic networking",
        "Fun group games, laughter & refreshments",
      ],
      actionUrl: "https://chat.whatsapp.com/ELjOCqsqMuZLjG953nXWUQ?s=cl&p=i&mlu=4&ilr=4",
      actionText: "Join Lagos WhatsApp Group",
      order: 1,
    },
    {
      id: "city-gatherings",
      title: "Monthly Physical City Gatherings",
      subtitle: "Show up, connect in person, and build a stronger local community.",
      status: "ongoing",
      date: "Once a Month • Announced on Telegram",
      venue: "Physical City Hubs (Locations Announced on Telegram)",
      category: "city",
      image: imgCarousel3,
      cardBg: "bg-[#00434a]",
      cardText: "text-white",
      titleColor: "text-[#d7f741]",
      shadowColor: "#210901",
      description:
        "Each city hosts a physical fellowship every month, an opportunity to show up, connect in person, and build a stronger community. Locations are announced in our Telegram channel.",
      fullDescription:
        "Each city hosts a physical fellowship every month, an opportunity to show up, connect in person, break bread, and build a stronger community of passionate young believers who support each other in their walk with Christ. Specific venue locations for each city are announced in our official Telegram community.",
      highlights: [
        "In-person meetups across major cities",
        "Worship, shared meals, and life-giving friendship",
        "Local campus and city community outreaches",
      ],
      actionUrl: "https://t.me/genzsforchrist",
      actionText: "Join Telegram for City Updates",
      order: 2,
    },
    {
      id: "daily-prayers",
      title: "Daily Prayers",
      subtitle: "Staying consistent and connected with God every single day.",
      status: "ongoing",
      date: "Every Night • 4 Timezones",
      venue: "Live on Telegram Voice Channel",
      category: "daily",
      image: praying,
      cardBg: "bg-[#26103d]",
      cardText: "text-white",
      titleColor: "text-[#fbb222]",
      shadowColor: "#210901",
      description:
        "We gather every day for prayer, staying consistent and connected with God across global timezones.",
      fullDescription:
        "We gather every day for prayer, staying consistent and connected with God. A sacred altar where young believers unite nightly across time zones to pray, intercede, and carry His presence.",
      highlights: [
        "WAT (Nigeria & Cameroon): 9:00 PM",
        "GMT (Ghana & Sierra Leone): 8:00 PM",
        "BST (United Kingdom): 9:00 PM",
        "EAT (Kenya): 11:00 PM",
      ],
      timezones: [
        { zone: "WAT", region: "Nigeria & Cameroon", time: "9:00 PM" },
        { zone: "GMT", region: "Ghana & Sierra Leone", time: "8:00 PM" },
        { zone: "BST", region: "United Kingdom", time: "9:00 PM" },
        { zone: "EAT", region: "Kenya", time: "11:00 PM" },
      ],
      actionUrl: "https://t.me/genzsforchrist",
      actionText: "Join Daily Prayers",
      order: 3,
    },
    {
      id: "bible-study",
      title: "Bi-Weekly Bible Study",
      subtitle: "Deep expository scripture study to grow in knowledge & faith.",
      status: "ongoing",
      date: "Every Two Weeks on Friday • 5:30 PM WAT",
      venue: "Online on Telegram",
      category: "daily",
      image: bibleStudy,
      cardBg: "bg-[#00434a]",
      cardText: "text-white",
      titleColor: "text-[#d7f741]",
      shadowColor: "#210901",
      description:
        "Every two weeks on Friday, we study the Word deeply, growing in knowledge, understanding, and faith.",
      fullDescription:
        "Every two weeks on Friday, we study the Word deeply, growing in knowledge, understanding, and faith. Practical, scripture-rich teaching breaking down biblical truth for modern Gen Z living.",
      highlights: [
        "Chapter-by-chapter scripture breakdown",
        "Interactive questions & open group dialogue",
        "Discipleship study notes for personal growth",
      ],
      actionUrl: "https://t.me/genzsforchrist",
      actionText: "Join Bible Study",
      order: 4,
    },
    {
      id: "reset-sundays",
      title: "Reset Sundays",
      subtitle: "Relax, connect, gist, and enjoy game nights for the new week.",
      status: "ongoing",
      date: "Every Sunday • 8:00 PM WAT",
      venue: "Online on Telegram",
      category: "weekly",
      image: imgWhatWeDoDaily,
      cardBg: "bg-[#e62129]",
      cardText: "text-white",
      titleColor: "text-white",
      shadowColor: "#210901",
      description:
        "A time to relax, connect, gist, and sometimes enjoy game nights as we refresh and prepare for the new week.",
      fullDescription:
        "A time to relax, connect, gist, and sometimes enjoy game nights as we refresh and prepare for the new week. Genuine, warm fellowship with brothers and sisters in Christ.",
      highlights: [
        "Relaxed hangout & open gist session",
        "Christian game nights & fun trivia",
        "Spiritual recharge before stepping into Monday",
      ],
      actionUrl: "https://t.me/genzsforchrist",
      actionText: "Join Reset Sunday",
      order: 5,
    },
    {
      id: "chats-and-conversations",
      title: "Monthly Chats & Conversations",
      subtitle: "Real, open discussions about faith, life, and deeper topics.",
      status: "ongoing",
      date: "Once a Month • 7:00 PM WAT",
      venue: "Online on Telegram",
      category: "monthly",
      image: gameMeetup2,
      cardBg: "bg-[#1e1b4b]",
      cardText: "text-white",
      titleColor: "text-[#ffade3]",
      shadowColor: "#210901",
      description:
        "Once every month at 7:00 PM, we host real and open discussions about faith, life, and deeper topics.",
      fullDescription:
        "Once every month at 7:00 PM, we host real and open discussions about faith, life, and deeper topics, addressing things we don’t always talk about often in regular settings.",
      highlights: [
        "Honest talks on mental health, relationships, purity & purpose",
        "Navigating university, career pressure, and secular culture",
        "Mentorship and real answers to tough questions",
      ],
      actionUrl: "https://t.me/genzsforchrist",
      actionText: "Join Monthly Chat",
      order: 6,
    },
    {
      id: "secret-place-2026",
      title: "The Secret Place 2026",
      subtitle: "Our flagship annual gathering for deep encounters and spiritual awakening.",
      status: "past",
      date: "August 1st, 2026 • 9:00 AM",
      venue: "Calvary Chapel, Cathedral of Refuge, E. Momoh Avenue, Kado-kuchi, Abuja",
      category: "annual",
      image: imgWhatWeDoSecretPlace,
      logo: imgSecretPlaceLogo,
      cardBg: "bg-white",
      cardText: "text-[#210901]",
      titleColor: "text-[#210901]",
      shadowColor: "#210901",
      description:
        "Our flagship annual gathering for deep encounters and spiritual awakening.",
      fullDescription:
        "The Secret Place is the flagship annual gathering of Gen Z’s for Christ, a life-transforming encounter designed to draw young people into a deeper relationship with God through worship, prayer, the Word, and the ministry of the Holy Spirit.\n\nMore than just an event, The Secret Place is a call to intimacy with God, spiritual awakening, and revival. It is a place where hearts are transformed, lives are surrendered, purpose is awakened, and a generation is equipped to live boldly for Christ and influence every sphere of society.\n\nHeld annually, The Secret Place brings together young people from different backgrounds for a powerful time of encounter, discipleship, and impartation, raising a generation that knows God, carries His presence, and advances His Kingdom.",
      highlights: [
        "Overwhelming atmosphere of unhindered worship and prayer",
        "Deep discipleship sessions and personal spiritual awakening",
        "Replays, worship recordings, and sermons available on YouTube",
      ],
      actionUrl: "https://youtube.com/@genzsforchrist",
      actionText: "Watch 2026 Replays",
      order: 7,
    },
    {
      id: "sports-fiesta",
      title: "Sports Fiesta",
      subtitle: "Building relationships, unity, & sharing Christ through sports.",
      status: "past",
      date: "June 13th, 2026 • 10:00 AM",
      venue: "Monaliza Park, Central Business District, Garki, Abuja",
      category: "fun",
      image: sportsFiesta1,
      cardBg: "bg-[#e62129]",
      cardText: "text-white",
      titleColor: "text-[#FED33D]",
      shadowColor: "#210901",
      description:
        "At Gen Z’s for Christ, we believe that sports are more than just games—they are a powerful platform for building relationships, fostering unity, and sharing the love of Christ.",
      fullDescription:
        "At Gen Z’s for Christ, we believe that sports are more than just games—they are a powerful platform for building relationships, fostering unity, and sharing the love of Christ.\n\nThrough our sports fellowship initiatives, we create an environment where young people can connect, grow in friendship, and strengthen their faith while engaging in healthy competition and recreation.",
      highlights: [
        "Football tournament, basketball match-ups & track races",
        "Praise, barbecue & networking hangout",
        "Open gospel invitation and salvation altar call",
      ],
      actionUrl: "https://instagram.com/genzsforchrist",
      actionText: "View Event Highlights",
      order: 8,
    },
  ];
}

export function getEventById(id: string): ActivityItem | undefined {
  const all = getEventsFromContent();
  return all.find((item) => item.id === id);
}

// Load Gallery photos from /content/gallery/gallery.json
export function getGalleryFromContent(): GalleryData {
  try {
    const modules = import.meta.glob<Record<string, any>>(
      "/content/gallery/*.json",
      { eager: true }
    );
    for (const path in modules) {
      const data = (modules[path] as any)?.default || modules[path];
      if (data && Array.isArray(data.photos)) {
        return {
          title: data.title || "Photo Gallery",
          photos: data.photos.map((p: any, i: number) => ({
            id: p.id || String(i + 1),
            src: resolveImage(p.src),
            alt: p.alt || "Photo",
            caption: p.caption || "",
          })),
        };
      }
    }
  } catch (err) {
    console.warn("Could not load gallery from content:", err);
  }

  return {
    title: "Photo Gallery",
    photos: [
      { id: "1", src: img3Guys, alt: "Brothers in Faith", caption: "Brothers in Faith" },
      { id: "2", src: img5Ladies, alt: "Sisters in Fellowship", caption: "Sisters in Fellowship" },
      { id: "3", src: imgEfeRaiseMioc, alt: "Passionate Worship", caption: "Passionate Worship" },
      { id: "4", src: gameMeetup2, alt: "Game Night & Bonding", caption: "Game Night & Bonding" },
      { id: "5", src: imgGenzEx, alt: "Joyful Community", caption: "Joyful Community" },
      { id: "6", src: imgGroupLagos, alt: "Lagos City Hub", caption: "Lagos City Hub" },
      { id: "7", src: imgGroupPhoto2, alt: "Kingdom Tribe", caption: "Kingdom Tribe" },
      { id: "8", src: imgGroupPhoto3, alt: "United in Purpose", caption: "United in Purpose" },
      { id: "9", src: imgGroupYaounde, alt: "Yaoundé Hub Community", caption: "Yaoundé Hub Community" },
      { id: "10", src: imgMeetupAbuja, alt: "Abuja Fellowship", caption: "Abuja Fellowship" },
      { id: "11", src: imgMeetupLagos2, alt: "Lagos Community Meetup", caption: "Lagos Community Meetup" },
      { id: "12", src: imgMeetupPeople, alt: "Unashamed Generation", caption: "Unashamed Generation" },
      { id: "13", src: imgPrayerMeetup, alt: "Fervent Prayer & Intercession", caption: "Fervent Prayer & Intercession" },
      { id: "14", src: imgSecretPlace2, alt: "Altar Encounters", caption: "Altar Encounters" },
      { id: "15", src: imgSecretPlace3, alt: "Worship & Reflection", caption: "Worship & Reflection" },
      { id: "16", src: sportsFiesta1, alt: "Sports Fiesta & Outdoor Games", caption: "Sports Fiesta & Outdoor Games" },
    ],
  };
}

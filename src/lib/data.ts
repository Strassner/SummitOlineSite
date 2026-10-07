/**
 * Seed content. In production this is what a CMS / database (Sanity, Supabase, Stripe products, etc.)
 * would supply. All names, prices, bios and testimonials are PLACEHOLDERS to be replaced with the
 * real items listed in section 35 of the design brief.
 */
import { addDays, weekdayIndex } from "./dates";
import type { Coach, ContentPost, GalleryItem, LibraryItem, Plan, Session, Testimonial } from "./types";

export const TRAINING_LOCATION = "Summit Training Site · Kansas City, MO"; // PLACEHOLDER

/* ------------------------------- coaches ------------------------------- */
// PLACEHOLDER coaches. Replace names, photos and facts with real coach information.
export const COACHES: Coach[] = [
  {
    id: "coach-1",
    slug: "head-coach",
    name: "Coach [Head Coach Name]",
    role: "Founder & Head Offensive Line Coach",
    position: "Offensive Line",
    playing: "[Playing experience: school, years, positions played]",
    collegePro: "[College / professional experience]",
    coaching: "[Years coaching and levels: youth, high school, college]",
    certifications: ["[Certification]", "[Certification]"],
    philosophy:
      "Great linemen are built from the ground up. Master the stance, the first step and the hands, then layer in strength, football IQ and discipline until the technique holds up under pressure.",
    bio: "Founder of Summit Line Academy. Leads private training, small-group sessions and the Summit curriculum from stance to finish.",
  },
  {
    id: "coach-2",
    slug: "assistant-coach-1",
    name: "Coach [Assistant Coach Name]",
    role: "Offensive Line Coach · Pass Protection",
    position: "Offensive Tackle",
    playing: "[Playing experience: school, years]",
    collegePro: "[College / professional experience]",
    coaching: "[Coaching experience]",
    certifications: ["[Certification]"],
    philosophy:
      "Pass protection is a conversation between your feet, hands and eyes. We train all three until your base stays quiet and your reactions stay fast.",
    bio: "Specializes in pass sets, hand placement and anchoring against speed and power rushers.",
  },
  {
    id: "coach-3",
    slug: "assistant-coach-2",
    name: "Coach [Assistant Coach Name]",
    role: "Offensive Line Coach · Run Game & Strength",
    position: "Guard / Center",
    playing: "[Playing experience: school, years]",
    collegePro: "[College / professional experience]",
    coaching: "[Coaching experience]",
    certifications: ["[Certification]"],
    philosophy:
      "Movement, leverage and finish. We build athletes who move people in the run game and understand exactly why the play works.",
    bio: "Specializes in combo blocks, pulling, run-game footwork and the strength and mobility work that supports it.",
  },
];

/* ------------------------------ memberships ------------------------------ */
// PLACEHOLDER pricing / session counts. Editable in the admin portal (stored locally in this demo).
export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Summit Starter",
    tagline: "Build the foundation.",
    price: 129,
    billing: "month",
    sessions: 4,
    memberDiscount: 0.1,
    perks: [
      "4 small-group sessions per month",
      "Access to member content library",
      "Member pricing on private training",
      "Camp & clinic early registration",
    ],
  },
  {
    id: "elite",
    name: "Summit Elite",
    tagline: "Train with priority.",
    price: 229,
    billing: "month",
    sessions: 8,
    memberDiscount: 0.15,
    featured: true,
    perks: [
      "8 sessions per month (group or private credit)",
      "Priority scheduling window",
      "Full member content library + film study",
      "Quarterly technique evaluation",
      "Member pricing on camps & clinics",
    ],
  },
  {
    id: "unlimited",
    name: "Summit Unlimited",
    tagline: "All in, all season.",
    price: 389,
    billing: "month",
    sessions: null,
    memberDiscount: 0.2,
    perks: [
      "Unlimited small-group access",
      "Monthly one-on-one development session",
      "Premium member benefits + early access",
      "Member-only film study & programs",
      "Best member pricing on everything",
    ],
  },
];

/* --------------------------------- sessions --------------------------------- */

interface Template {
  key: string;
  weekday: number; // Mon=0
  start: string;
  end: string;
  kind: Session["kind"];
  title: string;
  coachId: string;
  capacity: number;
  baseTaken: number;
  price: number;
  credits: number;
  description: string;
  ageRange?: string;
}

const WEEKLY: Template[] = [
  { key: "mon-fund", weekday: 0, start: "17:30", end: "18:30", kind: "small-group", title: "OL Fundamentals · Small Group", coachId: "coach-1", capacity: 8, baseTaken: 4, price: 45, credits: 1, description: "Stance, first step, hand placement and footwork fundamentals in a competitive small-group setting.", ageRange: "Grades 6–12" },
  { key: "tue-priv-a", weekday: 1, start: "16:00", end: "17:00", kind: "private", title: "Private Training · 1-on-1", coachId: "coach-1", capacity: 1, baseTaken: 0, price: 95, credits: 2, description: "One-on-one, position-specific instruction with technique evaluation and individualized plan." },
  { key: "tue-priv-b", weekday: 1, start: "17:00", end: "18:00", kind: "private", title: "Private Training · 1-on-1", coachId: "coach-2", capacity: 1, baseTaken: 1, price: 95, credits: 2, description: "One-on-one, position-specific instruction with technique evaluation and individualized plan." },
  { key: "wed-pass", weekday: 2, start: "18:00", end: "19:15", kind: "small-group", title: "Pass Protection Lab · Small Group", coachId: "coach-2", capacity: 8, baseTaken: 5, price: 45, credits: 1, description: "Pass sets, hand fighting, anchor and recognition against live rush looks.", ageRange: "Grades 8–12 + college" },
  { key: "thu-priv-a", weekday: 3, start: "16:30", end: "17:30", kind: "private", title: "Private Training · 1-on-1", coachId: "coach-3", capacity: 1, baseTaken: 0, price: 95, credits: 2, description: "One-on-one, position-specific instruction with technique evaluation and individualized plan." },
  { key: "thu-strength", weekday: 3, start: "18:00", end: "19:00", kind: "small-group", title: "Strength & Movement · Small Group", coachId: "coach-3", capacity: 10, baseTaken: 3, price: 40, credits: 1, description: "Lineman-specific strength, mobility and movement patterns that carry onto the field.", ageRange: "Grades 7–12" },
  { key: "sat-run", weekday: 5, start: "09:00", end: "10:15", kind: "small-group", title: "Run Game Lab · Small Group", coachId: "coach-3", capacity: 8, baseTaken: 6, price: 45, credits: 1, description: "Drive blocks, combos, climbs and pulls with a focus on leverage and finish.", ageRange: "Grades 8–12 + college" },
  { key: "sat-youth", weekday: 5, start: "10:30", end: "11:30", kind: "small-group", title: "Youth OL Academy · Small Group", coachId: "coach-1", capacity: 10, baseTaken: 4, price: 40, credits: 1, description: "Foundational technique and football IQ for our youngest linemen.", ageRange: "Ages 9–13" },
];

const EVENTS: { offset: number; t: Omit<Template, "weekday" | "key"> & { key: string; bring: string[] } }[] = [
  { offset: 12, t: { key: "clinic-pass", start: "09:00", end: "12:00", kind: "clinic", title: "Pass Protection Clinic", coachId: "coach-2", capacity: 24, baseTaken: 11, price: 65, credits: 0, ageRange: "Grades 8–12", description: "A half-day deep dive on pass sets, hand placement, anchor and blitz pickup with live reps and film.", bring: ["Cleats & turf shoes", "Football pants & practice jersey", "Water bottle", "Mouthguard"] } },
  { offset: 19, t: { key: "clinic-run", start: "09:00", end: "12:00", kind: "clinic", title: "Run Game & Combo Blocks Clinic", coachId: "coach-3", capacity: 24, baseTaken: 7, price: 65, credits: 0, ageRange: "Grades 8–12", description: "Drive blocks, double teams, climbs and pulls, taught by position with a focus on leverage and finish.", bring: ["Cleats & turf shoes", "Football pants & practice jersey", "Water bottle", "Mouthguard"] } },
  { offset: 33, t: { key: "camp-summit", start: "08:30", end: "15:00", kind: "camp", title: "Summit OL Camp · Full Day", coachId: "coach-1", capacity: 40, baseTaken: 18, price: 175, credits: 0, ageRange: "Grades 7–12", description: "Our flagship day camp: technique stations, 1-on-1s, football IQ sessions and a competitive finish. Lunch not included.", bring: ["Cleats & turf shoes", "Practice gear", "Lunch & water", "Notebook"] } },
  { offset: 47, t: { key: "clinic-youth", start: "13:00", end: "15:00", kind: "clinic", title: "Youth OL Skills Clinic", coachId: "coach-1", capacity: 30, baseTaken: 9, price: 45, credits: 0, ageRange: "Ages 9–13", description: "A fun, high-rep introduction to offensive line fundamentals for younger athletes.", bring: ["Cleats or athletic shoes", "Water bottle", "Mouthguard"] } },
  { offset: 61, t: { key: "camp-college", start: "09:00", end: "14:00", kind: "camp", title: "College Prep OL Camp", coachId: "coach-2", capacity: 30, baseTaken: 12, price: 195, credits: 0, ageRange: "Grades 10–12", description: "Recruit-focused development: advanced technique, film review and measurable testing guidance.", bring: ["Cleats & turf shoes", "Practice gear", "Lunch & water", "Highlight film link (optional)"] } },
];

/** Builds the next ~7 weeks of recurring sessions plus scheduled camps / clinics, relative to `today`. */
export function buildSeedSessions(today: string): Session[] {
  const out: Session[] = [];
  for (let i = 1; i <= 49; i++) {
    const date = addDays(today, i);
    const wd = weekdayIndex(date);
    for (const t of WEEKLY) {
      if (t.weekday !== wd) continue;
      out.push({
        id: `${t.key}-${date}`,
        kind: t.kind,
        title: t.title,
        date,
        start: t.start,
        end: t.end,
        location: TRAINING_LOCATION,
        coachId: t.coachId,
        capacity: t.capacity,
        // vary fill a little by week so the calendar doesn't look uniform
        baseTaken: Math.min(t.capacity, t.baseTaken + (Math.floor(i / 7) % 2 === 0 ? 0 : t.capacity > 1 ? -1 : 0)),
        price: t.price,
        credits: t.credits,
        description: t.description,
        ageRange: t.ageRange,
      });
    }
  }
  for (const e of EVENTS) {
    const date = addDays(today, e.offset);
    out.push({
      id: `${e.t.key}-${date}`,
      kind: e.t.kind,
      title: e.t.title,
      date,
      start: e.t.start,
      end: e.t.end,
      location: TRAINING_LOCATION,
      coachId: e.t.coachId,
      capacity: e.t.capacity,
      baseTaken: e.t.baseTaken,
      price: e.t.price,
      credits: 0,
      description: e.t.description,
      ageRange: e.t.ageRange,
      bring: e.t.bring,
    });
  }
  return out.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}

export const KIND_LABEL: Record<Session["kind"], string> = {
  private: "Private Training",
  "small-group": "Small Group",
  team: "Team Training",
  camp: "Camp",
  clinic: "Clinic",
};

/* --------------------------------- services --------------------------------- */

export const SERVICES = [
  { slug: "private-training", title: "Private Training", blurb: "One-on-one offensive line instruction.", href: "/training#private-training", kind: "private" },
  { slug: "small-group", title: "Small Group Training", blurb: "High-quality coaching in a competitive small-group environment.", href: "/training#small-group", kind: "small-group" },
  { slug: "memberships", title: "Memberships", blurb: "Recurring training options for athletes who want consistent development.", href: "/memberships", kind: null },
  { slug: "camps-clinics", title: "Camps & Clinics", blurb: "Special events, position-specific clinics and development opportunities.", href: "/camps-clinics", kind: null },
  { slug: "online-content", title: "Online Content", blurb: "Training resources, educational content, technique breakdowns and football development material.", href: "/content", kind: null },
] as const;

export const TRAINING_TYPES = [
  {
    id: "private-training",
    kind: "private" as const,
    title: "Private Training",
    summary: "The fastest path to cleaner technique. Every rep is yours.",
    points: ["One-on-one coaching", "Position-specific instruction", "Individualized development plan", "Technique evaluation with film"],
    cta: { label: "Book Now", href: "/book?type=private" },
  },
  {
    id: "small-group",
    kind: "small-group" as const,
    title: "Small Group Training",
    summary: "Competition raises the standard. Small groups keep the coaching personal.",
    points: ["Capped group sizes", "Position-specific drills", "Competitive environment", "Technique development every session"],
    cta: { label: "View Schedule", href: "/calendar?type=small-group" },
  },
  {
    id: "team-training",
    kind: "team" as const,
    title: "Team Training",
    summary: "Bring Summit's curriculum to your program. Coming soon.",
    points: ["High school teams", "Youth organizations", "Camps and team offseason programs", "Custom installs and film review"],
    cta: { label: "Contact Us", href: "/contact?topic=Team%20Training" },
  },
  {
    id: "camps-clinics",
    kind: "clinic" as const,
    title: "Camps & Clinics",
    summary: "Event-based development: focused clinics and full-day camps.",
    points: ["Position-specific clinics", "Full-day camps", "Open to all programs", "Limited spots per event"],
    cta: { label: "View Schedule", href: "/camps-clinics" },
  },
];

export const WHY = [
  { title: "Offensive Line Specific", text: "Every drill, rep and conversation is built for linemen. No generic football fitness." },
  { title: "Position-Specific Technique", text: "Stance to finish: hands, feet, leverage and timing taught the way the position is played." },
  { title: "Experienced Coaches", text: "Coaches who have played and coached the position at a high level." },
  { title: "Small Group Training", text: "Capped group sizes so every athlete gets coached on every rep." },
  { title: "Individual Development", text: "Evaluations and plans that meet each athlete where they are." },
  { title: "Football IQ", text: "Fronts, blitz ID, protection calls and film study: understand why it works." },
  { title: "Strength & Movement", text: "Lineman-specific strength, mobility and movement that carry to Friday night." },
  { title: "Competitive Environment", text: "Iron sharpens iron. Train beside athletes who push your standard higher." },
];

export const FAQS = [
  { q: "What ages and levels do you train?", a: "Youth through college offensive linemen: elementary and middle school through high school and college athletes." },
  { q: "Can I cancel or change my membership?", a: "Yes. Members can manage, upgrade or cancel from their account. See our Cancellation and Refund policies for details." },
  { q: "Do unused sessions roll over?", a: "Session credit rules are set per package. Your plan details show exactly how many sessions and credits remain." },
  { q: "Can a parent manage more than one athlete?", a: "Yes. A single parent account supports multiple athlete profiles, bookings and memberships." },
  { q: "What should my athlete bring?", a: "Cleats or turf shoes, practice gear, water and a mouthguard. Event pages list anything extra." },
];

/* ------------------------------- testimonials ------------------------------- */
// PLACEHOLDER samples. Replace with real testimonials (set placeholder: false) or connect Google Reviews.
export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", role: "athlete", name: "[Athlete Name]", detail: "Junior · Offensive Tackle", quote: "My stance and first step are completely different. I finally understand why each detail matters.", placeholder: true },
  { id: "t2", role: "parent", name: "[Parent Name]", detail: "Parent of a 9th-grade lineman", quote: "Small groups with real coaching on every rep. My son's confidence has grown as much as his technique.", placeholder: true },
  { id: "t3", role: "coach", name: "[Coach Name]", detail: "High School Head Coach", quote: "Linemen who train at Summit show up knowing the fundamentals and the why behind them.", placeholder: true },
];

/* ---------------------------------- content ---------------------------------- */

export const POST_CATEGORIES = [
  "Training Tips",
  "Offensive Line Technique",
  "Football IQ",
  "Strength & Conditioning",
  "Coach Education",
  "Athlete Development",
] as const;

export const POSTS: ContentPost[] = [
  {
    slug: "the-offensive-line-stance",
    category: "Offensive Line Technique",
    title: "The Offensive Line Stance: Where Every Rep Starts",
    excerpt: "A good stance is balanced, repeatable and ready to fire in any direction. Here is how to build one.",
    readTime: "4 min",
    date: "2026-09-02",
    body: [
      "Every block begins before the ball is snapped. A sound stance puts your body in a position to move quickly in any direction without giving away the play.",
      "Start with your feet about shoulder-width apart, toes pointing forward, weight balanced on the balls of your feet. Sink your hips, keep your back flat, and let your head and eyes stay up so you can see your landmark and the defender.",
      "Your hand placement decides how much weight you carry forward. Too much and you can't pull or pass set; too little and you lose power in the run game. The goal is a stance you can hold the same way, rep after rep.",
      "Practice your stance in a mirror or on video. If you can't hold it for ten seconds without wobbling, strengthen the hips and ankles before adding speed.",
    ],
  },
  {
    slug: "first-step-fundamentals",
    category: "Training Tips",
    title: "First-Step Fundamentals for Young Linemen",
    excerpt: "The first step wins or loses the rep. Learn the three rules that keep it short, low and powerful.",
    readTime: "3 min",
    date: "2026-08-18",
    body: [
      "Your first step should be short, quick and in the direction of the block. Over-striding leaves you reaching and off-balance.",
      "Keep the step low. Pushing your foot along the ground instead of lifting it keeps your pad level down and your base underneath you.",
      "Finally, never lose your eyes. The step is a movement of the feet, not the head. Look at your target while the body moves.",
    ],
  },
  {
    slug: "pass-protection-hand-placement",
    category: "Offensive Line Technique",
    title: "Pass Protection: Hands Inside, Elbows Tight",
    excerpt: "Winning inside hand position is the biggest difference between a good and a great pass blocker.",
    readTime: "5 min",
    date: "2026-07-29",
    body: [
      "Pass protection is a hand-fighting game. Win inside hand position and you control the rusher's chest; lose it and you spend the rep recovering.",
      "Strike with a firm base, thumbs up, elbows tight and wrists locked. Punch through the target rather than at it.",
      "Re-set the hands when they are knocked off. Quick, repeatable punches beat one big swing every time.",
    ],
  },
  {
    slug: "reading-defensive-fronts",
    category: "Football IQ",
    title: "Reading Defensive Fronts Before the Snap",
    excerpt: "Count the box, find the Mike, and know your protection before the quarterback says a word.",
    readTime: "6 min",
    date: "2026-07-10",
    body: [
      "Great linemen win mentally before they win physically. Identifying the front tells you who is covered, who is uncovered and where help will come from.",
      "Start by finding the Mike linebacker. In many protections, the Mike determines your slide direction and who is responsible for him.",
      "Then count the rushers. If there are more potential rushers than blockers, the quarterback or running back has a hot or sight-adjust built in. Know yours.",
    ],
  },
  {
    slug: "lineman-strength-basics",
    category: "Strength & Conditioning",
    title: "Strength Basics for Linemen: Build Strong, Stay Mobile",
    excerpt: "A simple framework for training legs, hips and posterior chain without sacrificing movement.",
    readTime: "5 min",
    date: "2026-06-24",
    body: [
      "Offensive linemen need strong hips, legs and backs, but strength without mobility turns into stiffness. Train both together.",
      "Prioritize squat and hinge patterns, single-leg work and loaded carries. Pair them with hip, ankle and thoracic mobility.",
      "Progress gradually and let technique, not ego, set the weight on the bar.",
    ],
  },
  {
    slug: "coaching-offensive-line-youth",
    category: "Coach Education",
    title: "Coaching Youth Offensive Linemen: Keep It Simple",
    excerpt: "Three teaching points that help young players learn faster and enjoy the position more.",
    readTime: "4 min",
    date: "2026-06-05",
    body: [
      "Young linemen learn best with one cue at a time. Pick a single coaching point per drill and repeat it.",
      "Make reps competitive and short. High repetition with feedback beats long lectures.",
      "Celebrate effort and technique, not just pancakes. It builds the habits that last.",
    ],
  },
  {
    slug: "developing-the-complete-lineman",
    category: "Athlete Development",
    title: "Developing the Complete Offensive Lineman",
    excerpt: "Technique, strength, football IQ and discipline: how the four pillars fit together.",
    readTime: "5 min",
    date: "2026-05-14",
    body: [
      "No single quality makes an offensive lineman. The best players combine technique, strength, football IQ and discipline.",
      "Technique is the language. Strength powers it. IQ tells you where to use it. Discipline makes sure it shows up every snap.",
      "That is the framework behind every Summit session, and why we measure development in more than just pounds on the bar.",
    ],
  },
  {
    slug: "pre-practice-warmup",
    category: "Training Tips",
    title: "A 10-Minute Pre-Practice Warm-Up for Linemen",
    excerpt: "Prepare your hips, ankles and shoulders so your first rep looks like your tenth.",
    readTime: "3 min",
    date: "2026-04-30",
    body: [
      "Start with light movement to raise your heart rate, then move through hip openers, leg swings and ankle rocks.",
      "Finish with a few activation reps: glute bridges, band walks and bear crawls. Keep it controlled, not rushed.",
    ],
  },
];

export const LIBRARY: LibraryItem[] = [
  { id: "l1", section: "Technique Library", title: "Stance", summary: "Balanced, repeatable and ready in any direction.", duration: "6:12", members: true },
  { id: "l2", section: "Technique Library", title: "First Step", summary: "Short, low and powerful: win the rep in 12 inches.", duration: "5:40", members: true },
  { id: "l3", section: "Technique Library", title: "Hand Placement", summary: "Inside hands, tight elbows, locked wrists.", duration: "8:05", members: true },
  { id: "l4", section: "Technique Library", title: "Pass Protection", summary: "Kick slide, set points and re-setting hands.", duration: "11:20", members: true },
  { id: "l5", section: "Technique Library", title: "Run Blocking", summary: "Drive, reach and cut-off fundamentals.", duration: "10:15", members: true },
  { id: "l6", section: "Technique Library", title: "Combo Blocks", summary: "Two blockers, one defender, clean exchange.", duration: "9:30", members: true },
  { id: "l7", section: "Technique Library", title: "Pulling", summary: "Pull paths, footwork and finding the target.", duration: "7:48", members: true },
  { id: "l8", section: "Technique Library", title: "Footwork & Leverage", summary: "Pad level and base: the foundation of everything.", duration: "8:55", members: true },
  { id: "l9", section: "Technique Library", title: "Anchor & Strike Timing", summary: "Sit down, absorb the bull rush and strike on time.", duration: "6:30", members: true },
  { id: "l10", section: "Training Videos", title: "Lineman Mobility Flow", summary: "15 minutes for hips, ankles and thoracic spine.", duration: "15:00", members: true },
  { id: "l11", section: "Training Videos", title: "Drill Demonstrations: Footwork Ladder", summary: "Five core footwork drills you can do anywhere.", duration: "12:10", members: true },
  { id: "l12", section: "Training Videos", title: "Strength Day: Lower Body", summary: "Squat, hinge and single-leg for linemen.", duration: "22:40", members: true },
  { id: "l13", section: "Football IQ", title: "Defensive Fronts", summary: "Identify even, odd and bear fronts quickly.", duration: "14:05", members: true },
  { id: "l14", section: "Football IQ", title: "Blitz Identification", summary: "Count threats and recognize pressure looks.", duration: "13:20", members: true },
  { id: "l15", section: "Football IQ", title: "Protection Calls & Film Study", summary: "Slides, hot routes and how to study your own tape.", duration: "18:00", members: true },
];

export const GALLERY: GalleryItem[] = [
  { id: "g1", category: "Action", caption: "Drive block off the line", tall: true },
  { id: "g2", category: "Training", caption: "Small-group technique session" },
  { id: "g3", category: "Athletes", caption: "Pre-session focus" },
  { id: "g4", category: "Coaches", caption: "Coach demonstrates hand placement" },
  { id: "g5", category: "Camps", caption: "Summit OL Camp kickoff", tall: true },
  { id: "g6", category: "Clinics", caption: "Pass protection clinic" },
  { id: "g7", category: "Facility", caption: "Training site" },
  { id: "g8", category: "Action", caption: "Pass set vs. live rush" },
  { id: "g9", category: "Training", caption: "Sled work: leverage and finish", tall: true },
  { id: "g10", category: "Athletes", caption: "Film review" },
  { id: "g11", category: "Camps", caption: "1-on-1 competition" },
  { id: "g12", category: "Clinics", caption: "Youth skills clinic" },
];

export interface CampaignInfo {
  key: string;
  value: string;
  label: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  statLabel: string;
  statValue: string;
  imageUrl: string | null;
}

export interface AgendaItem {
  id: string;
  title: string;
  summary: string;
  description: string;
  icon: string;
  category: string;
  imageUrl: string | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  authorName: string;
  imageUrl: string | null;
  videoUrl: string | null;
  isFeatured: boolean;
  publishedAt: string;
}

export interface CampaignEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  eventTime: string;
  category: string;
  imageUrl: string | null;
  maxAttendees: number | null;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  focus: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

export interface MediaAsset {
  id: string;
  title: string;
  description: string;
  type: string;
  assetUrl: string;
  thumbnailUrl: string | null;
  category: string;
}

export interface HomepageData {
  infos: CampaignInfo[];
  achievements: Achievement[];
  featuredNews: NewsArticle[];
  upcomingEvents: CampaignEvent[];
  testimonials: Testimonial[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface VolunteerPayload {
  name: string;
  phone: string;
  email?: string;
  lga?: string;
  ward?: string;
  pollingUnit?: string;
  skills?: string;
  interests?: string;
  availability?: string;
}

export interface JoinMovementPayload {
  name: string;
  phone: string;
  email?: string;
  lga?: string;
  ward?: string;
  interests?: string;
  skills?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface EventRegistrationPayload {
  name: string;
  phone: string;
  email?: string;
  lga?: string;
  ward?: string;
}

export interface CitizenFeedbackPayload {
  name: string;
  phone?: string;
  email?: string;
  lga?: string;
  message: string;
  topic?: string;
}

export interface IssueReportPayload {
  name: string;
  phone?: string;
  email?: string;
  lga?: string;
  ward?: string;
  category?: string;
  description: string;
}

export interface DonationPayload {
  name: string;
  email?: string;
  phone?: string;
  amount: number;
  notes?: string;
}

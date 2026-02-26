import { z } from "zod"

export const announcementCategorySchema = z.enum([
  "city",
  "community events",
  "crime & safety",
  "culture",
  "discounts & benefits",
  "emergencies",
  "for seniors",
  "health",
  "kids & family",
])

export type AnnouncementCategory = z.infer<typeof announcementCategorySchema>

export const announcementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  publicationDate: z.date(),
  lastUpdate: z.date(),
  categories: z.array(announcementCategorySchema).min(1, "At least one category is required"),
})

export type Announcement = z.infer<typeof announcementSchema>

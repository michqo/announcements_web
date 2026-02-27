import { z } from "zod"

export const categorySchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  displayName: z.string(),
})

export type Category = z.infer<typeof categorySchema>

export const announcementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  publicationDate: z.union([z.date(), z.string().pipe(z.coerce.date())]),
  lastUpdate: z.union([z.date(), z.string().pipe(z.coerce.date())]).optional(),
  categories: z.array(categorySchema).min(1, "At least one category is required"),
})

export type Announcement = z.infer<typeof announcementSchema>

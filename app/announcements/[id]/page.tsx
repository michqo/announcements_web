"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { announcementCategorySchema, AnnouncementCategory } from "../schema"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { format, parse, isValid } from "date-fns"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const categories: AnnouncementCategory[] = [
  "city",
  "community events",
  "crime & safety",
  "culture",
  "discounts & benefits",
  "emergencies",
  "for seniors",
  "health",
  "kids & family",
]

export default function EditAnnouncementPage() {
  const { id } = useParams()
  const router = useRouter()
  const anchor = useComboboxAnchor()

  const mockAnnouncements = [
    {
      id: "1",
      title: "New Playground in City Center",
      content: "We are excited to announce the opening of a new modern playground in the heart of the city center.",
      categories: ["city", "kids & family"] as AnnouncementCategory[],
      publicationDate: new Date(2024, 4, 15),
    },
    {
      id: "2",
      title: "Upcoming Community Festival",
      content: "Join us for our annual community festival with live music, food stalls, and family activities.",
      categories: ["community events", "culture"] as AnnouncementCategory[],
      publicationDate: new Date(2024, 4, 10),
    },
    {
      id: "3",
      title: "Annual Health Checkup Campaign",
      content: "Take control of your health with our free annual checkup campaign available for all city residents.",
      categories: ["health", "for seniors"] as AnnouncementCategory[],
      publicationDate: new Date(2024, 4, 5),
    },
    {
      id: "4",
      title: "Emergency Road Maintenance",
      content: "Please be aware of emergency road maintenance on Main Street this weekend. Expect delays.",
      categories: ["emergencies", "city"] as AnnouncementCategory[],
      publicationDate: new Date(2024, 4, 1),
    },
  ]

  const announcement = mockAnnouncements.find(a => a.id === id) || mockAnnouncements[0]

  const form = useForm({
    defaultValues: {
      title: announcement.title,
      content: announcement.content,
      categories: announcement.categories,
      publicationDate: format(announcement.publicationDate, "MM/dd/yyyy HH:mm"),
    },
    onSubmit: async ({ value }) => {
      const finalValue = {
        ...value,
        publicationDate: parse(value.publicationDate, "MM/dd/yyyy HH:mm", new Date())
      }
      console.log(finalValue)
      router.push("/announcements")
    },
  })

  return (
    <div className="flex flex-col flex-1 w-full p-10 bg-muted/20 min-h-0 items-center overflow-auto">
      <div className="py-24 max-w-3xl w-full">
        <Link 
          href="/announcements" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          <span>Back to list</span>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight font-heading">Edit Announcement</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Update the details of your announcement.
        </p>
      </div>

      <div className="bg-background p-8 rounded-xl shadow-sm border border-border/50 max-w-3xl w-full mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-4">Announcement Details</h2>
            
            <div className="grid gap-6">
              <form.Field
                name="title"
                validators={{
                  onChange: ({ value }) => {
                    const result = z.string().min(1, "Title is required").safeParse(value)
                    return result.success ? undefined : result.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter announcement title"
                      className="bg-muted/30"
                    />
                    {field.state.meta.errors ? (
                      <FieldError errors={field.state.meta.errors.map(e => ({ message: String(e) }))} />
                    ) : null}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="content"
                validators={{
                  onChange: ({ value }) => {
                    const result = z.string().min(1, "Content is required").safeParse(value)
                    return result.success ? undefined : result.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter announcement content"
                      rows={8}
                      className="bg-muted/30"
                    />
                    {field.state.meta.errors ? (
                      <FieldError errors={field.state.meta.errors.map(e => ({ message: String(e) }))} />
                    ) : null}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="categories"
                validators={{
                  onChange: ({ value }) => {
                    const result = z.array(announcementCategorySchema).min(1, "At least one category is required").safeParse(value)
                    return result.success ? undefined : result.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Categories</FieldLabel>
                    <Combobox
                      multiple
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val as AnnouncementCategory[])}
                    >
                      <ComboboxChips ref={anchor} className="bg-muted/30">
                        {field.state.value.map((cat) => (
                          <ComboboxChip key={cat}>
                            {cat}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput placeholder="Select categories..." />
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxList>
                          {categories.map((category) => (
                            <ComboboxItem key={category} value={category}>
                              {category}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {field.state.meta.errors ? (
                      <FieldError errors={field.state.meta.errors.map(e => ({ message: String(e) }))} />
                    ) : null}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="publicationDate"
                validators={{
                  onChange: ({ value }) => {
                    const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/
                    if (!regex.test(value)) return "Format: MM/DD/YYYY HH:mm"
                    
                    const parsedDate = parse(value, "MM/dd/yyyy HH:mm", new Date())
                    if (!isValid(parsedDate)) return "Invalid date"
                    
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Publication Date</FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. 10/12/2026 14:30"
                      className="bg-muted/30"
                    />
                    {field.state.meta.errors ? (
                      <FieldError errors={field.state.meta.errors.map(e => ({ message: String(e) }))} />
                    ) : null}
                  </Field>
                )}
              </form.Field>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-10 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button 
                  type="submit" 
                  disabled={!canSubmit} 
                  className="min-w-24 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? "Publishing..." : "Publish"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  )
}

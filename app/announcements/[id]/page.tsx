"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Category } from "../schema"
import { 
  useAnnouncement, 
  useCategories, 
  useUpdateAnnouncement 
} from "@/hooks/use-announcements"

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
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditAnnouncementPage() {
  const { id } = useParams()
  const router = useRouter()
  const anchor = useComboboxAnchor()

  const { 
    data: announcement, 
    isLoading: isLoadingAnnouncement, 
    isError: isErrorAnnouncement 
  } = useAnnouncement(id as string)
  const { 
    data: categoriesData, 
    isLoading: isLoadingCategories,
    isError: isErrorCategories
  } = useCategories()
  const updateAnnouncement = useUpdateAnnouncement()

  const form = useForm({
    defaultValues: {
      title: announcement?.title ?? "",
      content: announcement?.content ?? "",
      categories: (announcement?.categories ?? []).map((cat) => {
        const found = categoriesData?.find((c) => String(c.id) === String(cat.id))
        return found || cat
      }),
      publicationDate: announcement?.publicationDate 
        ? format(new Date(announcement.publicationDate), "MM/dd/yyyy HH:mm") 
        : "",
    },
    onSubmit: async ({ value }) => {
      await updateAnnouncement.mutateAsync({
        id: id as string,
        ...value,
        categories: value.categories.map((cat) => 
          typeof cat === "object" ? Number((cat as Category).id) : Number(cat)
        ),
        publicationDate: parse(value.publicationDate, "MM/dd/yyyy HH:mm", new Date()).toISOString()
      } as any)
      router.push("/announcements")
    },
  })

  React.useEffect(() => {
    if (announcement) {
      form.setFieldValue("title", announcement.title || "")
      form.setFieldValue("content", announcement.content || "")
      const mappedCategories = (announcement.categories || []).map((cat) => {
        const found = categoriesData?.find((c) => String(c.id) === String(cat.id))
        return found || cat
      })
      form.setFieldValue("categories", mappedCategories)
      
      let dateValue = ""
      if (announcement.publicationDate) {
        try {
          const d = new Date(announcement.publicationDate)
          if (!isNaN(d.getTime())) {
            dateValue = format(d, "MM/dd/yyyy HH:mm")
          }
        } catch (e) {
          console.error("Date formatting error", e)
        }
      }
      form.setFieldValue("publicationDate", dateValue)
    }
  }, [announcement, categoriesData, form])

  if (isLoadingAnnouncement || isLoadingCategories) {
    return (
      <div className="flex flex-col flex-1 w-full p-10 bg-muted/20 items-center">
        <div className="py-24 max-w-3xl w-full">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-12 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="bg-background p-8 rounded-xl shadow-sm border border-border/50 max-w-3xl w-full mb-10 space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isErrorAnnouncement || isErrorCategories || !announcement) {
    return (
      <div className="flex flex-col flex-1 w-full p-10 bg-muted/20 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Announcement</h2>
          <p className="text-muted-foreground mb-6">We couldn&apos;t find the announcement you&apos;re looking for or there was a problem with the server.</p>
          <Button onClick={() => router.push("/announcements")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Announcements
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 w-full p-10 bg-muted/20 items-center">
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
                    const result = z.array(z.any()).min(1, "At least one category is required").safeParse(value)
                    return result.success ? undefined : result.error.issues[0].message
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Categories</FieldLabel>
                    <Combobox
                      multiple
                      value={field.state.value || []}
                      onValueChange={(val) => field.handleChange(val as Category[])}
                    >
                      <ComboboxChips ref={anchor} className="bg-muted/30">
                        {(field.state.value || []).map((cat) => (
                          <ComboboxChip key={cat?.id}>
                            {cat?.displayName}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput 
                          placeholder={isLoadingCategories ? "Loading categories..." : "Select categories..."} 
                        />
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxList>
                          {categoriesData?.map((category) => (
                            <ComboboxItem key={category.id} value={category}>
                              {category.displayName}
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
              selector={(state) => [state.canSubmit]}
            >
              {([canSubmit]) => (
                <Button 
                  type="submit" 
                  disabled={!canSubmit || updateAnnouncement.isPending} 
                  className="min-w-24 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {updateAnnouncement.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : "Publish"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  )
}

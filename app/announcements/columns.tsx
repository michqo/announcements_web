"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Pencil } from "lucide-react"
import Link from "next/link"

import { Announcement, Category } from "./schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const formatSafeDate = (date: any) => {
  if (!date) return "N/A"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "Invalid date"
  return format(d, "MM/dd/yyyy HH:mm")
}

export const columns: ColumnDef<Announcement>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <span className="font-medium">{row.getValue("title")}</span>
      )
    },
  },
  {
    accessorKey: "publicationDate",
    header: "Publication date",
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{formatSafeDate(row.getValue("publicationDate"))}</div>
    },
  },
  {
    accessorKey: "lastUpdate",
    header: "Last Update",
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{formatSafeDate(row.getValue("lastUpdate"))}</div>
    },
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const categories = row.getValue("categories") as Category[]
      return (
        <div className="flex flex-wrap gap-1">
          {categories?.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const announcement = row.original
      return (
        <div className="flex justify-end pr-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/announcements/${announcement.id}`} aria-label={`Edit ${announcement.title}`}>
              <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
            </Link>
          </Button>
        </div>
      )
    },
  },
]

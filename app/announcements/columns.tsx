"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Pencil } from "lucide-react"
import Link from "next/link"

import { Announcement } from "./schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
      const date = row.getValue("publicationDate") as Date
      return <div className="text-muted-foreground">{format(date, "MM/dd/yyyy HH:mm")}</div>
    },
  },
  {
    accessorKey: "lastUpdate",
    header: "Last Update",
    cell: ({ row }) => {
      const date = row.getValue("lastUpdate") as Date
      return <div className="text-muted-foreground">{format(date, "MM/dd/yyyy HH:mm")}</div>
    },
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const categories = row.getValue("categories") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
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

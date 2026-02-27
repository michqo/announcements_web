"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useAnnouncements } from "@/hooks/use-announcements"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnnouncementPage() {
  const { data: announcements, isLoading, isError } = useAnnouncements()

  return (
    <div className="flex flex-col flex-1 w-full p-10 bg-muted/20">
      <div className="py-24">
        <h1 className="text-4xl font-extrabold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage and monitor all city-wide communications and official updates.
        </p>
      </div>
      <div className="flex-1 bg-background p-4 rounded-xl shadow-sm border border-border/50">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isError ? (
          <div className="text-destructive text-center py-10">
            Could not load announcements. Please make sure the API is running at http://localhost:8000
          </div>
        ) : (
          <DataTable columns={columns} data={announcements || []} />
        )}
      </div>
    </div>
  )
}

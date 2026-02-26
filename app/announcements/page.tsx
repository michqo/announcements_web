import { announcementSchema, Announcement } from "./schema"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

// Mock data that would normally come from an API or database
const mockData: Announcement[] = [
  {
    id: "1",
    title: "New Playground in City Center",
    publicationDate: new Date(2024, 4, 15, 10, 30),
    lastUpdate: new Date(2024, 4, 15, 10, 30),
    categories: ["city", "kids & family"],
  },
  {
    id: "2",
    title: "Upcoming Community Festival",
    publicationDate: new Date(2024, 4, 10, 9, 0),
    lastUpdate: new Date(2024, 4, 12, 14, 45),
    categories: ["community events", "culture"],
  },
  {
    id: "3",
    title: "Annual Health Checkup Campaign",
    publicationDate: new Date(2024, 4, 5, 8, 15),
    lastUpdate: new Date(2024, 4, 5, 8, 15),
    categories: ["health", "for seniors"],
  },
  {
    id: "4",
    title: "Emergency Road Maintenance",
    publicationDate: new Date(2024, 4, 1, 16, 20),
    lastUpdate: new Date(2024, 4, 2, 9, 10),
    categories: ["emergencies", "city"],
  },
]

// Validate mock data using zod
const validatedData = mockData.map((item) => announcementSchema.parse(item))

export default function AnnouncementPage() {
  return (
    <div className="flex flex-col flex-1 w-full p-10 bg-muted/20 min-h-0 overflow-auto">
      <div className="py-24">
        <h1 className="text-4xl font-extrabold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage and monitor all city-wide communications and official updates.
        </p>
      </div>
      <div className="flex-1 bg-background p-4 rounded-xl shadow-sm border border-border/50">
        <DataTable columns={columns} data={validatedData} />
      </div>
    </div>
  )
}

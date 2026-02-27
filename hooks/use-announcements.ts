import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Announcement, Category } from "../app/announcements/schema"

const API_ROOT = "http://localhost:8000"

export function useAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => {
      const resp = await fetch(`${API_ROOT}/announcements`)
      if (!resp.ok) throw new Error("Could not fetch announcements")
      return resp.json()
    },
  })
}

export function useAnnouncement(id: string) {
  return useQuery<Announcement>({
    queryKey: ["announcements", id],
    queryFn: async () => {
      const resp = await fetch(`${API_ROOT}/announcements/${id}`)
      if (!resp.ok) throw new Error("Could not fetch announcement")
      return resp.json()
    },
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const resp = await fetch(`${API_ROOT}/categories`)
      if (!resp.ok) throw new Error("Could not fetch categories")
      return resp.json()
    },
  })
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (announcement: Partial<Announcement> & { id: string }) => {
      const resp = await fetch(`${API_ROOT}/announcements/${announcement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      })
      if (!resp.ok) throw new Error("Could not update announcement")
      return resp.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] })
      queryClient.invalidateQueries({ queryKey: ["announcements", data.id] })
    },
  })
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (announcement: Omit<Announcement, "id">) => {
      const resp = await fetch(`${API_ROOT}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      })
      if (!resp.ok) throw new Error("Could not create announcement")
      return resp.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] })
    },
  })
}

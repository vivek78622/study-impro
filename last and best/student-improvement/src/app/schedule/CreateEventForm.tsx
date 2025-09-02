"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/DatePicker"

interface EventFormData {
  title: string
  date: Date
  start: string
  end: string
  category: string
  location?: string
  notes?: string
  priority?: "low" | "medium" | "high"
  reminder?: boolean
}

interface CreateEventFormProps {
  form: EventFormData
  setForm: (form: EventFormData) => void
  onSubmit: () => void
  onCancel: () => void
}

export default function CreateEventForm({ form, setForm, onSubmit, onCancel }: CreateEventFormProps) {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-3">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">Event Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g., Physics Lab Session"
          className="h-12 border-2 border-[#D2B48C]/40 rounded-xl bg-white/90 backdrop-blur-sm focus:border-[#C1E1C1] focus:ring-2 focus:ring-[#C1E1C1]/20 transition-all duration-200 shadow-sm hover:shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 relative z-[200]">
          <DatePicker
            label="Date"
            value={form.date}
            onChange={(date) => setForm({ ...form, date })}
            placeholder="Select date"
          />
        </div>
        <div className="space-y-3 relative z-[100]">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
          <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
            <SelectTrigger className="h-12 border-2 border-[#D2B48C]/40 rounded-xl bg-white/90 backdrop-blur-sm focus:border-[#C1E1C1] focus:ring-2 focus:ring-[#C1E1C1]/20 transition-all duration-200 shadow-sm hover:shadow-md">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="z-[150] bg-white/95 backdrop-blur-xl border-2 border-[#D2B48C]/40 rounded-xl shadow-xl">
              <SelectItem value="Classes">Classes</SelectItem>
              <SelectItem value="Study">Study</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Exams">Exams</SelectItem>
              <SelectItem value="Deadlines">Deadlines</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="start" className="text-sm font-medium text-gray-700">Start Time</Label>
          <Input
            id="start"
            type="time"
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
            className="h-12 border-2 border-[#D2B48C]/40 rounded-xl bg-white/90 backdrop-blur-sm focus:border-[#C1E1C1] focus:ring-2 focus:ring-[#C1E1C1]/20 transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="end" className="text-sm font-medium text-gray-700">End Time</Label>
          <Input
            id="end"
            type="time"
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
            className="h-12 border-2 border-[#D2B48C]/40 rounded-xl bg-white/90 backdrop-blur-sm focus:border-[#C1E1C1] focus:ring-2 focus:ring-[#C1E1C1]/20 transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location (Optional)</Label>
        <Input
          id="location"
          value={form.location || ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="e.g., Room 203, Library"
          className="h-12 border-2 border-[#D2B48C]/40 rounded-xl bg-white/90 backdrop-blur-sm focus:border-[#C1E1C1] focus:ring-2 focus:ring-[#C1E1C1]/20 transition-all duration-200 shadow-sm hover:shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-3 relative z-[50]">
          <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</Label>
          <Select value={form.priority || "medium"} onValueChange={(value: any) => setForm({ ...form, priority: value })}>
            <SelectTrigger className="h-12 border-2 border-[#D2B48C]/40 rounded-xl bg-white/90 backdrop-blur-sm focus:border-[#C1E1C1] focus:ring-2 focus:ring-[#C1E1C1]/20 transition-all duration-200 shadow-sm hover:shadow-md">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="z-[75] bg-white/95 backdrop-blur-xl border-2 border-[#D2B48C]/40 rounded-xl shadow-xl">
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3 h-12">
          <Switch
            id="reminder"
            checked={form.reminder || false}
            onCheckedChange={(checked) => setForm({ ...form, reminder: checked })}
            className="data-[state=checked]:bg-[#C1E1C1]"
          />
          <Label htmlFor="reminder" className="text-sm font-medium text-gray-700 cursor-pointer">Set Reminder</Label>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={form.notes || ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Additional details, requirements, etc."
          className="min-h-[80px] border-2 border-[#D2B48C]/40 rounded-xl bg-white/90 backdrop-blur-sm focus:border-[#C1E1C1] focus:ring-2 focus:ring-[#C1E1C1]/20 transition-all duration-200 resize-none shadow-sm hover:shadow-md"
          rows={3}
        />
      </div>

      <div className="flex gap-4 pt-6 border-t border-[#D2B48C]/20">
        <Button
          onClick={onSubmit}
          className="flex-1 h-12 bg-gradient-to-r from-[#C1E1C1] to-[#B5D6B5] hover:from-[#B5D6B5] hover:to-[#A8D0A8] text-gray-800 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          disabled={!form.title.trim()}
        >
          Save Event
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="h-12 px-6 border-2 border-[#D2B48C]/40 text-[#D2B48C] hover:bg-[#D2B48C]/10 hover:border-[#D2B48C] rounded-xl font-medium transition-all duration-200"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
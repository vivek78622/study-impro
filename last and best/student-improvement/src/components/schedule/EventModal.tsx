"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '../DatePicker'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreateScheduleEvent, ScheduleEvent } from '../../../models/schedule'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: CreateScheduleEvent) => void
  onSave?: (data: CreateScheduleEvent) => void
  onUpdate?: (id: string, data: Partial<ScheduleEvent>) => void
  onDelete?: (id: string) => void
  initialData?: Partial<ScheduleEvent>
  selectedDate?: Date
  mode?: 'create' | 'edit'
}

export default function EventModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onSave,
  onUpdate, 
  onDelete,
  initialData, 
  selectedDate,
  mode = 'create'
}: EventModalProps) {
  const [formData, setFormData] = useState<CreateScheduleEvent>({
    title: initialData?.title || '',
    date: selectedDate || initialData?.date?.toDate() || new Date(),
    start: initialData?.start || '09:00',
    end: initialData?.end || '10:00',
    category: initialData?.category || 'study',
    notes: initialData?.notes || '',
    priority: initialData?.priority || 'medium',
    reminder: initialData?.reminder || 'none',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'create') {
      if (onSubmit) onSubmit(formData)
      if (onSave) onSave(formData)
    } else if (mode === 'edit' && initialData?.id && onUpdate) {
      onUpdate(initialData.id, formData)
    }
    onClose()
  }

  const handleDelete = () => {
    if (initialData?.id && onDelete) {
      onDelete(initialData.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-muted/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'create' ? 'Add Event' : 'Edit Event'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Event title"
              className="border-muted/30"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <DatePicker
                value={formData.date}
                onChange={(date) => date && setFormData({ ...formData, date })}
                placeholder="Select date"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="border-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start Time *</Label>
              <Input
                id="start"
                type="time"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="border-muted/30"
                required
              />
            </div>
            <div>
              <Label htmlFor="end">End Time *</Label>
              <Input
                id="end"
                type="time"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="border-muted/30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="border-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reminder</Label>
              <Select value={formData.reminder} onValueChange={(value: any) => setFormData({ ...formData, reminder: value })}>
                <SelectTrigger className="border-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes"
              className="border-muted/30"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {mode === 'create' ? 'Create Event' : 'Update Event'}
            </Button>
            {mode === 'edit' && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="px-4"
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-muted text-muted-foreground hover:bg-muted/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
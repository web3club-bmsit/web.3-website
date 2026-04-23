"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getEvents,
  createEvent,
  updateEventStatus,
  deleteEvent,
  getRegistrationFields,
  upsertRegistrationFields,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  type EventRow,
  type RegistrationFieldRow,
  type TeamMemberRow,
} from "@/app/actions/admin";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Tab = "events" | "team";
type FieldDraft = {
  field_name: string;
  prompt: string;
  field_type: "text" | "email" | "number" | "select";
  required: boolean;
  options: string[] | null;
  sort_order: number;
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("events");

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">
            secure_admin_session_active
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-mono">
          <span className="text-green-400">ADMIN</span>_CONTROL_CENTER
        </h1>
      </header>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06] w-fit mb-8">
        {(["events", "team"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-xs font-semibold px-5 py-2.5 rounded-md transition-all duration-200 cursor-pointer ${
              tab === t
                ? "bg-green-400/[0.12] text-green-400 border border-green-400/20"
                : "text-white/30 hover:text-white/50 border border-transparent"
            }`}
          >
            {t === "events" ? "⚡ Events" : "👥 Team"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "events" ? <EventsPanel /> : <TeamPanel />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EVENTS PANEL
// ═══════════════════════════════════════════════════════════════

function EventsPanel() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFieldsFor, setEditingFieldsFor] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const { data } = await getEvents();
    setEvents(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleStatusChange = async (eventId: string, newStatus: "open" | "soon" | "closed") => {
    const res = await updateEventStatus(eventId, newStatus);
    if (res.success) {
      setFeedback({ type: "success", text: "Status updated" });
      loadEvents();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed" });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (eventId: string, title: string) => {
    if (!confirm(`Delete event "${title}"? This cannot be undone.`)) return;
    const res = await deleteEvent(eventId);
    if (res.success) {
      setFeedback({ type: "success", text: "Event deleted" });
      loadEvents();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed" });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div>
      {/* Feedback toast */}
      {feedback && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg font-mono text-sm border backdrop-blur-md animate-pulse ${
            feedback.type === "success"
              ? "bg-green-400/10 border-green-400/30 text-green-400"
              : "bg-red-400/10 border-red-400/30 text-red-400"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-lg text-white/60">
          Events <span className="text-white/20">({events.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-green-400 text-black font-mono text-xs font-bold rounded-lg hover:bg-green-300 transition-colors cursor-pointer"
        >
          + Add Event
        </button>
      </div>

      {/* Event creation modal */}
      {showForm && (
        <EventFormModal
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            setFeedback({ type: "success", text: "Event created!" });
            loadEvents();
            setTimeout(() => setFeedback(null), 3000);
          }}
        />
      )}

      {/* Registration fields editor modal */}
      {editingFieldsFor && (
        <FieldsEditorModal
          eventId={editingFieldsFor}
          eventTitle={events.find((e) => e.id === editingFieldsFor)?.title || ""}
          onClose={() => setEditingFieldsFor(null)}
          onSaved={() => {
            setEditingFieldsFor(null);
            setFeedback({ type: "success", text: "Registration fields saved!" });
            setTimeout(() => setFeedback(null), 3000);
          }}
        />
      )}

      {/* Events list */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-6 h-6 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 border border-white/[0.06] rounded-xl bg-white/[0.02]">
          <p className="text-white/20 font-mono text-sm">No events yet. Create your first one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEditFields={() => setEditingFieldsFor(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Event Card ────────────────────────────────────────────────

function EventCard({
  event,
  onStatusChange,
  onDelete,
  onEditFields,
}: {
  event: EventRow;
  onStatusChange: (id: string, status: "open" | "soon" | "closed") => void;
  onDelete: (id: string, title: string) => void;
  onEditFields: () => void;
}) {
  const statusColors: Record<string, string> = {
    open: "bg-green-400/10 text-green-400 border-green-400/20",
    soon: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    closed: "bg-red-400/10 text-red-400 border-red-400/20",
  };

  return (
    <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="flex items-start gap-4">
        {/* Image thumbnail */}
        {event.image_url && (
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/[0.06]">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-mono text-sm font-bold text-white truncate">{event.title}</h3>
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${statusColors[event.status]}`}
            >
              {event.status}
            </span>
          </div>
          <p className="text-xs text-white/30 font-mono mb-2 truncate">{event.subtitle}</p>
          <div className="flex flex-wrap gap-3 text-[10px] text-white/20 font-mono">
            <span>{event.date}</span>
            <span>{event.location}</span>
            <span>Team {event.team_min}–{event.team_max}</span>
            {event.chain && <span className="text-blue-400/50">{event.chain}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Status toggle */}
          <select
            value={event.status}
            onChange={(e) => onStatusChange(event.id, e.target.value as "open" | "soon" | "closed")}
            className="bg-white/[0.05] border border-white/[0.1] text-white/60 text-xs font-mono rounded-md px-2 py-1.5 outline-none cursor-pointer hover:border-green-400/30 transition-colors"
          >
            <option value="open" className="bg-[#0a0c0f]">Open</option>
            <option value="soon" className="bg-[#0a0c0f]">Coming Soon</option>
            <option value="closed" className="bg-[#0a0c0f]">Closed</option>
          </select>

          {/* Edit registration fields */}
          <button
            onClick={onEditFields}
            className="px-3 py-1.5 border border-white/[0.1] text-white/40 text-xs font-mono rounded-md hover:border-green-400/30 hover:text-green-400/60 transition-colors cursor-pointer"
            title="Edit registration fields"
          >
            📝 Fields
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(event.id, event.title)}
            className="px-3 py-1.5 border border-red-500/30 text-red-400 text-sm font-mono font-semibold rounded-md hover:bg-red-500/10 hover:border-red-400/60 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Event Form Modal ──────────────────────────────────────────

function EventFormModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await createEvent(formData);
    if (res.success) {
      onCreated();
    } else {
      setError(res.error || "Failed to create event");
    }
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0c0f] border border-green-500/20 rounded-xl shadow-[0_0_100px_rgba(34,197,94,0.15)]">
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/10 bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
          <h3 className="font-mono text-sm font-bold text-green-400">+ CREATE_NEW_EVENT</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-2">
              Event Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-white/[0.1] hover:border-green-400/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg object-cover" />
              ) : (
                <>
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📷</div>
                  <p className="text-xs text-white/30 font-mono">Click to upload event image</p>
                  <p className="text-[10px] text-white/15 font-mono mt-1">PNG, JPG, WebP — max 5MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Title + Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" name="title" placeholder="ETH Build Weekend" required />
            <FormField label="Subtitle" name="subtitle" placeholder="48-hour smart contract hackathon" />
          </div>

          {/* Date + Start Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Display Date" name="date" placeholder="May 24–26, 2026" required />
            <FormField label="Start Date (ISO)" name="start_date" type="datetime-local" required />
          </div>

          {/* Location + Prize */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Location" name="location" placeholder="Main Campus · Auditorium A" />
            <FormField label="Prize" name="prize" placeholder="₹2,00,000 Prize Pool" />
          </div>

          {/* Team size + Chain + Status */}
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Min Team" name="team_min" type="number" placeholder="1" />
            <FormField label="Max Team" name="team_max" type="number" placeholder="4" />
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                name="status"
                defaultValue="open"
                className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:border-green-400/40 transition-colors"
              >
                <option value="open" className="bg-[#0a0c0f]">Open</option>
                <option value="soon" className="bg-[#0a0c0f]">Coming Soon</option>
                <option value="closed" className="bg-[#0a0c0f]">Closed</option>
              </select>
            </div>
          </div>

          {/* Chain */}
          <FormField label="Chain (optional)" name="chain" placeholder="Ethereum, Solana, Polygon..." />

          {/* Tags + Sponsors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tags (comma-separated)" name="tags" placeholder="Hackathon, DeFi, 24h" />
            <FormField label="Sponsors (comma-separated)" name="sponsors" placeholder="Alchemy, Base, Chainlink" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Describe your event..."
              className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:border-green-400/40 transition-colors resize-none placeholder:text-white/15"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-white/[0.1] text-white/40 text-xs font-mono rounded-lg hover:text-white/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-green-400 text-black text-xs font-mono font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Creating..." : "Create Event →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Registration Fields Editor Modal ──────────────────────────

function FieldsEditorModal({
  eventId,
  eventTitle,
  onClose,
  onSaved,
}: {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fields, setFields] = useState<FieldDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getRegistrationFields(eventId);
      if (data.length > 0) {
        setFields(
          data.map((f) => ({
            field_name: f.field_name,
            prompt: f.prompt,
            field_type: f.field_type,
            required: f.required,
            options: f.options,
            sort_order: f.sort_order,
          }))
        );
      } else {
        // Default fields
        setFields([
          { field_name: "name", prompt: "Enter your name", field_type: "text", required: true, options: null, sort_order: 0 },
          { field_name: "college", prompt: "Enter your college (or type none)", field_type: "text", required: true, options: null, sort_order: 1 },
          { field_name: "year", prompt: "Enter your graduation year (or type none)", field_type: "text", required: true, options: null, sort_order: 2 },
        ]);
      }
      setLoading(false);
    };
    load();
  }, [eventId]);

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        field_name: "",
        prompt: "",
        field_type: "text",
        required: true,
        options: null,
        sort_order: prev.length,
      },
    ]);
  };

  const removeField = (idx: number) => {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateField = (idx: number, key: keyof FieldDraft, value: any) => {
    setFields((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [key]: value } : f))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await upsertRegistrationFields(eventId, fields);
    if (res.success) {
      onSaved();
    } else {
      alert(res.error || "Failed to save");
    }
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0a0c0f] border border-green-500/20 rounded-xl shadow-[0_0_100px_rgba(34,197,94,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/10 bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h3 className="font-mono text-sm font-bold text-green-400">REGISTRATION_FIELDS</h3>
            <p className="text-[10px] text-white/30 font-mono mt-0.5">for: {eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block w-6 h-6 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-xs text-white/30 font-mono mb-4">
                These fields will be shown to users during registration in the terminal. Drag to reorder (or use the order they appear here).
              </p>

              <div className="flex flex-col gap-3 mb-4">
                {fields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-green-400/50 font-bold">
                        FIELD #{idx + 1}
                      </span>
                      <button
                        onClick={() => removeField(idx)}
                        className="text-[10px] font-mono text-red-400/50 hover:text-red-400 cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-white/30 uppercase mb-1">
                          Field Name (key)
                        </label>
                        <input
                          type="text"
                          value={field.field_name}
                          onChange={(e) => updateField(idx, "field_name", e.target.value)}
                          placeholder="college"
                          className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-xs font-mono rounded-md px-2.5 py-2 outline-none focus:border-green-400/40 transition-colors placeholder:text-white/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-white/30 uppercase mb-1">
                          Type
                        </label>
                        <select
                          value={field.field_type}
                          onChange={(e) => updateField(idx, "field_type", e.target.value)}
                          className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-xs font-mono rounded-md px-2.5 py-2 outline-none focus:border-green-400/40 transition-colors"
                        >
                          <option value="text" className="bg-[#0a0c0f]">Text</option>
                          <option value="email" className="bg-[#0a0c0f]">Email</option>
                          <option value="number" className="bg-[#0a0c0f]">Number</option>
                          <option value="select" className="bg-[#0a0c0f]">Select</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-white/30 uppercase mb-1">
                        Prompt (shown to user)
                      </label>
                      <input
                        type="text"
                        value={field.prompt}
                        onChange={(e) => updateField(idx, "prompt", e.target.value)}
                        placeholder="Enter your college (or type none)"
                        className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-xs font-mono rounded-md px-2.5 py-2 outline-none focus:border-green-400/40 transition-colors placeholder:text-white/15"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(idx, "required", e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-green-400"
                        />
                        <span className="text-[10px] font-mono text-white/40">Required</span>
                      </label>
                    </div>

                    {field.field_type === "select" && (
                      <div>
                        <label className="block text-[9px] font-mono text-white/30 uppercase mb-1">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={(field.options || []).join(", ")}
                          onChange={(e) =>
                            updateField(
                              idx,
                              "options",
                              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                            )
                          }
                          placeholder="Option 1, Option 2, Option 3"
                          className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-xs font-mono rounded-md px-2.5 py-2 outline-none focus:border-green-400/40 transition-colors placeholder:text-white/15"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addField}
                className="w-full py-2.5 border border-dashed border-white/[0.1] hover:border-green-400/30 text-white/30 hover:text-green-400/60 text-xs font-mono rounded-lg transition-colors cursor-pointer mb-6"
              >
                + Add Field
              </button>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-white/[0.1] text-white/40 text-xs font-mono rounded-lg hover:text-white/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-green-400 text-black text-xs font-mono font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Fields →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TEAM PANEL
// ═══════════════════════════════════════════════════════════════

function TeamPanel() {
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberRow | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const data = await getTeamMembers();
    setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the team?`)) return;
    const res = await deleteTeamMember(id);
    if (res.success) {
      setFeedback({ type: "success", text: "Member removed" });
      loadMembers();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed" });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div>
      {/* Feedback toast */}
      {feedback && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg font-mono text-sm border backdrop-blur-md ${
            feedback.type === "success"
              ? "bg-green-400/10 border-green-400/30 text-green-400"
              : "bg-red-400/10 border-red-400/30 text-red-400"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-lg text-white/60">
          Team Members <span className="text-white/20">({members.length})</span>
        </h2>
        <button
          onClick={() => {
            setEditingMember(null);
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-green-400 text-black font-mono text-xs font-bold rounded-lg hover:bg-green-300 transition-colors cursor-pointer"
        >
          + Add Member
        </button>
      </div>

      {/* Team member form modal */}
      {showForm && (
        <TeamMemberFormModal
          initialData={editingMember}
          onClose={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          onCreated={() => {
            setShowForm(false);
            setEditingMember(null);
            setFeedback({ type: "success", text: editingMember ? "Member updated!" : "Member added!" });
            loadMembers();
            setTimeout(() => setFeedback(null), 3000);
          }}
        />
      )}

      {/* Members grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-6 h-6 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 border border-white/[0.06] rounded-xl bg-white/[0.02]">
          <p className="text-white/20 font-mono text-sm">No team members yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/[0.1] shrink-0 bg-white/[0.05]">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-lg font-bold">
                      {member.name[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-mono text-sm font-bold text-white truncate">{member.name}</h3>
                  <p className="text-[10px] text-green-400/60 font-mono uppercase tracking-wider">{member.role}</p>
                  <p className="text-[10px] text-cyan-400/50 font-mono uppercase tracking-wider mt-0.5">{member.department}</p>
                  {member.description && (
                    <p className="text-xs text-white/30 mt-1 line-clamp-2">{member.description}</p>
                  )}

                  {/* Social icons */}
                  <div className="flex gap-2 mt-2">
                    {Object.entries(member.socials || {}).map(([platform, url]) =>
                      url && url !== "#" ? (
                        <span key={platform} className="text-[9px] font-mono text-white/20">
                          {platform}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setShowForm(true);
                    }}
                    className="text-lg text-white/30 hover:text-green-400 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="text-lg text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Team Member Form Modal ────────────────────────────────────

function TeamMemberFormModal({
  initialData,
  onClose,
  onCreated,
}: {
  initialData?: TeamMemberRow | null;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = initialData
      ? await updateTeamMember(initialData.id, formData)
      : await createTeamMember(formData);

    if (res.success) {
      onCreated();
    } else {
      setError(res.error || `Failed to ${initialData ? 'update' : 'add'} member`);
    }
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0a0c0f] border border-green-500/20 rounded-xl shadow-[0_0_100px_rgba(34,197,94,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/10 bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
          <h3 className="font-mono text-sm font-bold text-green-400">{initialData ? "✏️ EDIT_TEAM_MEMBER" : "+ ADD_TEAM_MEMBER"}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-2">
              Photo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/[0.1] hover:border-green-400/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <>
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">👤</div>
                  <p className="text-xs text-white/30 font-mono">Upload photo</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Name + Role */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Name" name="name" defaultValue={initialData?.name} placeholder="Vitalik Buterin" required />
            <FormField label="Role" name="role" defaultValue={initialData?.role} placeholder="Protocol Lead" required />
          </div>

          {/* Department & Hierarchy */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-2">
                Department
              </label>
              <select
                name="department"
                required
                defaultValue={initialData?.department || ""}
                className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:border-green-400/40 transition-colors"
              >
                <option value="" disabled className="bg-[#0a0c0f]">Select department...</option>
                <option value="core" className="bg-[#0a0c0f]">Core</option>
                <option value="media & design" className="bg-[#0a0c0f]">Media &amp; Design</option>
                <option value="tech" className="bg-[#0a0c0f]">Tech</option>
                <option value="marketing" className="bg-[#0a0c0f]">Marketing</option>
                <option value="event&ops" className="bg-[#0a0c0f]">Event &amp; Ops</option>
                <option value="corporate relations" className="bg-[#0a0c0f]">Corporate Relations</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-2">
                Hierarchy Level
              </label>
              <select
                name="hierarchy_level"
                defaultValue={initialData?.hierarchy_level || ""}
                className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:border-green-400/40 transition-colors"
              >
                <option value="" className="bg-[#0a0c0f]">Associate (Default)</option>
                <option value="president" className="bg-[#0a0c0f]">President / Vice President</option>
                <option value="lead" className="bg-[#0a0c0f]">Lead</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <FormField label="Description" name="description" defaultValue={initialData?.description || ""} placeholder="Short bio..." />

          {/* Socials */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-2">
              Social Links
            </label>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="" name="twitter" defaultValue={initialData?.socials?.twitter || ""} placeholder="Twitter URL" />
              <FormField label="" name="linkedin" defaultValue={initialData?.socials?.linkedin || ""} placeholder="LinkedIn URL" />
              <FormField label="" name="github" defaultValue={initialData?.socials?.github || ""} placeholder="GitHub URL" />
              <FormField label="" name="instagram" defaultValue={initialData?.socials?.instagram || ""} placeholder="Instagram URL" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-white/[0.1] text-white/40 text-xs font-mono rounded-lg hover:text-white/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-green-400 text-black text-xs font-mono font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Member →" : "Add Member →")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Shared Form Field component
// ═══════════════════════════════════════════════════════════════

function FormField({
  label,
  name,
  placeholder,
  required,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full bg-white/[0.05] border border-white/[0.1] text-white/70 text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:border-green-400/40 transition-colors placeholder:text-white/15"
      />
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { useDJs, useSchedule } from "../hooks/useQueries";
import { StorageClient } from "../utils/StorageClient";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: String(i),
  label:
    i === 0
      ? "12 AM"
      : i < 12
        ? `${i} AM`
        : i === 12
          ? "12 PM"
          : `${i - 12} PM`,
}));

function formatHour(h: bigint): string {
  const n = Number(h);
  if (n === 0) return "12:00 AM";
  if (n < 12) return `${n}:00 AM`;
  if (n === 12) return "12:00 PM";
  return `${n - 12}:00 PM`;
}

const cardStyle: React.CSSProperties = {
  background: "rgba(15,25,40,0.92)",
  border: "1px solid rgba(80,120,180,0.3)",
  borderRadius: "1rem",
  padding: "1.5rem",
  backdropFilter: "blur(10px)",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(20,30,50,0.8)",
  border: "1px solid rgba(80,120,180,0.4)",
  color: "#e2e8f0",
  borderRadius: "0.5rem",
};

type ShowFormState = {
  showName: string;
  hostName: string;
  description: string;
  dayOfWeek: string;
  startHour: string;
  endHour: string;
};

const emptyForm: ShowFormState = {
  showName: "",
  hostName: "",
  description: "",
  dayOfWeek: "0",
  startHour: "8",
  endHour: "9",
};

function ShowFormFields({
  form,
  setForm,
  idPrefix,
}: {
  form: ShowFormState;
  setForm: React.Dispatch<React.SetStateAction<ShowFormState>>;
  idPrefix: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label style={{ color: "#93c5fd" }}>Show Name</Label>
        <Input
          style={inputStyle}
          value={form.showName}
          onChange={(e) => setForm((p) => ({ ...p, showName: e.target.value }))}
          placeholder="Holiday Morning Show"
          data-ocid={`${idPrefix}.show-name.input`}
        />
      </div>
      <div>
        <Label style={{ color: "#93c5fd" }}>Host Name</Label>
        <Input
          style={inputStyle}
          value={form.hostName}
          onChange={(e) => setForm((p) => ({ ...p, hostName: e.target.value }))}
          placeholder="Santa Claus"
          data-ocid={`${idPrefix}.host-name.input`}
        />
      </div>
      <div className="md:col-span-2">
        <Label style={{ color: "#93c5fd" }}>Description</Label>
        <Input
          style={inputStyle}
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="A festive show bringing holiday cheer..."
          data-ocid={`${idPrefix}.description.input`}
        />
      </div>
      <div>
        <Label style={{ color: "#93c5fd" }}>Day of Week (CST)</Label>
        <Select
          value={form.dayOfWeek}
          onValueChange={(v) => setForm((p) => ({ ...p, dayOfWeek: v }))}
        >
          <SelectTrigger
            style={inputStyle}
            data-ocid={`${idPrefix}.day.select`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAY_NAMES.map((d) => (
              <SelectItem key={d} value={String(DAY_NAMES.indexOf(d))}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label style={{ color: "#93c5fd" }}>Start Hour (CST)</Label>
          <Select
            value={form.startHour}
            onValueChange={(v) => setForm((p) => ({ ...p, startHour: v }))}
          >
            <SelectTrigger
              style={inputStyle}
              data-ocid={`${idPrefix}.start-hour.select`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={`start-${h.value}`} value={h.value}>
                  {h.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label style={{ color: "#93c5fd" }}>End Hour (CST)</Label>
          <Select
            value={form.endHour}
            onValueChange={(v) => setForm((p) => ({ ...p, endHour: v }))}
          >
            <SelectTrigger
              style={inputStyle}
              data-ocid={`${idPrefix}.end-hour.select`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={`end-${h.value}`} value={h.value}>
                  {h.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function ShowsTab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: shows = [] } = useSchedule();
  const [confirming, setConfirming] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ShowFormState>(emptyForm);

  const [form, setForm] = useState<ShowFormState>(emptyForm);

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.addShow({
        showName: form.showName,
        hostName: form.hostName,
        description: form.description,
        dayOfWeek: BigInt(form.dayOfWeek),
        startHour: BigInt(form.startHour),
        endHour: BigInt(form.endHour),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["currentShow"] });
      toast.success("Show added successfully! 🎄");
      setForm(emptyForm);
    },
    onError: () => toast.error("Failed to add show"),
  });

  const updateMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateShow(BigInt(index), {
        showName: editForm.showName,
        hostName: editForm.hostName,
        description: editForm.description,
        dayOfWeek: BigInt(editForm.dayOfWeek),
        startHour: BigInt(editForm.startHour),
        endHour: BigInt(editForm.endHour),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["currentShow"] });
      toast.success("Show updated! 🎄");
      setEditingIndex(null);
    },
    onError: () => toast.error("Failed to update show"),
  });

  const removeMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error("Not connected");
      await actor.removeShow(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["currentShow"] });
      toast.success("Show removed");
    },
    onError: () => toast.error("Failed to remove show"),
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).clearAllShows();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["currentShow"] });
      toast.success("All shows cleared");
      setConfirming(false);
    },
    onError: () => {
      toast.error("Failed to clear shows");
      setConfirming(false);
    },
  });

  function startEdit(index: number) {
    const show = shows[index];
    setEditingIndex(index);
    setEditForm({
      showName: show.showName,
      hostName: show.hostName,
      description: show.description,
      dayOfWeek: String(Number(show.dayOfWeek)),
      startHour: String(Number(show.startHour)),
      endHour: String(Number(show.endHour)),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={cardStyle} data-ocid="admin.panel">
        <h2
          style={{
            fontFamily: "'Mountains of Christmas', serif",
            fontSize: "1.4rem",
            color: "#86efac",
            marginBottom: "1.25rem",
          }}
        >
          ➕ Add New Show
        </h2>
        <ShowFormFields form={form} setForm={setForm} idPrefix="admin" />
        <Button
          onClick={() => addMutation.mutate()}
          disabled={addMutation.isPending || !form.showName || !form.hostName}
          style={{
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            color: "white",
            border: "none",
            fontWeight: 700,
            marginTop: "1rem",
          }}
          data-ocid="admin.submit_button"
        >
          {addMutation.isPending ? "Adding..." : "🎄 Add Show"}
        </Button>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontFamily: "'Mountains of Christmas', serif",
              fontSize: "1.4rem",
              color: "#86efac",
              margin: 0,
            }}
          >
            📋 Current Schedule
          </h2>

          {shows.length > 0 && (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {confirming ? (
                <>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#fca5a5",
                      fontWeight: 600,
                    }}
                  >
                    Are you sure?
                  </span>
                  <Button
                    size="sm"
                    onClick={() => clearAllMutation.mutate()}
                    disabled={clearAllMutation.isPending}
                    style={{
                      background: "linear-gradient(135deg, #b91c1c, #991b1b)",
                      color: "white",
                      border: "none",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                    data-ocid="admin.schedule.confirm_button"
                  >
                    {clearAllMutation.isPending
                      ? "Clearing..."
                      : "Yes, clear all"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirming(false)}
                    disabled={clearAllMutation.isPending}
                    style={{
                      borderColor: "rgba(80,120,180,0.4)",
                      color: "#93c5fd",
                      background: "transparent",
                      fontSize: "0.8rem",
                    }}
                    data-ocid="admin.schedule.cancel_button"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setConfirming(true)}
                  style={{
                    background: "rgba(185,28,28,0.2)",
                    border: "1px solid rgba(185,28,28,0.5)",
                    color: "#fca5a5",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}
                  data-ocid="admin.schedule.delete_button"
                >
                  🗑️ Clear All Shows
                </Button>
              )}
            </div>
          )}
        </div>

        {shows.length === 0 ? (
          <p
            style={{ color: "rgba(150,170,200,0.6)", fontStyle: "italic" }}
            data-ocid="admin.schedule.empty_state"
          >
            No shows scheduled yet.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {shows.map((show, i) =>
              editingIndex === i ? (
                // ─── EDIT MODE ──────────────────────────────────────────────
                <div
                  key={`edit-${show.showName}-${show.dayOfWeek}-${show.startHour}`}
                  data-ocid={`admin.schedule.edit.${i + 1}`}
                  style={{
                    background: "rgba(20,50,30,0.6)",
                    border: "1px solid rgba(80,200,100,0.35)",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#86efac",
                      fontWeight: 700,
                      marginBottom: "0.75rem",
                    }}
                  >
                    ✏️ Editing show #{i + 1}
                  </p>
                  <ShowFormFields
                    form={editForm}
                    setForm={setEditForm}
                    idPrefix={`admin.edit.${i}`}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    <Button
                      size="sm"
                      onClick={() => updateMutation.mutate(i)}
                      disabled={
                        updateMutation.isPending ||
                        !editForm.showName ||
                        !editForm.hostName
                      }
                      style={{
                        background: "linear-gradient(135deg, #16a34a, #15803d)",
                        color: "white",
                        border: "none",
                        fontWeight: 700,
                      }}
                      data-ocid={`admin.schedule.save_button.${i + 1}`}
                    >
                      {updateMutation.isPending
                        ? "Saving..."
                        : "💾 Save Changes"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingIndex(null)}
                      disabled={updateMutation.isPending}
                      style={{
                        borderColor: "rgba(80,120,180,0.4)",
                        color: "#93c5fd",
                        background: "transparent",
                      }}
                      data-ocid={`admin.schedule.cancel_edit_button.${i + 1}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // ─── VIEW MODE ──────────────────────────────────────────────
                <div
                  key={`${show.showName}-${show.dayOfWeek}-${show.startHour}`}
                  data-ocid={`admin.schedule.item.${i + 1}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(80,120,180,0.2)",
                    borderRadius: "0.75rem",
                    padding: "0.875rem 1rem",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#e2e8f0",
                        marginBottom: "2px",
                      }}
                    >
                      {show.showName}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(147,197,253,0.8)",
                      }}
                    >
                      {DAY_NAMES[Number(show.dayOfWeek)]} ·{" "}
                      {formatHour(show.startHour)} – {formatHour(show.endHour)}{" "}
                      CST · with {show.hostName}
                    </div>
                    {show.description && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "rgba(180,200,220,0.6)",
                          marginTop: "2px",
                        }}
                      >
                        {show.description}
                      </div>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}
                  >
                    <Button
                      size="sm"
                      onClick={() => startEdit(i)}
                      style={{
                        background: "rgba(37,99,235,0.2)",
                        border: "1px solid rgba(59,130,246,0.5)",
                        color: "#93c5fd",
                        fontWeight: 600,
                      }}
                      data-ocid={`admin.schedule.edit_button.${i + 1}`}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMutation.mutate(i)}
                      disabled={removeMutation.isPending}
                      data-ocid={`admin.schedule.delete_button.${i + 1}`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DJsTab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: djs = [] } = useDJs();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    specialty: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null);
    }
  }

  function clearPhotoSelection() {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");

      let photoUrl = "";

      if (photoFile) {
        setUploadStatus("Uploading photo...");
        const config = await loadConfig();
        const agent = new HttpAgent({ host: config.backend_host });
        if (config.backend_host?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {});
        }
        const storageClient = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes);
        photoUrl = await storageClient.getDirectURL(hash);
        setUploadStatus("Adding DJ...");
      }

      await (actor as any).addDJ(form.name, form.bio, form.specialty, photoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["djs"] });
      toast.success("DJ added! 🎧");
      setForm({ name: "", bio: "", specialty: "" });
      clearPhotoSelection();
      setUploadStatus(null);
    },
    onError: () => {
      toast.error("Failed to add DJ");
      setUploadStatus(null);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (djId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.removeDJ(djId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["djs"] });
      toast.success("DJ removed");
    },
    onError: () => toast.error("Failed to remove DJ"),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "'Mountains of Christmas', serif",
            fontSize: "1.4rem",
            color: "#86efac",
            marginBottom: "1.25rem",
          }}
        >
          ➕ Add New DJ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label style={{ color: "#93c5fd" }}>DJ Name</Label>
            <Input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="DJ Snowflake"
              data-ocid="admin.dj-name.input"
            />
          </div>
          <div>
            <Label style={{ color: "#93c5fd" }}>Specialty</Label>
            <Input
              style={inputStyle}
              value={form.specialty}
              onChange={(e) =>
                setForm((p) => ({ ...p, specialty: e.target.value }))
              }
              placeholder="Classic Christmas Hits"
              data-ocid="admin.dj-specialty.input"
            />
          </div>
          <div className="md:col-span-2">
            <Label style={{ color: "#93c5fd" }}>Bio</Label>
            <Textarea
              style={{
                ...inputStyle,
                minHeight: "80px",
                resize: "vertical",
              }}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Tell listeners about this DJ..."
              data-ocid="admin.dj-bio.textarea"
            />
          </div>

          {/* Photo Upload */}
          <div className="md:col-span-2">
            <Label style={{ color: "#93c5fd" }}>Photo (optional)</Label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginTop: "0.35rem",
                flexWrap: "wrap",
              }}
            >
              {/* Photo Preview */}
              {photoPreview ? (
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={photoPreview}
                    alt="DJ preview"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(124,58,237,0.6)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={clearPhotoSelection}
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "rgba(185,28,28,0.9)",
                      border: "none",
                      color: "white",
                      fontSize: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                    data-ocid="admin.dj-photo.close_button"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(20,30,50,0.8)",
                    border: "2px dashed rgba(80,120,180,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  🎧
                </div>
              )}
              <div style={{ flex: 1, minWidth: "200px" }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                  id="dj-photo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    borderColor: "rgba(80,120,180,0.4)",
                    color: "#93c5fd",
                    background: "transparent",
                    fontSize: "0.85rem",
                  }}
                  data-ocid="admin.dj-photo.upload_button"
                >
                  📷 {photoFile ? "Change Photo" : "Choose Photo"}
                </Button>
                {photoFile && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(147,197,253,0.65)",
                      marginTop: "4px",
                      marginBottom: 0,
                    }}
                  >
                    {photoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {uploadStatus && (
          <p
            style={{
              fontSize: "0.85rem",
              color: "#fde68a",
              marginBottom: "0.75rem",
              fontStyle: "italic",
            }}
            data-ocid="admin.dj.loading_state"
          >
            ⏳ {uploadStatus}
          </p>
        )}

        <Button
          onClick={() => addMutation.mutate()}
          disabled={addMutation.isPending || !form.name}
          style={{
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "white",
            border: "none",
            fontWeight: 700,
          }}
          data-ocid="admin.dj.submit_button"
        >
          {addMutation.isPending ? "Please wait..." : "🎧 Add DJ"}
        </Button>
      </div>

      <div style={cardStyle}>
        <h2
          style={{
            fontFamily: "'Mountains of Christmas', serif",
            fontSize: "1.4rem",
            color: "#86efac",
            marginBottom: "1.25rem",
          }}
        >
          🎙️ Our DJs
        </h2>
        {djs.length === 0 ? (
          <p
            style={{ color: "rgba(150,170,200,0.6)", fontStyle: "italic" }}
            data-ocid="admin.djs.empty_state"
          >
            No DJs added yet.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {djs.map((dj, i) => (
              <div
                key={String(dj.id)}
                data-ocid={`admin.djs.item.${i + 1}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(80,120,180,0.2)",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1rem",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flex: 1,
                    alignItems: "flex-start",
                  }}
                >
                  {/* DJ Photo Thumbnail */}
                  {dj.photoUrl ? (
                    <img
                      src={dj.photoUrl}
                      alt={dj.name}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid rgba(124,58,237,0.5)",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "rgba(20,30,50,0.8)",
                        border: "2px solid rgba(80,120,180,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        flexShrink: 0,
                      }}
                    >
                      🎧
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#e2e8f0",
                          fontSize: "1rem",
                        }}
                      >
                        {dj.name}
                      </span>
                      {dj.specialty && (
                        <Badge
                          style={{
                            background: "rgba(124,58,237,0.3)",
                            color: "#c4b5fd",
                            border: "1px solid rgba(124,58,237,0.5)",
                            fontSize: "0.7rem",
                          }}
                        >
                          {dj.specialty}
                        </Badge>
                      )}
                    </div>
                    {dj.bio && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(147,197,253,0.75)",
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {dj.bio}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeMutation.mutate(dj.id)}
                  disabled={removeMutation.isPending}
                  data-ocid={`admin.djs.delete_button.${i + 1}`}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0f1e 0%, #0d1a2e 100%)",
        padding: "2rem 1rem",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          style={{
            fontFamily: "'Mountains of Christmas', serif",
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#fde68a",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          🎄 Admin Panel
        </h1>

        <Tabs defaultValue="shows">
          <TabsList
            style={{
              background: "rgba(15,25,40,0.92)",
              border: "1px solid rgba(80,120,180,0.3)",
              borderRadius: "0.75rem",
              padding: "0.25rem",
              marginBottom: "1.5rem",
              width: "100%",
            }}
          >
            <TabsTrigger
              value="shows"
              style={{ flex: 1 }}
              data-ocid="admin.shows.tab"
            >
              🎄 Shows
            </TabsTrigger>
            <TabsTrigger
              value="djs"
              style={{ flex: 1 }}
              data-ocid="admin.djs.tab"
            >
              🎧 DJs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shows">
            <ShowsTab />
          </TabsContent>
          <TabsContent value="djs">
            <DJsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

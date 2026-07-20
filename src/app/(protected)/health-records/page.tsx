"use client";

import { useHealthRecords, useCreateHealthRecord, useUpdateHealthRecord, useDeleteHealthRecord } from "@/hooks/useHealthRecords";
import { useState, useRef, useEffect } from "react";
import { ListSkeleton, EmptyState } from "@/components/shared";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-standard p-5 space-y-3">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

function TagInput({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) { onChange([...tags, v]); setInput(""); }
  };
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {t}
            <button onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-red-500">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button onClick={add} type="button" className="rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">Add</button>
      </div>
    </div>
  );
}

export default function HealthRecordsPage() {
  const { data: record, isLoading } = useHealthRecords();
  const createRecord = useCreateHealthRecord();
  const updateRecord = useUpdateHealthRecord();
  const deleteRecord = useDeleteHealthRecord();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [form, setForm] = useState({
    chronicConditions: [] as string[],
    allergies: [] as string[],
    currentMedications: [] as { name: string; dosage: string; frequency: string }[],
    emergencyContact: { name: "", relationship: "", phone: "" },
  });

  const [medForm, setMedForm] = useState({ name: "", dosage: "", frequency: "" });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const startCreate = () => {
    setForm({ chronicConditions: [], allergies: [], currentMedications: [], emergencyContact: { name: "", relationship: "", phone: "" } });
    setEditing(false);
    onOpen();
  };

  const startEdit = () => {
    if (!record) return;
    setForm({
      chronicConditions: [...(record.chronicConditions || [])],
      allergies: [...(record.allergies || [])],
      currentMedications: (record.currentMedications || []).map((m) => ({ name: m.name, dosage: m.dosage, frequency: m.frequency })),
      emergencyContact: record.emergencyContact ? { ...record.emergencyContact } : { name: "", relationship: "", phone: "" },
    });
    setEditing(true);
    onOpen();
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      emergencyContact: form.emergencyContact.name ? form.emergencyContact : undefined,
    };
    if (editing) {
      await updateRecord.mutateAsync(payload);
    } else {
      await createRecord.mutateAsync(payload);
    }
    onClose();
  };

  const handleDelete = async () => {
    await deleteRecord.mutateAsync();
    onClose();
  };

  const addMed = () => {
    if (medForm.name && medForm.dosage && medForm.frequency) {
      setForm({ ...form, currentMedications: [...form.currentMedications, { ...medForm }] });
      setMedForm({ name: "", dosage: "", frequency: "" });
    }
  };

  const removeMed = (idx: number) => {
    setForm({ ...form, currentMedications: form.currentMedications.filter((_, i) => i !== idx) });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Health Records</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your health profile</p>
        </div>
        {record ? (
          <div className="flex gap-2">
            <button onClick={startEdit} className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Edit</button>
            <button onClick={handleDelete} disabled={deleteRecord.isPending} className="rounded-xl border border-red-200 dark:border-red-800 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">Delete</button>
          </div>
        ) : (
          <button onClick={startCreate} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">Create Record</button>
        )}
      </div>

      {isLoading ? (
        <ListSkeleton count={3} />
      ) : record ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard title="Chronic Conditions">
            {record.chronicConditions?.length ? (
              <ul className="space-y-1.5">
                {record.chronicConditions.map((c) => (
                  <li key={c} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">None recorded</p>
            )}
          </SectionCard>

          <SectionCard title="Allergies">
            {record.allergies?.length ? (
              <ul className="space-y-1.5">
                {record.allergies.map((a) => (
                  <li key={a} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">None recorded</p>
            )}
          </SectionCard>

          <SectionCard title="Current Medications">
            {record.currentMedications?.length ? (
              <ul className="space-y-2">
                {record.currentMedications.map((m, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium text-slate-900 dark:text-white">{m.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">{m.dosage} &middot; {m.frequency}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">None recorded</p>
            )}
          </SectionCard>

          <SectionCard title="Emergency Contact">
            {record.emergencyContact ? (
              <div className="text-sm space-y-1">
                <p className="font-medium text-slate-900 dark:text-white">{record.emergencyContact.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{record.emergencyContact.relationship} &middot; {record.emergencyContact.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Not set</p>
            )}
          </SectionCard>
        </div>
      ) : (
        <EmptyState
          title="No health record yet"
          description="Create a health record to track your conditions, allergies, and medications."
        />
      )}

      <dialog ref={dialogRef} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl backdrop:bg-black/40 max-w-2xl w-full p-0" onCancel={onClose}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{editing ? "Edit Health Record" : "Create Health Record"}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <TagInput label="Chronic Conditions" tags={form.chronicConditions} onChange={(t) => setForm({ ...form, chronicConditions: t })} />
          <TagInput label="Allergies" tags={form.allergies} onChange={(t) => setForm({ ...form, allergies: t })} />

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Current Medications</label>
            {form.currentMedications.map((m, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5 text-sm">
                <span className="font-medium text-slate-900 dark:text-white">{m.name}</span>
                <span className="text-slate-500">{m.dosage} &middot; {m.frequency}</span>
                <button onClick={() => removeMed(i)} className="ml-auto text-red-400 hover:text-red-600 text-xs">Remove</button>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <input value={medForm.name} onChange={(e) => setMedForm({ ...medForm, name: e.target.value })} placeholder="Name" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={medForm.dosage} onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })} placeholder="Dosage" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={medForm.frequency} onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })} placeholder="Frequency" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button onClick={addMed} type="button" className="mt-2 rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">Add Medication</button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Emergency Contact</label>
            <div className="grid grid-cols-3 gap-2">
              <input value={form.emergencyContact.name} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} placeholder="Name" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={form.emergencyContact.relationship} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relationship: e.target.value } })} placeholder="Relationship" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={form.emergencyContact.phone} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} placeholder="Phone" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={createRecord.isPending || updateRecord.isPending} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {createRecord.isPending || updateRecord.isPending ? "Saving..." : editing ? "Save Changes" : "Create"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { EnrichedCandidate } from "@/components/hr-dashboard-page";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PipelineStatus = "applied" | "screening" | "interview" | "offer" | "accepted" | "rejected" | "declined";

const COLUMNS: { id: PipelineStatus; label: string; color: string }[] = [
  { id: "applied",   label: "Applied",   color: "bg-blue-500" },
  { id: "screening", label: "Screening", color: "bg-amber-500" },
  { id: "interview", label: "Interview", color: "bg-purple-500" },
  { id: "offer",     label: "Offer",     color: "bg-emerald-500" },
  { id: "accepted",  label: "Accepted",  color: "bg-green-600" },
  { id: "rejected",  label: "Rejected",  color: "bg-red-500" },
  { id: "declined",  label: "Declined",  color: "bg-slate-500" },
];

interface Props {
  candidates: EnrichedCandidate[];
  onStatusChange: (applicationId: string, newStatus: string) => void;
  onCandidateClick: (candidate: EnrichedCandidate) => void;
}

/* ------------------------------------------------------------------ */
/*  Sortable candidate card                                            */
/* ------------------------------------------------------------------ */

function CandidateCard({
  candidate,
  onClick,
  isDragOverlay,
}: {
  candidate: EnrichedCandidate;
  onClick: () => void;
  isDragOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: candidate.applicationId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const daysSinceApplied = Math.floor(
    (Date.now() - new Date(candidate.appliedAt).getTime()) / 86_400_000
  );

  const scoreColor =
    candidate.atsScore >= 85
      ? "bg-emerald-100 text-emerald-800"
      : candidate.atsScore >= 70
      ? "bg-amber-100 text-amber-800"
      : "bg-red-100 text-red-800";

  const card = (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? undefined : style}
      {...(isDragOverlay ? {} : attributes)}
      {...(isDragOverlay ? {} : listeners)}
      onClick={onClick}
      className={`group cursor-grab rounded-xl border border-[var(--line)] bg-white p-3.5 shadow-sm transition hover:shadow-md active:cursor-grabbing ${
        isDragOverlay ? "shadow-lg ring-2 ring-[var(--primary)]/30" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{candidate.name}</p>
          <p className="truncate text-xs text-slate-500">{candidate.appliedRole}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${scoreColor}`}>
          {candidate.atsScore}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
        <span>{daysSinceApplied === 0 ? "Today" : `${daysSinceApplied}d ago`}</span>
        {candidate.topSkills.length > 0 && (
          <>
            <span>·</span>
            <span className="truncate">{candidate.topSkills.slice(0, 2).join(", ")}</span>
          </>
        )}
      </div>
    </div>
  );

  return card;
}

/* ------------------------------------------------------------------ */
/*  Column                                                             */
/* ------------------------------------------------------------------ */

function Column({
  column,
  candidates,
  onCandidateClick,
}: {
  column: (typeof COLUMNS)[number];
  candidates: EnrichedCandidate[];
  onCandidateClick: (c: EnrichedCandidate) => void;
}) {
  const avgScore =
    candidates.length > 0
      ? Math.round(candidates.reduce((s, c) => s + c.atsScore, 0) / candidates.length)
      : 0;

  return (
    <div className="flex w-[260px] shrink-0 flex-col rounded-2xl border border-[var(--line)] bg-slate-50/80">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
        <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
        <span className="text-sm font-semibold text-slate-800">{column.label}</span>
        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600 shadow-sm">
          {candidates.length}
        </span>
      </div>

      {/* Avg score */}
      {candidates.length > 0 && (
        <div className="px-4 pt-2 text-[11px] text-slate-400">
          Avg ATS: <span className="font-semibold text-slate-600">{avgScore}</span>
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-2 overflow-y-auto p-3" style={{ maxHeight: "calc(100vh - 380px)", minHeight: 120 }}>
        <SortableContext items={candidates.map((c) => c.applicationId)} strategy={verticalListSortingStrategy}>
          {candidates.length === 0 ? (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-8 text-xs text-slate-400">
              Drop here
            </div>
          ) : (
            candidates.map((c) => (
              <CandidateCard key={c.applicationId} candidate={c} onClick={() => onCandidateClick(c)} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Board                                                              */
/* ------------------------------------------------------------------ */

export function HRPipelineBoard({ candidates, onStatusChange, onCandidateClick }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const activeCandidate = activeId ? candidates.find((c) => c.applicationId === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id as string;
    const draggedCandidate = candidates.find((c) => c.applicationId === draggedId);
    if (!draggedCandidate) return;

    // Determine target column: if dropped on a column container, use its id; if on a card, find which column that card is in
    let targetStatus: string | null = null;

    // Check if dropped over a candidate card
    const overCandidate = candidates.find((c) => c.applicationId === over.id);
    if (overCandidate) {
      targetStatus = overCandidate.status;
    } else {
      // Dropped on column itself
      targetStatus = over.id as string;
    }

    if (targetStatus && targetStatus !== draggedCandidate.status) {
      onStatusChange(draggedId, targetStatus);
    }
  }

  // Group candidates by status
  const grouped: Record<string, EnrichedCandidate[]> = {};
  for (const col of COLUMNS) {
    grouped[col.id] = [];
  }
  for (const c of candidates) {
    if (grouped[c.status]) {
      grouped[c.status].push(c);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarGutter: "stable" }}>
        {COLUMNS.map((col) => (
          <SortableContext key={col.id} id={col.id} items={grouped[col.id].map((c) => c.applicationId)} strategy={verticalListSortingStrategy}>
            <Column column={col} candidates={grouped[col.id]} onCandidateClick={onCandidateClick} />
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeCandidate ? <CandidateCard candidate={activeCandidate} onClick={() => {}} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

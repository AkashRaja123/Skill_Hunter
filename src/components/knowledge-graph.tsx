"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ParsedResumeData, AIAnalysis } from "@/lib/db/types";

// ── types ──────────────────────────────────────────────────────────────────────
interface GraphChild {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  r: number;
  edgeLabel: string;
}

interface GraphCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  r: number;
  edgeLabel: string;
  children: GraphChild[];
}

interface GraphRoot {
  id: "root";
  name: string;
  title: string;
  icon: string;
  r: number;
  color: string;
}

interface GraphDatabase {
  root: GraphRoot;
  categories: GraphCategory[];
}

interface KnowledgeGraphProps {
  parsedData: ParsedResumeData;
  aiAnalysis: AIAnalysis;
  onClose: () => void;
}

// ── build graph database from resume data ──────────────────────────────────────
const SKILL_COLORS: Record<string, string> = {
  technical: "#38BDF8",
  soft: "#F472B6",
  language: "#FACC15",
  other: "#94A3B8",
};

const SKILL_ICONS: Record<string, string> = {
  technical: "⚙️",
  soft: "🤝",
  language: "🌐",
  other: "📌",
};

const JOB_ICONS = ["💻", "🏗️", "📊", "🎯", "🚀", "⭐"];
const JOB_COLORS = ["#8B5CF6", "#6D28D9", "#9333EA", "#C084FC", "#A78BFA", "#7C3AED"];

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function buildDatabaseFromResume(
  parsedData: ParsedResumeData,
  aiAnalysis: AIAnalysis
): GraphDatabase {
  const name = parsedData.personalInfo.name || "You";
  const title =
    aiAnalysis.suggestedJobRoles[0] || "Professional";

  // ── Skills (top 8, sorted: expert → intermediate → beginner) ─────────────
  const profOrder = { expert: 0, intermediate: 1, beginner: 2 };
  const sortedSkills = [...parsedData.skills].sort(
    (a, b) => profOrder[a.proficiency] - profOrder[b.proficiency]
  );
  const topSkills = sortedSkills.slice(0, 8);

  const skillChildren: GraphChild[] = topSkills.map((s, i) => ({
    id: `s${i}`,
    label: truncate(s.skillName, 18),
    sublabel: s.proficiency.charAt(0).toUpperCase() + s.proficiency.slice(1),
    icon: SKILL_ICONS[s.category] || "📌",
    color: SKILL_COLORS[s.category] || "#94A3B8",
    r: s.proficiency === "expert" ? 38 : s.proficiency === "intermediate" ? 36 : 34,
    edgeLabel: s.category,
  }));

  // ── Education + Certifications ────────────────────────────────────────────
  const eduChildren: GraphChild[] = parsedData.education.map((e, i) => ({
    id: `e${i}`,
    label: truncate(`${e.degree} ${e.field}`, 18),
    sublabel: e.graduationDate || "",
    icon: "🏛️",
    color: i % 2 === 0 ? "#60A5FA" : "#34D399",
    r: 36,
    edgeLabel: truncate(e.institution, 14),
  }));

  const certChildren: GraphChild[] = (parsedData.certifications || []).map(
    (c, i) => ({
      id: `c${i}`,
      label: truncate(c.name, 18),
      sublabel: c.issuer || "",
      icon: "☁️",
      color: "#FB923C",
      r: 34,
      edgeLabel: "Certified",
    })
  );

  // ── Experience ────────────────────────────────────────────────────────────
  const expChildren: GraphChild[] = parsedData.experience.map((x, i) => ({
    id: `x${i}`,
    label: truncate(x.position, 18),
    sublabel: `${x.startDate}–${x.endDate}`,
    icon: i === 0 ? "⭐" : i === 1 ? "⚙️" : "🖥️",
    color: ["#FDA4AF", "#F43F5E", "#BE185D", "#FB7185", "#E11D48"][i % 5],
    r: 36,
    edgeLabel: truncate(x.company, 14),
  }));

  // ── Job Roles ─────────────────────────────────────────────────────────────
  const jobChildren: GraphChild[] = aiAnalysis.suggestedJobRoles
    .slice(0, 5)
    .map((role, i) => ({
      id: `j${i}`,
      label: truncate(role, 18),
      sublabel: i === 0 ? "Best match" : "Suggested",
      icon: JOB_ICONS[i % JOB_ICONS.length],
      color: JOB_COLORS[i % JOB_COLORS.length],
      r: i === 0 ? 38 : 36,
      edgeLabel: i === 0 ? "Top match" : "Career path",
    }));

  // ── assemble categories (skip empty) ──────────────────────────────────────
  const categories: GraphCategory[] = [];

  if (skillChildren.length > 0) {
    categories.push({
      id: "skills",
      label: `Skills${parsedData.skills.length > 8 ? ` (${parsedData.skills.length})` : ""}`,
      icon: "⚡",
      color: "#22C55E",
      r: 50,
      edgeLabel: "Technical Expertise",
      children: skillChildren,
    });
  }

  const allEdu = [...eduChildren, ...certChildren];
  if (allEdu.length > 0) {
    categories.push({
      id: "education",
      label: "Education",
      icon: "🎓",
      color: "#38BDF8",
      r: 50,
      edgeLabel: "Academic Background",
      children: allEdu,
    });
  }

  if (expChildren.length > 0) {
    categories.push({
      id: "experience",
      label: "Experience",
      icon: "💼",
      color: "#F472B6",
      r: 50,
      edgeLabel: "Professional History",
      children: expChildren,
    });
  }

  if (jobChildren.length > 0) {
    categories.push({
      id: "jobs",
      label: "Job Roles",
      icon: "🚀",
      color: "#A78BFA",
      r: 50,
      edgeLabel: "Career Opportunities",
      children: jobChildren,
    });
  }

  return {
    root: {
      id: "root",
      name,
      title: truncate(title, 24),
      icon: "🧑‍💻",
      r: 62,
      color: "#F59E0B",
    },
    categories,
  };
}

// ── compute dynamic positions ──────────────────────────────────────────────────
const VW = 1060;
const VH = 760;

function computeInitialPositions(db: GraphDatabase): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {};
  const cx = VW / 2;
  const cy = VH / 2;
  pos.root = { x: cx, y: cy };

  const catCount = db.categories.length;
  const catRadius = 220;

  db.categories.forEach((cat, ci) => {
    // distribute categories evenly around center
    const angle = (ci / catCount) * 2 * Math.PI - Math.PI / 2;
    const catX = cx + Math.cos(angle) * catRadius;
    const catY = cy + Math.sin(angle) * catRadius;
    pos[cat.id] = { x: catX, y: catY };

    // distribute children in an arc around their category
    const childCount = cat.children.length;
    const childRadius = 140;
    const spreadAngle = Math.min(Math.PI * 0.8, childCount * 0.4);
    const startAngle = angle - spreadAngle / 2;

    cat.children.forEach((child, chi) => {
      const childAngle =
        childCount === 1
          ? angle
          : startAngle + (chi / (childCount - 1)) * spreadAngle;
      const chX = catX + Math.cos(childAngle) * childRadius;
      const chY = catY + Math.sin(childAngle) * childRadius;
      pos[child.id] = { x: chX, y: chY };
    });
  });

  return pos;
}

// ── SVG helper ─────────────────────────────────────────────────────────────────
function sCurve(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`;
}

// ── component ──────────────────────────────────────────────────────────────────
export default function KnowledgeGraph({ parsedData, aiAnalysis, onClose }: KnowledgeGraphProps) {
  const database = useRef<GraphDatabase>(buildDatabaseFromResume(parsedData, aiAnalysis));
  const initialPositions = useRef<Record<string, { x: number; y: number }>>(
    computeInitialPositions(database.current)
  );

  const [positions, setPositions] = useState(() => ({ ...initialPositions.current }));
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [animEpoch, setAnimEpoch] = useState<Record<string, number>>({});

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const movedRef = useRef(false);

  // ── inject global CSS ────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "kg-css";
    style.textContent = `
      @keyframes nodeIn  { 0%{opacity:0;transform:scale(0)} 70%{transform:scale(1.14)} 100%{opacity:1;transform:scale(1)} }
      @keyframes edgeIn  { from{opacity:0;stroke-dashoffset:350} to{opacity:1;stroke-dashoffset:0} }
      @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      @keyframes spinCW  { to{transform:rotate(360deg)} }
      @keyframes spinCCW { to{transform:rotate(-360deg)} }
      @keyframes pulse   { 0%,100%{opacity:.12} 50%{opacity:.3} }

      .kg-root-float  { animation:float 4.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
      .kg-node-pop    { animation:nodeIn .52s cubic-bezier(.34,1.56,.64,1) both; transform-box:fill-box; transform-origin:center; }
      .kg-edge-draw   { animation:edgeIn .38s ease-out both; stroke-dasharray:350; }
      .kg-spin-cw     { transform-box:fill-box; transform-origin:center; animation:spinCW  22s linear infinite; }
      .kg-spin-ccw    { transform-box:fill-box; transform-origin:center; animation:spinCCW 18s linear infinite; }
      .kg-glow-pulse  { animation:pulse 2.8s ease-in-out infinite; }
      .kg-no-select   { user-select:none; }

      svg text.kg-text { font-family:'Syne',system-ui,sans-serif; }
      svg text.kg-mono { font-family:'DM Mono',monospace; }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById("kg-css")?.remove();
      link.remove();
    };
  }, []);

  // ── SVG coordinate conversion ─────────────────────────────────────────────────
  const toSVG = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * VW,
      y: ((e.clientY - rect.top) / rect.height) * VH,
    };
  }, []);

  // ── drag handlers ─────────────────────────────────────────────────────────────
  const onNodeMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      const { x, y } = toSVG(e);
      const cur = positions[id] || { x: 0, y: 0 };
      dragRef.current = { id, ox: x - cur.x, oy: y - cur.y };
      movedRef.current = false;
    },
    [positions, toSVG]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragRef.current) return;
      const { id, ox, oy } = dragRef.current;
      const { x, y } = toSVG(e);
      const nx = x - ox;
      const ny = y - oy;
      const prev = positions[id] || { x: 0, y: 0 };
      if (Math.abs(nx - prev.x) > 3 || Math.abs(ny - prev.y) > 3) {
        movedRef.current = true;
      }
      setPositions((p) => ({ ...p, [id]: { x: nx, y: ny } }));
    },
    [positions, toSVG]
  );

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // ── expand / collapse ─────────────────────────────────────────────────────────
  const toggleExpand = useCallback(
    (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (movedRef.current) return;
      setExpanded((prev) => {
        const s = new Set(prev);
        s.has(id) ? s.delete(id) : s.add(id);
        return s;
      });
      setAnimEpoch((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    },
    []
  );

  // ── reset ─────────────────────────────────────────────────────────────────────
  const reset = () => {
    setPositions({ ...initialPositions.current });
    setExpanded(new Set());
  };

  const { root, categories } = database.current;
  const rootPos = positions.root || { x: VW / 2, y: VH / 2 };
  const totalVisible = categories
    .filter((c) => expanded.has(c.id))
    .reduce((acc, c) => acc + c.children.length, 0);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        width: "100%",
        height: "100vh",
        background: "#05080F",
        overflow: "hidden",
        fontFamily: "'Syne', system-ui, sans-serif",
      }}
    >
      {/* ── top-left header ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: 18, left: 22, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22C55E",
              boxShadow: "0 0 8px #22C55E",
            }}
          />
          <span
            style={{
              color: "#F1F5F9",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-.2px",
            }}
          >
            Knowledge Graph
          </span>
        </div>
        <div
          style={{
            color: "#334155",
            fontSize: 10,
            marginTop: 4,
            fontFamily: "'DM Mono',monospace",
          }}
        >
          CLICK to expand · DRAG to reposition
        </div>
      </div>

      {/* ── JSON badge ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 220,
          zIndex: 20,
          background: "#0F172A",
          border: "1px solid #1E293B",
          borderRadius: 6,
          padding: "4px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            color: "#FACC15",
            fontSize: 9,
            fontFamily: "'DM Mono',monospace",
            fontWeight: 500,
          }}
        >
          {"{ RESUME }"}
        </span>
        <span
          style={{
            color: "#475569",
            fontSize: 9,
            fontFamily: "'DM Mono',monospace",
          }}
        >
          {categories.length} categories ·{" "}
          {categories.reduce((a, c) => a + c.children.length, 0)} nodes
        </span>
      </div>

      {/* ── close + reset buttons ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 22,
          zIndex: 20,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={reset}
          style={{
            background: "#0F172A",
            color: "#64748B",
            border: "1px solid #1E293B",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "'DM Mono',monospace",
            fontWeight: 500,
          }}
        >
          ↺ Reset Layout
        </button>
        <button
          onClick={onClose}
          style={{
            background: "#0F172A",
            color: "#F87171",
            border: "1px solid #7F1D1D",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "'DM Mono',monospace",
            fontWeight: 500,
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* ── expanded tag strip ───────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 55,
          right: 22,
          display: "flex",
          gap: 6,
          zIndex: 20,
          flexWrap: "wrap",
          justifyContent: "flex-end",
          maxWidth: 380,
        }}
      >
        {categories
          .filter((c) => expanded.has(c.id))
          .map((c) => (
            <div
              key={c.id}
              onClick={(e) => toggleExpand(c.id, e)}
              style={{
                background: `${c.color}18`,
                color: c.color,
                border: `1px solid ${c.color}40`,
                padding: "3px 10px 3px 8px",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Mono',monospace",
              }}
            >
              {c.icon} {c.label} ×
            </div>
          ))}
      </div>

      {/* ── SVG canvas ───────────────────────────────────────────────── */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${VW} ${VH}`}
        style={{
          position: "absolute",
          inset: 0,
          cursor: dragRef.current ? "grabbing" : "default",
        }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <defs>
          {/* dot grid */}
          <pattern
            id="dotgrid"
            x="0"
            y="0"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="18" cy="18" r="1" fill="#1E293B" opacity="0.7" />
          </pattern>
          {/* radial vignette */}
          <radialGradient id="vignet" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#0D1525" stopOpacity="1" />
            <stop offset="100%" stopColor="#05080F" stopOpacity="1" />
          </radialGradient>
          {/* glow filters */}
          <filter id="glow-root" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-main" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-child" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* per-category arrow markers */}
          {categories.map((c) => (
            <marker
              key={c.id}
              id={`arr-${c.id}`}
              markerWidth="7"
              markerHeight="5"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0 0,7 2.5,0 5" fill={c.color} opacity="0.65" />
            </marker>
          ))}
        </defs>

        {/* bg */}
        <rect width={VW} height={VH} fill="url(#vignet)" />
        <rect width={VW} height={VH} fill="url(#dotgrid)" />

        {/* ── ROOT → CATEGORY edges ────────────────────────────────── */}
        {categories.map((c) => {
          const cp = positions[c.id] || { x: VW / 2, y: VH / 2 };
          const isExp = expanded.has(c.id);
          const mx = (rootPos.x + cp.x) / 2;
          const my = (rootPos.y + cp.y) / 2;
          return (
            <g key={`re-${c.id}`}>
              <path
                d={sCurve(rootPos.x, rootPos.y, cp.x, cp.y)}
                fill="none"
                stroke={c.color}
                strokeWidth={isExp ? 2 : 1}
                opacity={isExp ? 0.5 : 0.18}
                strokeDasharray={isExp ? undefined : "5 4"}
                markerEnd={`url(#arr-${c.id})`}
                style={{ transition: "opacity .4s, stroke-width .3s" }}
              />
              <rect
                x={mx - 38}
                y={my - 9}
                width={76}
                height={17}
                rx={8.5}
                fill="#0D1525"
                stroke={c.color}
                strokeWidth="0.7"
                opacity="0.92"
              />
              <text
                x={mx}
                y={my + 1.8}
                textAnchor="middle"
                fontSize="9"
                fontWeight="500"
                fill={isExp ? c.color : "#334155"}
                className="kg-mono kg-no-select"
                style={{ transition: "fill .3s" }}
              >
                {c.edgeLabel}
              </text>
            </g>
          );
        })}

        {/* ── CATEGORY → CHILD edges ───────────────────────────────── */}
        {categories.flatMap((c) =>
          !expanded.has(c.id)
            ? []
            : c.children.map((ch, i) => {
                const cp = positions[c.id] || { x: VW / 2, y: VH / 2 };
                const chp = positions[ch.id] || cp;
                const mx = (cp.x + chp.x) / 2;
                const my = (cp.y + chp.y) / 2;
                return (
                  <g
                    key={`ce-${ch.id}-${animEpoch[c.id] || 0}`}
                    className="kg-edge-draw"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <path
                      d={sCurve(cp.x, cp.y, chp.x, chp.y)}
                      fill="none"
                      stroke={c.color}
                      strokeWidth="1.2"
                      opacity="0.32"
                      markerEnd={`url(#arr-${c.id})`}
                    />
                    <rect
                      x={mx - 30}
                      y={my - 8}
                      width={60}
                      height={14}
                      rx={7}
                      fill="#0D1525"
                      stroke={c.color}
                      strokeWidth="0.5"
                      opacity="0.88"
                    />
                    <text
                      x={mx}
                      y={my + 1.2}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="500"
                      fill={c.color}
                      className="kg-mono kg-no-select"
                    >
                      {ch.edgeLabel}
                    </text>
                  </g>
                );
              })
        )}

        {/* ── CHILD NODES ─────────────────────────────────────────── */}
        {categories.flatMap((c) =>
          !expanded.has(c.id)
            ? []
            : c.children.map((ch, i) => {
                const chp = positions[ch.id] || positions[c.id] || { x: 0, y: 0 };
                const isH = hovered === ch.id;
                return (
                  <g
                    key={`${ch.id}-${animEpoch[c.id] || 0}`}
                    className="kg-node-pop"
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      cursor: "grab",
                    }}
                    onMouseDown={(e) => onNodeMouseDown(e, ch.id)}
                    onMouseEnter={() => setHovered(ch.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <circle
                      cx={chp.x}
                      cy={chp.y}
                      r={ch.r + 18}
                      fill={ch.color}
                      opacity={isH ? 0.13 : 0.06}
                      className="kg-glow-pulse"
                    />
                    <circle
                      cx={chp.x}
                      cy={chp.y}
                      r={ch.r + 4}
                      fill="none"
                      stroke={ch.color}
                      strokeWidth="1"
                      strokeDasharray="3 2.5"
                      opacity={isH ? 0.55 : 0.2}
                    />
                    <circle
                      cx={chp.x}
                      cy={chp.y}
                      r={ch.r}
                      fill={`${ch.color}15`}
                      stroke={ch.color}
                      strokeWidth="1.8"
                      filter={isH ? "url(#glow-child)" : undefined}
                    />
                    <text
                      x={chp.x}
                      y={chp.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="18"
                      className="kg-no-select"
                    >
                      {ch.icon}
                    </text>
                    <text
                      x={chp.x}
                      y={chp.y + ch.r + 16}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="700"
                      fill="#E2E8F0"
                      className="kg-text kg-no-select"
                    >
                      {ch.label}
                    </text>
                    <text
                      x={chp.x}
                      y={chp.y + ch.r + 29}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="500"
                      fill={ch.color}
                      className="kg-mono kg-no-select"
                    >
                      {ch.sublabel}
                    </text>
                    {isH && (
                      <text
                        x={chp.x}
                        y={chp.y - ch.r - 8}
                        textAnchor="middle"
                        fontSize="9"
                        fill={ch.color}
                        opacity="0.7"
                        className="kg-mono kg-no-select"
                      >
                        drag
                      </text>
                    )}
                  </g>
                );
              })
        )}

        {/* ── CATEGORY NODES ──────────────────────────────────────── */}
        {categories.map((c) => {
          const cp = positions[c.id] || { x: VW / 2, y: VH / 2 };
          const isExp = expanded.has(c.id);
          const isH = hovered === c.id;
          return (
            <g
              key={c.id}
              style={{ cursor: "pointer" }}
              onMouseDown={(e) => onNodeMouseDown(e, c.id)}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => toggleExpand(c.id, e)}
            >
              {isExp && (
                <>
                  <circle
                    cx={cp.x}
                    cy={cp.y}
                    r={c.r + 22}
                    fill="none"
                    stroke={c.color}
                    strokeWidth="0.8"
                    strokeDasharray="2 6"
                    opacity="0.25"
                    className="kg-spin-cw"
                  />
                  <circle
                    cx={cp.x}
                    cy={cp.y}
                    r={c.r + 34}
                    fill="none"
                    stroke={c.color}
                    strokeWidth="0.5"
                    strokeDasharray="1 8"
                    opacity="0.15"
                    className="kg-spin-ccw"
                  />
                </>
              )}
              <circle
                cx={cp.x}
                cy={cp.y}
                r={c.r + 12}
                fill={c.color}
                opacity={isH || isExp ? 0.16 : 0.07}
                className={isExp ? "kg-glow-pulse" : undefined}
                style={{ transition: "opacity .35s" }}
              />
              <circle
                cx={cp.x}
                cy={cp.y}
                r={c.r + 2.5}
                fill="none"
                stroke={c.color}
                strokeWidth={isH || isExp ? 2 : 1}
                opacity={isH || isExp ? 0.7 : 0.3}
                style={{ transition: "all .3s" }}
              />
              <circle
                cx={cp.x}
                cy={cp.y}
                r={c.r}
                fill={`${c.color}18`}
                stroke={c.color}
                strokeWidth="2.2"
                filter={isH || isExp ? "url(#glow-main)" : undefined}
              />
              <text
                x={cp.x}
                y={cp.y + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="26"
                className="kg-no-select"
              >
                {c.icon}
              </text>
              <text
                x={cp.x}
                y={cp.y + c.r + 19}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#F1F5F9"
                className="kg-text kg-no-select"
              >
                {c.label}
              </text>
              <text
                x={cp.x}
                y={cp.y + c.r + 33}
                textAnchor="middle"
                fontSize="9"
                fill={c.color}
                opacity="0.55"
                className="kg-mono kg-no-select"
              >
                {isExp ? "click to collapse" : "click to expand"}
              </text>
              <circle
                cx={cp.x + c.r - 2}
                cy={cp.y - c.r + 2}
                r={13}
                fill="#05080F"
                stroke={c.color}
                strokeWidth="1.8"
              />
              <text
                x={cp.x + c.r - 2}
                y={cp.y - c.r + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="800"
                fill={c.color}
                className="kg-no-select"
              >
                {c.children.length}
              </text>
            </g>
          );
        })}

        {/* ── ROOT NODE ────────────────────────────────────────────── */}
        <g
          className="kg-root-float"
          style={{ cursor: "grab" }}
          onMouseDown={(e) => onNodeMouseDown(e, "root")}
        >
          <circle
            cx={rootPos.x}
            cy={rootPos.y}
            r={root.r + 35}
            fill={root.color}
            opacity="0.04"
          />
          <circle
            cx={rootPos.x}
            cy={rootPos.y}
            r={root.r + 20}
            fill={root.color}
            opacity="0.07"
            className="kg-glow-pulse"
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const r1 = root.r + 6;
            const r2 = root.r + 11;
            return (
              <line
                key={deg}
                x1={rootPos.x + Math.cos(rad) * r1}
                y1={rootPos.y + Math.sin(rad) * r1}
                x2={rootPos.x + Math.cos(rad) * r2}
                y2={rootPos.y + Math.sin(rad) * r2}
                stroke={root.color}
                strokeWidth="1.5"
                opacity="0.4"
              />
            );
          })}
          <circle
            cx={rootPos.x}
            cy={rootPos.y}
            r={root.r + 3}
            fill="none"
            stroke={root.color}
            strokeWidth="1.2"
            opacity="0.3"
            strokeDasharray="3 4"
          />
          <circle
            cx={rootPos.x}
            cy={rootPos.y}
            r={root.r}
            fill={`${root.color}22`}
            stroke={root.color}
            strokeWidth="3"
            filter="url(#glow-root)"
          />
          <text
            x={rootPos.x}
            y={rootPos.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="32"
            className="kg-no-select"
          >
            {root.icon}
          </text>
          <text
            x={rootPos.x}
            y={rootPos.y + root.r + 21}
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fill="#F8FAFC"
            className="kg-text kg-no-select"
          >
            {root.name}
          </text>
          <text
            x={rootPos.x}
            y={rootPos.y + root.r + 37}
            textAnchor="middle"
            fontSize="10"
            fontWeight="500"
            fill="#475569"
            className="kg-mono kg-no-select"
          >
            {root.title}
          </text>
          <circle
            cx={rootPos.x + root.r - 2}
            cy={rootPos.y - root.r + 2}
            r={14}
            fill="#05080F"
            stroke={root.color}
            strokeWidth="2"
          />
          <text
            x={rootPos.x + root.r - 2}
            y={rootPos.y - root.r + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fontWeight="800"
            fill={root.color}
            className="kg-no-select"
          >
            {categories.length}
          </text>
        </g>
      </svg>

      {/* ── legend card ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          background: "#0A0F1A",
          border: "1px solid #1E293B",
          borderRadius: 14,
          padding: "14px 18px",
          minWidth: 155,
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#334155",
            marginBottom: 10,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            fontFamily: "'DM Mono',monospace",
          }}
        >
          Node Types
        </div>
        {[
          { color: root.color, label: "You  (Root)" },
          ...categories.map((c) => ({ color: c.color, label: c.label })),
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginBottom: 7,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 8px ${item.color}`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── status footer ────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0A0F1A",
          border: "1px solid #1E293B",
          borderRadius: 20,
          padding: "6px 18px",
          fontSize: 10,
          color: "#334155",
          whiteSpace: "nowrap",
          fontFamily: "'DM Mono',monospace",
        }}
      >
        {expanded.size === 0
          ? "↑ click a node to drill into connections"
          : `${expanded.size} expanded · ${totalVisible} connections visible`}
      </div>
    </div>
  );
}

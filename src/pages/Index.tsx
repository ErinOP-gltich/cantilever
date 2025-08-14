import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, UploadCloud, ShieldCheck, Star, Building2, FileText, Layers, Boxes, Download, Filter, MapPin, ArrowRight, CheckCircle2, X, Menu, User, LogIn, Plus, ExternalLink, BookOpen } from "lucide-react";

// --- Demo data ---------------------------------------------------------------
const CATEGORIES = [
  { key: "bim", label: "BIM Families", icon: Boxes },
  { key: "details", label: "Detail Libraries", icon: Layers },
  { key: "specs", label: "Spec Templates", icon: FileText },
  { key: "renders", label: "Render Packs", icon: Sparkles },
];

const CITY_TAGS = ["Bengaluru", "Hyderabad", "Pune", "Delhi NCR", "Mumbai", "Chennai"]; // for future code-localization filters

const ASSETS = [
  {
    id: "a1",
    title: "Parametric Door Set — Revit 2024",
    category: "bim",
    price: 29,
    rating: 4.8,
    sales: 321,
    cityTags: ["Bengaluru"],
    formats: ["RFA", "RVT"],
    cover: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?q=80&w=1400&auto=format&fit=crop",
    author: { name: "Studio Kinetic", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop" },
    highlights: ["LOD 300", "Handing flip", "FC-based materials"],
  },
  {
    id: "a2",
    title: "Residential Stair Details (IS:456) — DWG/DXF",
    category: "details",
    price: 39,
    rating: 4.6,
    sales: 198,
    cityTags: ["Hyderabad", "Pune"],
    formats: ["DWG", "DXF", "PDF"],
    cover: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1400&auto=format&fit=crop",
    author: { name: "Axis Atelier", avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=300&auto=format&fit=crop" },
    highlights: ["Code tagged", "Section/plan/elevations", "Ready-to-print"],
  },
  {
    id: "a3",
    title: "Office Fit-out Spec Template — DOCX",
    category: "specs",
    price: 24,
    rating: 4.5,
    sales: 142,
    cityTags: ["Mumbai", "Delhi NCR"],
    formats: ["DOCX"],
    cover: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop",
    author: { name: "North Grid", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=300&auto=format&fit=crop" },
    highlights: ["CSI aligned", "Editable clauses", "QA checklist"],
  },
  {
    id: "a4",
    title: "PBR Concrete & Wood — Render Pack",
    category: "renders",
    price: 19,
    rating: 4.7,
    sales: 501,
    cityTags: ["Chennai"],
    formats: ["PNG", "JPG", "SBSAR"],
    cover: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1400&auto=format&fit=crop",
    author: { name: "Render Foundry", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=300&auto=format&fit=crop" },
    highlights: ["4k maps", "Physically correct", "Material presets"],
  },
];

const CREATOR_BADGES = [
  { icon: ShieldCheck, text: "Verified creator" },
  { icon: Star, text: "Top rated" },
  { icon: Download, text: "500+ downloads" },
];

// --- Small UI helpers --------------------------------------------------------
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs text-gray-700 dark:text-gray-200 border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm">
    {children}
  </span>
);

const PillButton = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <button
    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-900 active:scale-[.99] transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const GhostButton = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <button
    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- Card -------------------------------------------------------------------
function AssetCard({ asset, onOpen }: { asset: any; onOpen: (asset: any) => void }) {
  return (
    <motion.div layout className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={asset.cover} alt={asset.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
        <div className="absolute top-2 left-2 flex gap-1">
          {asset.cityTags.slice(0, 2).map((t: string) => (
            <Tag key={t}><MapPin className="h-3 w-3 mr-1" />{t}</Tag>
          ))}
        </div>
        <div className="absolute bottom-2 left-2">
          <Tag>{asset.formats.join(" · ")}</Tag>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">{asset.title}</h3>
            <div className="mt-1 text-sm text-gray-500">{asset.author.name}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">₹{Math.round(asset.price * 85)}</div>
            <div className="text-xs text-gray-500">${asset.price}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="inline-flex items-center gap-1"><Star className="h-4 w-4" />{asset.rating}</div>
          <div className="inline-flex items-center gap-1"><Download className="h-4 w-4" />{asset.sales}</div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {asset.highlights.slice(0, 3).map((h: string) => <Tag key={h}>{h}</Tag>)}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <GhostButton onClick={() => onOpen(asset)}>
            <BookOpen className="h-4 w-4" /> Preview
          </GhostButton>
          <PillButton className="bg-blue-600 hover:bg-blue-700" onClick={() => onOpen(asset)}>
            <Download className="h-4 w-4" /> Add to cart
          </PillButton>
        </div>
      </div>
    </motion.div>
  );
}

// --- Modal ------------------------------------------------------------------
function Modal({ open, onClose, asset }: { open: boolean; onClose: () => void; asset: any }) {
  if (!open || !asset) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 shadow-xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <img src={asset.author.avatar} className="h-8 w-8 rounded-full" alt={asset.author.name} />
            <div>
              <div className="font-semibold">{asset.title}</div>
              <div className="text-sm text-gray-500">by {asset.author.name}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-[4/3] md:aspect-auto">
            <img src={asset.cover} className="h-full w-full object-cover" alt={asset.title} />
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {CREATOR_BADGES.map((b, i) => (
                <Tag key={i}><b.icon className="h-3 w-3 mr-1" />{b.text}</Tag>
              ))}
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
              <div className="flex items-center gap-2"><Layers className="h-4 w-4" /> Formats: {asset.formats.join(", ")}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Cities: {asset.cityTags.join(", ")}</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> License: Single-firm commercial</div>
            </div>
            <div className="mt-4">
              <div className="font-semibold mb-2">Highlights</div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                {asset.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> {h}</li>
                ))}
              </ul>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold">₹{Math.round(asset.price * 85)}</div>
                <div className="text-xs text-gray-500">${asset.price} (excl. taxes)</div>
              </div>
              <div className="flex gap-2">
                <GhostButton><ExternalLink className="h-4 w-4" /> View creator</GhostButton>
                <PillButton className="bg-blue-600 hover:bg-blue-700"><Download className="h-4 w-4" /> Purchase</PillButton>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Header / Nav -----------------------------------------------------------
function Navbar({ onToggleMobile }: { onToggleMobile: () => void }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-950/60 border-b border-gray-200/70 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5" onClick={onToggleMobile}><Menu className="h-5 w-5" /></button>
            <div className="inline-flex items-center gap-2">
              <div className="h-7 w-7 grid place-items-center rounded-xl bg-blue-600 text-white font-bold">C</div>
              <span className="font-semibold">Cantilever</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 ml-8 text-sm text-gray-600 dark:text-gray-300">
              <a href="#browse" className="hover:text-gray-900 dark:hover:text-white">Browse</a>
              <a href="#creators" className="hover:text-gray-900 dark:hover:text-white">Creators</a>
              <a href="#pricing" className="hover:text-gray-900 dark:hover:text-white">Pricing</a>
              <a href="#faq" className="hover:text-gray-900 dark:hover:text-white">FAQ</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <GhostButton><LogIn className="h-4 w-4" /> Sign in</GhostButton>
            <PillButton className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4" /> Become a seller</PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="md:hidden fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute top-0 left-0 right-0 rounded-b-3xl bg-white dark:bg-neutral-950 p-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <div className="h-7 w-7 grid place-items-center rounded-xl bg-blue-600 text-white font-bold">C</div>
            <span className="font-semibold">Cantilever</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          <a href="#browse" className="px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5" onClick={onClose}>Browse</a>
          <a href="#creators" className="px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5" onClick={onClose}>Creators</a>
          <a href="#pricing" className="px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5" onClick={onClose}>Pricing</a>
          <a href="#faq" className="px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5" onClick={onClose}>FAQ</a>
        </div>
      </div>
    </div>
  );
}

// --- Hero -------------------------------------------------------------------
function Hero({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_60rem_at_20%_-10%,rgba(59,130,246,0.15),transparent),radial-gradient(50rem_50rem_at_100%_0,rgba(16,185,129,0.10),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-semibold leading-tight">
              The marketplace for architects.
            </motion.h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-base md:text-lg">
              Find <b>BIM families</b>, <b>detail libraries</b>, <b>spec templates</b> and <b>render packs</b> that save hours per project—curated and code-tagged.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Verified creators</div>
              <div className="inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> Local code tags</div>
              <div className="inline-flex items-center gap-2"><Download className="h-4 w-4" /> Instant delivery</div>
            </div>
            <div className="mt-8 flex gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: Revit 2024 door, IS:456 stair detail, office spec..."
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-neutral-950/70 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <PillButton className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4" /> Filters
              </PillButton>
            </div>
          </div>
          <div className="md:block hidden">
            <div className="grid grid-cols-2 gap-4">
              {ASSETS.slice(0, 4).map((a) => (
                <motion.div key={a.id} whileHover={{ y: -4 }} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
                  <img src={a.cover} className="h-36 w-full object-cover" alt={a.title} />
                  <div className="p-3">
                    <div className="text-sm font-medium line-clamp-1">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.formats.join(" ")}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Filters + Grid ---------------------------------------------------------
function Catalogue({ query, activeCat, setActiveCat, onOpen }: { 
  query: string; 
  activeCat: string | null; 
  setActiveCat: (cat: string | null) => void; 
  onOpen: (asset: any) => void 
}) {
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return ASSETS.filter((a) =>
      (!activeCat || a.category === activeCat) &&
      (a.title.toLowerCase().includes(q) || a.highlights.join(" ").toLowerCase().includes(q))
    );
  }, [query, activeCat]);

  return (
    <section id="browse" className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">Browse assets</h2>
        <div className="hidden md:flex gap-2">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveCat(key === activeCat ? null : key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border transition ${
                activeCat === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCat(key === activeCat ? null : key)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm border transition ${
              activeCat === key
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 grid place-items-center text-center p-10 border border-dashed rounded-2xl text-gray-600 dark:text-gray-300">
          <div className="font-medium mb-1">No results found</div>
          <div className="text-sm">Try a different search term or category.</div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <AssetCard key={a.id} asset={a} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  );
}

// --- Creator CTA ------------------------------------------------------------
function CreatorCTA() {
  return (
    <section id="creators" className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">Sell your architectural assets on Cantilever</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Monetize your BIM families, CAD details, spec templates, and render packs. Keep up to 85% revenue, with instant payouts, watermarking, and license controls.</p>
          <div className="mt-6 flex gap-2">
            <PillButton className="bg-blue-600 hover:bg-blue-700"><UploadCloud className="h-4 w-4" /> Upload your first asset</PillButton>
            <GhostButton><User className="h-4 w-4" /> Creator guide</GhostButton>
          </div>
          <ul className="mt-6 grid gap-3 text-sm text-gray-700 dark:text-gray-200">
            {["Invisible watermarking", "City/code tagging", "Analytics & payouts"].map((b) => (
              <li key={b} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {b}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-white/5 dark:to-white/0 p-6">
          <div className="grid grid-cols-2 gap-4">
            {ASSETS.map((a) => (
              <div key={a.id} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5">
                <img src={a.cover} className="h-28 w-full object-cover" alt={a.title} />
                <div className="p-3">
                  <div className="text-sm font-medium line-clamp-1">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.author.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Pricing ---------------------------------------------------------------
function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold text-center">Simple pricing</h2>
      <p className="mt-3 text-center text-gray-600 dark:text-gray-300">Buy once, use forever. Optional Pro plan for teams.</p>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-neutral-950">
          <div className="text-sm font-medium text-gray-500">Marketplace</div>
          <div className="mt-1 text-3xl font-semibold">Pay per asset</div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">From ₹500–₹4,500 per asset depending on complexity.</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Commercial license</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Updates included 6 months</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Instant download</li>
          </ul>
          <PillButton className="mt-6 w-full bg-blue-600 hover:bg-blue-700">Browse assets</PillButton>
        </div>
        <div className="rounded-3xl border-2 border-blue-600 p-6 bg-gradient-to-b from-blue-50 to-white dark:from-white/5 dark:to-transparent">
          <div className="text-sm font-medium text-blue-600">Pro (Teams)</div>
          <div className="mt-1 text-3xl font-semibold">₹1,999 / user / mo</div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Shared seats, private catalogs, and admin controls.</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Private asset libraries</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Version pinning</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Priority support</li>
          </ul>
          <PillButton className="mt-6 w-full bg-blue-600 hover:bg-blue-700">Start free trial</PillButton>
        </div>
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-neutral-950">
          <div className="text-sm font-medium text-gray-500">Creator</div>
          <div className="mt-1 text-3xl font-semibold">Up to 85% rev share</div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Instant payouts, watermarking, license controls.</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Invisible watermarking</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Analytics dashboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Fast review SLAs</li>
          </ul>
          <PillButton className="mt-6 w-full">Become a seller</PillButton>
        </div>
      </div>
    </section>
  );
}

// --- FAQ / Footer -----------------------------------------------------------
function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold text-center">FAQs</h2>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {[{
          q: "How are assets verified?",
          a: "We review structure, parameters, performance, and code tags. Verified creators receive a badge.",
        },{
          q: "What license do I get?",
          a: "Single-firm commercial license with unlimited projects. Stamping or permit submissions require local professionals.",
        },{
          q: "Can I request custom changes?",
          a: "Yes. Use the 'Request tweak' option on the asset page to commission the creator.",
        },{
          q: "How do payouts work for creators?",
          a: "Instant payouts to Indian bank accounts via supported processors after each sale.",
        }].map((f) => (
          <div key={f.q} className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-950">
            <div className="font-medium">{f.q}</div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="inline-flex items-center gap-2">
            <div className="h-7 w-7 grid place-items-center rounded-xl bg-blue-600 text-white font-bold">C</div>
            <span className="font-semibold">Cantilever</span>
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">The marketplace for architects.</p>
        </div>
        <div>
          <div className="font-medium">Product</div>
          <ul className="mt-3 grid gap-2 text-gray-600 dark:text-gray-300">
            <li><a href="#browse">Browse</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">For Creators</div>
          <ul className="mt-3 grid gap-2 text-gray-600 dark:text-gray-300">
            <li>Upload assets</li>
            <li>Creator guidelines</li>
            <li>Legal & licensing</li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Company</div>
          <ul className="mt-3 grid gap-2 text-gray-600 dark:text-gray-300">
            <li>About</li>
            <li>Contact</li>
            <li>Terms & Privacy</li>
          </ul>
        </div>
      </div>
      <div className="text-xs text-center text-gray-500 py-4">© {new Date().getFullYear()} Cantilever. All rights reserved.</div>
    </footer>
  );
}

// --- Root -------------------------------------------------------------------
export default function Index() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onOpen = (a: any) => { setSelected(a); setOpen(true); };
  const onClose = () => { setOpen(false); setSelected(null); };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white">
      <Navbar onToggleMobile={() => setMobileOpen(true)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Hero query={query} setQuery={setQuery} />
      <Catalogue query={query} activeCat={activeCat} setActiveCat={setActiveCat} onOpen={onOpen} />
      <CreatorCTA />
      <Pricing />
      <FAQ />
      <Footer />
      <Modal open={open} onClose={onClose} asset={selected} />
    </div>
  );
}
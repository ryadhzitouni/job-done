"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  User,
  Phone,
  Facebook,
  Instagram,
  Copy,
  Check,
  Loader2,
  Quote,
} from "lucide-react";
import supabase from "@/utils/supabase";

// Composant CopyBox Amélioré
const CopyBox = ({
  icon: Icon,
  title,
  content,
  colorClass,
  iconColor,
}: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border ${colorClass} overflow-hidden flex flex-col h-full`}
    >
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2
          className={`text-sm font-extrabold uppercase tracking-wide flex items-center gap-2 ${iconColor}`}
        >
          <Icon size={18} /> {title}
        </h2>
        <button
          onClick={handleCopy}
          disabled={!content}
          className={`flex items-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg transition-all
            ${
              copied
                ? "bg-green-100 text-green-700 shadow-inner"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-95"
            }`}
        >
          {copied ? (
            <>
              <Check size={14} /> Copié
            </>
          ) : (
            <>
              <Copy size={14} /> Copier
            </>
          )}
        </button>
      </div>
      <div className="p-5 flex-1 bg-white">
        <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
          {content || (
            <span className="text-slate-400 italic flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Génération...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MissionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const missionId = params?.id;
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!missionId) return;
      const { data, error } = await supabase
        .from("missions")
        .select("*, clients(*)")
        .eq("id", missionId)
        .single();
      if (error) {
        router.push("/");
        return;
      }
      setMission(data);
      setLoading(false);
    };
    fetch();
  }, [missionId, router]);

  if (loading)
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </main>
    );

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      {/* Header Large */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-800 transition flex items-center gap-2 font-bold group"
          >
            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-slate-200 transition">
              <ChevronLeft size={20} />
            </div>
            <span className="hidden md:inline">Retour</span>
          </Link>
          <h1 className="text-base font-bold text-slate-900 md:text-lg">
            Détails Mission
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Résumé Mission (Largeur complète) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-blue-800 text-lg mb-1">
                <User size={20} /> {mission.clients?.name || "Client"}
              </div>
              <div className="text-slate-500 text-sm flex items-center gap-2">
                <Phone size={14} /> {mission.clients?.phone || "Non renseigné"}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 md:max-w-xl w-full">
              <p className="text-sm text-slate-600 italic flex gap-2">
                <Quote size={16} className="text-slate-300 shrink-0" />
                {mission.description}
              </p>
            </div>
          </div>
        </div>

        {/* Grille des Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CopyBox
            icon={Facebook}
            title="Post Facebook"
            content={mission.ia_post_facebook}
            colorClass="border-blue-200"
            iconColor="text-blue-700"
          />
          <CopyBox
            icon={Instagram}
            title="Post Instagram"
            content={mission.ia_post_instagram}
            colorClass="border-pink-200"
            iconColor="text-pink-600"
          />
        </div>
      </div>
    </main>
  );
}

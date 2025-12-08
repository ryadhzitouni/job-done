"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation"; // <-- On ajoute useParams ici
import {
  ChevronLeft,
  User,
  Phone,
  Facebook,
  Instagram,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import supabase from "@/utils/supabase";

// Petit composant pour les zones de texte copiables (Inchangé)
const CopyBox = ({ icon: Icon, title, content, colorClass }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-sm border ${colorClass} space-y-3`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
          <Icon size={18} /> {title}
        </h2>
        <button
          onClick={handleCopy}
          disabled={!content}
          className={`flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg transition-all
            ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95"
            }`}
        >
          {copied ? (
            <>
              <Check size={14} /> Copié !
            </>
          ) : (
            <>
              <Copy size={14} /> Copier
            </>
          )}
        </button>
      </div>
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-800 whitespace-pre-wrap min-h-[100px]">
        {content || (
          <span className="text-slate-400 italic">
            Génération en cours ou échouée...
          </span>
        )}
      </div>
    </div>
  );
};

export default function MissionDetailsPage() {
  const router = useRouter();
  const params = useParams(); // <-- LA CORRECTION EST ICI : Méthode plus stable
  const missionId = params?.id; // On récupère l'ID de façon sécurisée

  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissionDetails = async () => {
      if (!missionId) return;

      // On récupère la mission ET les infos du client lié
      const { data, error } = await supabase
        .from("missions")
        .select("*, clients(*)")
        .eq("id", missionId)
        .single();

      if (error) {
        console.error("Erreur:", error);
        alert("Impossible de charger cette mission.");
        router.push("/");
        return;
      }
      setMission(data);
      setLoading(false);
    };

    fetchMissionDetails();
  }, [missionId, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 animate-pulse">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          Chargement de la mission...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-md mx-auto">
        {/* --- Header --- */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10 flex items-center justify-between mb-6 shadow-sm">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-800 transition flex items-center gap-1 text-sm font-bold"
          >
            <ChevronLeft size={20} /> Retour
          </Link>
          <h1 className="text-base font-bold text-slate-900">
            Détails Mission
          </h1>
          <div className="w-14" />
        </header>

        <div className="p-6 space-y-6">
          {/* --- Résumé Client & Mission --- */}
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-3">
            <div className="flex items-center gap-2 font-bold text-blue-800">
              <User size={18} /> {mission.clients?.name || "Client"}
            </div>
            {mission.clients?.phone && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Phone size={14} /> {mission.clients.phone}
              </div>
            )}
            <p className="text-sm text-slate-600 border-t border-blue-200 pt-3 mt-3 italic">
              "{mission.description}"
            </p>
          </div>

          {/* --- Les Posts Générés --- */}
          <h2 className="text-lg font-bold text-slate-900 pt-2">
            Vos Posts Prêts à l'Emploi
          </h2>

          <CopyBox
            icon={Facebook}
            title="Post Facebook"
            content={mission.ia_post_facebook}
            colorClass="border-blue-200"
          />

          <CopyBox
            icon={Instagram}
            title="Post Instagram"
            content={mission.ia_post_instagram}
            colorClass="border-pink-200"
          />
        </div>
      </div>
    </main>
  );
}

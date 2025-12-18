"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  User,
  Loader2,
  Hourglass,
} from "lucide-react";
import supabase from "@/utils/supabase";

export default function DashboardPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    try {
      const { data, error } = await supabase
        .from("missions")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      console.error("Erreur chargement missions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // Calcul du temps gagné (20 min par post généré)
  const postsGeneres = missions.filter((m: any) => m.ia_post_facebook).length;
  const minutesGagnees = postsGeneres * 20;
  const heuresGagnees = Math.floor(minutesGagnees / 60);
  const minutesRestantes = minutesGagnees % 60;

  // Formatage texte (ex: "2h 40min" ou "40 min")
  const tempsGagneTexte =
    heuresGagnees > 0
      ? `${heuresGagnees}h ${minutesRestantes}min`
      : `${minutesGagnees} min`;

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* --- Header Large --- */}
      <header className="bg-white px-6 py-6 border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              J
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                Job Done
              </h1>
              <p className="text-xs md:text-sm text-slate-500 hidden md:block">
                Votre assistant marketing IA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Bouton Desktop seulement */}
            <Link
              href="/mission"
              className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus size={20} /> Nouvelle Mission
            </Link>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* --- Statistiques ("Vanity Metrics") --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Carte Temps Gagné (La plus importante) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 md:h-auto border-l-4 border-l-green-400">
            <div className="bg-green-50 w-8 h-8 rounded-full flex items-center justify-center text-green-600 mb-2">
              <Hourglass size={16} />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">
                {postsGeneres === 0 ? "0 min" : tempsGagneTexte}
              </div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Temps Gagné
              </div>
            </div>
          </div>

          {/* Carte Total Missions */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 md:h-auto">
            <div className="bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center text-slate-600 mb-2">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {missions.length}
              </div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Missions Total
              </div>
            </div>
          </div>

          {/* Call to Action PC */}
          <div className="hidden md:flex col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white items-center justify-between shadow-lg shadow-blue-200">
            <div>
              <h3 className="font-bold text-lg">Boostez votre visibilité</h3>
              <p className="text-blue-100 text-sm opacity-90">
                L'IA est prête pour votre prochain chantier.
              </p>
            </div>
            <Link
              href="/mission"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition"
            >
              Créer maintenant
            </Link>
          </div>
        </div>

        {/* --- Liste des Missions (Responsive Grid) --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" /> Vos Chantiers
            Récents
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
            </div>
          ) : missions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 mb-4 text-lg">
                Vous n'avez pas encore enregistré de mission.
              </p>
              <Link
                href="/mission"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                <Plus size={20} /> Commencer
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {missions.map((mission) => (
                <Link
                  key={mission.id}
                  href={`/mission/${mission.id}`}
                  className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-md">
                      {new Date(mission.created_at).toLocaleDateString("fr-FR")}
                    </span>

                    {mission.ia_post_facebook ? (
                      <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> PRÊT
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} /> ATTENTE
                      </span>
                    )}
                  </div>

                  <div className="mb-4 flex-1">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                      {mission.clients?.name || "Client sans nom"}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mt-2 leading-relaxed">
                      {mission.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <User size={14} /> Client
                    </div>
                    <div className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-blue-50 px-3 py-1.5 rounded-lg">
                      Voir <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- FAB (Mobile Only) --- */}
      <Link
        href="/mission"
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all z-30"
      >
        <Plus size={28} />
      </Link>
    </main>
  );
}

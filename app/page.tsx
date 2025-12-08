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

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* --- Header --- */}
      <header className="bg-white px-6 py-6 sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mes Missions</h1>
            <p className="text-sm text-slate-500">
              {loading
                ? "Chargement..."
                : `${missions.length} mission(s) enregistrée(s)`}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            A
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* --- Statistiques --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-3xl font-bold text-blue-600">
              {missions.filter((m: any) => m.ia_post_facebook).length}
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Posts Prêts
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-3xl font-bold text-slate-900">
              {missions.length}
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Total
            </div>
          </div>
        </div>

        {/* --- Liste des Missions --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" /> Récent
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" />
            </div>
          ) : missions.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 mb-2">
                Aucune mission pour le moment.
              </p>
              <Link
                href="/mission"
                className="text-blue-600 font-bold hover:underline"
              >
                Créer ma première mission
              </Link>
            </div>
          ) : (
            missions.map((mission) => (
              // ICI C'EST LE CHANGEMENT : On utilise Link au lieu de div
              <Link
                key={mission.id}
                href={`/mission/${mission.id}`}
                className="block bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    <span>
                      {new Date(mission.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  {mission.ia_post_facebook ? (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> IA PRÊTE
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock size={10} /> EN ATTENTE
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    {mission.clients?.name || "Client Inconnu"}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mt-1">
                    {mission.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <User size={12} /> {mission.clients?.name}
                  </div>
                  <div className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Voir détails <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* --- FAB (Bouton +) --- */}
      <Link
        href="/mission"
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all z-20"
      >
        <Plus size={28} />
      </Link>
    </main>
  );
}

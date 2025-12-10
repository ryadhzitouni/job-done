"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  Phone,
  Settings,
  Send,
  Loader2,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase";
import { ai } from "@/utils/openai";

// Composant Input (inchangé)
const InputField = ({
  icon: Icon,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wide">
      <Icon size={14} /> {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm shadow-sm outline-none font-medium"
    />
  </div>
);

export default function MissionFlowPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      setStatusMessage("Enregistrement du client...");
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .insert([{ name: clientName, phone: clientPhone }])
        .select("id")
        .single();

      if (clientError) throw new Error(`Erreur Client: ${clientError.message}`);
      const clientId = clientData.id;

      setStatusMessage("Création de la mission...");
      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .insert([{ client_id: clientId, description: description }])
        .select("id")
        .single();

      if (missionError)
        throw new Error(`Erreur Mission: ${missionError.message}`);
      const missionId = missionData.id;

      setStatusMessage("L'IA rédige vos posts...");

      const prompt = `
        Tu es un expert en Social Media Marketing pour les entrepreneurs locaux.
        Ta mission : Transformer une description factuelle d'un travail réalisé en un contenu engageant.
        DONNÉES : Description : "${description}", Client : ${clientName}.
        RÈGLES : Zéro Jargon, Émotion, Adaptabilité métier.
        FORMAT JSON STRICT : { "facebook": "...", "instagram": "..." }
      `;

      const completion = await ai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = JSON.parse(completion.choices[0].message.content || "{}");

      setStatusMessage("Sauvegarde...");
      const { error: updateError } = await supabase
        .from("missions")
        .update({
          ia_post_facebook: content.facebook,
          ia_post_instagram: content.instagram,
          status: "generated",
        })
        .eq("id", missionId);

      if (updateError)
        throw new Error(`Erreur Update IA: ${updateError.message}`);

      alert("🎉 C'est fait !");
      router.push("/");
    } catch (error: any) {
      console.error("ERREUR:", error);
      alert(`Erreur : ${error.message}`);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col pb-10">
      {/* Header Large */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-800 transition flex items-center gap-2 font-bold group"
          >
            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-slate-200 transition">
              <ChevronLeft size={20} />
            </div>
            <span className="hidden md:inline">Retour au Tableau de bord</span>
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Nouvelle Mission</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
        >
          {/* Colonne Gauche : Client */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 h-full">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <User size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  1. Le Client
                </h2>
              </div>

              <div className="space-y-4 pt-2">
                <InputField
                  icon={User}
                  label="Nom complet"
                  placeholder="Ex: Mme Dubois"
                  value={clientName}
                  onChange={(e: any) => setClientName(e.target.value)}
                />
                <InputField
                  icon={Phone}
                  label="Téléphone"
                  placeholder="06 12 34 56 78"
                  type="tel"
                  value={clientPhone}
                  onChange={(e: any) => setClientPhone(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg leading-relaxed">
                ℹ️ Ces informations restent privées et servent à personnaliser
                les posts.
              </p>
            </div>
          </div>

          {/* Colonne Droite : Mission + Bouton */}
          <div className="space-y-6 flex flex-col">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 flex-1">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <Settings size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  2. La Prestation
                </h2>
              </div>

              <div className="space-y-3 pt-2 h-full">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wide">
                  <PenTool size={14} /> Description du travail
                </label>
                <textarea
                  rows={8}
                  placeholder="Décrivez ce que vous avez fait :&#10;- Type de chantier&#10;- Matériaux utilisés&#10;- Difficultés surmontées..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm shadow-sm outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !clientName || !description}
              className={`w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]
                ${
                  isLoading || !clientName || !description
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" /> {statusMessage}
                </>
              ) : (
                <>
                  <Send size={24} /> Générer le Pack Marketing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

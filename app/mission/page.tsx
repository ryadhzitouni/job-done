"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  Phone,
  Settings,
  Send,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase";
import { ai } from "@/utils/openai";

// Composant Input simple pour le design
const InputField = ({
  icon: Icon,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: any) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
      <Icon size={14} /> {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all text-sm shadow-sm outline-none"
    />
  </div>
);

export default function MissionFlowPage() {
  const router = useRouter();

  // États (Les données du formulaire)
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [description, setDescription] = useState("");

  // États visuels (Chargement)
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      // --- ETAPE 1 : LE CLIENT ---
      setStatusMessage("Enregistrement du client...");

      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .insert([{ name: clientName, phone: clientPhone }])
        .select("id")
        .single();

      if (clientError) throw new Error(`Erreur Client: ${clientError.message}`);
      const clientId = clientData.id;

      // --- ETAPE 2 : LA MISSION ---
      setStatusMessage("Création de la mission...");

      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .insert([{ client_id: clientId, description: description }])
        .select("id")
        .single();

      if (missionError)
        throw new Error(`Erreur Mission: ${missionError.message}`);
      const missionId = missionData.id;

      // --- ETAPE 3 : L'INTELLIGENCE ARTIFICIELLE (GPT-4o) ---
      setStatusMessage("L'IA prépare des posts engageants...");

      const prompt = `
        Tu es un expert en Social Media Marketing pour les entrepreneurs locaux.
        Ta mission : Transformer une description factuelle d'un travail réalisé en un contenu engageant, viral et accessible au grand public.
        
        DONNÉES ENTRÉE :
        - Description brute : "${description}"
        - Client (optionnel) : ${clientName}
        
        RÈGLES D'OR (VISIBILITÉ & ENGAGEMENT) :
        1. **Zéro Jargon :** Si la description est technique, traduis-la en bénéfice client (Ex: "Changement résistance chauffe-eau" devient "Le retour des douches chaudes pour cette famille !").
        2. **Émotion :** Mets l'accent sur la satisfaction, le soulagement, la beauté ou le plaisir du client.
        3. **Adaptabilité :** Détecte automatiquement le métier (Coiffure, BTP, Photo, Coaching...) et adapte le champ lexical et les emojis.
        
        FORMAT ATTENDU (JSON STRICT) :
        {
          "facebook": "Format Storytelling (Histoires) : \n- Une accroche qui interpelle (Question ou Affirmation forte). \n- Une petite histoire sur la mission (Le défi -> La solution). \n- Conclusion chaleureuse. \n- Appel à l'action pour générer des commentaires (ex: 'Et vous, vous préférez X ou Y ?').",
          
          "instagram": "Format Visuel & Punchy : \n- Phrase courte et impactante. \n- 3 émojis qui matchent parfaitement l'ambiance. \n- Un petit texte qui donne la 'vibe' du moment. \n- Liste de 10 hashtags : Mélange de hashtags très populaires (#Picoftheday...) et de hashtags métier (#CoiffeurParis...)."
        }
      `;

      const completion = await ai.chat.completions.create({
        model: "gpt-4o", // Le modèle le plus puissant
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }, // Force le format JSON pour éviter les erreurs
      });

      // On lit la réponse de l'IA
      const content = JSON.parse(completion.choices[0].message.content || "{}");

      // --- ETAPE 4 : SAUVEGARDE DES RESULTATS ---
      setStatusMessage("Sauvegarde des résultats...");

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

      // --- SUCCÈS ---
      alert("🎉 C'est fait ! Les posts sont générés.");
      router.push("/");
    } catch (error: any) {
      console.error("ERREUR:", error);
      alert(`Une erreur est survenue : ${error.message}`);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-800 transition"
          >
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Nouvelle Mission</h1>
          <div className="w-6" />
        </header>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide flex items-center gap-2">
              <User size={16} /> Info Client
            </h2>
            <InputField
              icon={User}
              label="Nom"
              placeholder="Mme Dubois"
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

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-green-600 uppercase tracking-wide flex items-center gap-2">
              <Settings size={16} /> La Prestation
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">
                Description du travail
              </label>
              <textarea
                rows={4}
                placeholder="Ex: Rénovation peinture salon, couleur blanc cassé, 2 jours de travail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm shadow-sm outline-none resize-none"
              />
              <p className="text-xs text-slate-400 italic">
                L'IA (GPT-4o) utilisera ce texte pour rédiger vos posts.
              </p>
            </div>
          </div>

          {/* Bouton Submit Intelligent */}
          <button
            type="submit"
            disabled={isLoading || !clientName || !description}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg
              ${
                isLoading || !clientName || !description
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm font-medium">{statusMessage}</span>
              </>
            ) : (
              <>
                <Send size={20} /> Générer le Pack
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

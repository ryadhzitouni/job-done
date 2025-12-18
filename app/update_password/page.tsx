"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase";
import { Lock, Loader2, CheckCircle } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // On met à jour le mot de passe de l'utilisateur connecté
      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) throw error;

      setMessage({
        text: "Mot de passe modifié avec succès ! Redirection...",
        type: "success",
      });

      // On redirige vers l'accueil après 2 secondes
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      setMessage({
        text: error.message || "Erreur lors de la mise à jour.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Nouveau mot de passe
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Choisissez un mot de passe sécurisé pour votre compte.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 text-slate-400"
              size={18}
            />
            <input
              type="password"
              required
              placeholder="Nouveau mot de passe (6 min)"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm text-center font-medium ${
                message.type === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Enregistrer le mot de passe"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

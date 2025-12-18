"use client";

import React, { useState } from "react";
import supabase from "@/utils/supabase";
import {
  Mail,
  ArrowRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // On demande à Supabase d'envoyer un mail de réinitialisation
      // IMPORTANT : On lui dit vers quelle page rediriger après le clic (update-password)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/login"
            className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 mb-4 transition-colors"
          >
            <ChevronLeft size={16} /> Retour connexion
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Mot de passe oublié ?
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Pas de panique. Entrez votre email et nous vous enverrons un lien de
            réinitialisation.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center space-y-3 animate-in fade-in">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-bold text-green-800">Email envoyé !</h3>
            <p className="text-sm text-green-700">
              Vérifiez votre boîte mail (et vos spams). Un lien vous attend pour
              changer votre mot de passe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="email"
                required
                placeholder="Votre email pro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {errorMsg && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                {errorMsg}
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
                <>
                  Envoyer le lien <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

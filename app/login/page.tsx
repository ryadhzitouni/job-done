"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase";
import {
  Loader2,
  Lock,
  Mail,
  ArrowRight,
  User,
  Briefcase,
  Phone,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  // --- ÉTATS DU FORMULAIRE ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Infos Inscription
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [job, setJob] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // --- INSCRIPTION ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              job_title: job,
              company_name: companyName,
              phone: phone,
              city: city,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          router.refresh();
          router.push("/");
        } else {
          setMessage({
            text: "Compte créé ! Vérifiez vos emails pour valider.",
            type: "success",
          });
          setIsSignUp(false);
        }
      } else {
        // --- CONNEXION ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.refresh();
        router.push("/");
      }
    } catch (error: any) {
      console.error("Erreur Auth:", error);
      setMessage({
        text: error.message || "Une erreur est survenue",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans py-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg space-y-6 transition-all duration-300">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-blue-200">
            J
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isSignUp ? "Créer un compte Pro" : "Connexion"}
          </h1>
          <p className="text-slate-500 text-sm">
            {isSignUp
              ? "Rejoignez la communauté Job Done."
              : "Gérez votre activité en 1 clic."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* --- BLOC INSCRIPTION --- */}
          {isSignUp && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 bg-slate-50 p-5 rounded-xl border border-slate-100">
              {/* 1. IDENTITÉ */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <User size={12} /> Identité
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      required={isSignUp}
                      placeholder="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required={isSignUp}
                      placeholder="Nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PRO & MÉTIER (Adapté pour tout type de pro) */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1 mt-2">
                  <Briefcase size={12} /> Activité
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    {/* J'ai mis une étoile à la place du marteau pour faire plus généraliste */}
                    <Star
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={14}
                    />
                    <input
                      type="text"
                      required={isSignUp}
                      placeholder="Métier (ex: Consultant...)"
                      value={job}
                      onChange={(e) => setJob(e.target.value)}
                      className="w-full pl-9 p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-bold text-slate-700"
                    />
                  </div>
                  <input
                    type="text"
                    required={isSignUp}
                    placeholder="Nom Entreprise"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 3. CONTACT RAPIDE */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1 mt-4">
                  <Phone size={12} /> Contact
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={14}
                    />
                    <input
                      type="tel"
                      required={isSignUp}
                      placeholder="Téléphone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={14}
                    />
                    <input
                      type="text"
                      required={isSignUp}
                      placeholder="Code Postal / Ville"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- LOGIN --- */}
          <div className="space-y-4 pt-2">
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="email"
                required
                placeholder="Email professionnel"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                type="password"
                required
                placeholder="Mot de passe"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            )}
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
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : isSignUp ? (
              "Créer mon compte"
            ) : (
              "Se connecter"
            )}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-50 mt-6">
          <p className="text-xs text-slate-400 mb-2">
            {isSignUp ? "Déjà inscrit ?" : "Nouveau ?"}
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-bold transition-colors"
          >
            {isSignUp ? "Me connecter" : "Créer un compte"}
          </button>
        </div>
      </div>
    </main>
  );
}

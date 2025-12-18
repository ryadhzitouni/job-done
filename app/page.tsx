import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
        Job <span className="text-blue-500">Done.</span>
      </h1>
      <p className="text-xl text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
        L'outil secret des pros indépendants pour générer leur marketing en 30
        secondes chrono.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href="/login"
          className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition shadow-lg text-lg"
        >
          Se connecter
        </Link>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 text-lg ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900"
        >
          Essayer gratuitement
        </Link>
      </div>
    </main>
  );
}

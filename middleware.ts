import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. On prépare la réponse
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. On configure le client Supabase pour lire les cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Astuce : On met à jour les cookies sur la requête ET la réponse
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 3. On vérifie qui est connecté
  // getUser est plus sécurisé que getSession pour le middleware
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Gestion des Redirections (Le Vigile)
  const path = request.nextUrl.pathname;

  // CAS A : L'utilisateur N'EST PAS connecté
  if (!user) {
    // S'il essaie d'aller ailleurs que sur /login, on l'éjecte
    if (path !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // CAS B : L'utilisateur EST connecté
  if (user) {
    // S'il essaie d'aller sur /login, on le renvoie à l'accueil (inutile de se reconnecter)
    if (path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 5. Si tout est bon, on laisse passer
  return response;
}

export const config = {
  matcher: [
    /*
     * On protège tout le site SAUF :
     * - Les fichiers internes de Next.js (_next/static, _next/image)
     * - Le favicon
     * - Les images (svg, png, jpg...)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

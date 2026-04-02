import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE_NAME = "unbound_auth_role"

type UserRole = "student" | "club" | "admin" | "superadmin"

/** Routes only accessible when NOT authenticated */
const AUTH_ONLY_PATHS = ["/login", "/signup", "/forgot-password"]

/** Role-restricted route prefixes */
const ROLE_ROUTES: Record<UserRole, string> = {
  student: "/student",
  club: "/club",
  admin: "/admin",
  superadmin: "/superadmin",
}

/** Dashboard home per role — used for redirect after login */
const ROLE_HOME: Record<UserRole, string> = {
  student: "/student",
  club: "/club",
  admin: "/admin",
  superadmin: "/superadmin",
}

function getRole(request: NextRequest): UserRole | null {
  const role = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (role && role in ROLE_HOME) return role as UserRole
  return null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = getRole(request)

  // If authenticated and hitting an auth-only page, redirect to their dashboard
  if (role && AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url))
  }

  // If not authenticated and hitting a role-protected route, redirect to login
  if (!role) {
    const isProtected = Object.values(ROLE_ROUTES).some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    )
    if (isProtected) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If authenticated and hitting a role-route that doesn't match their role, redirect to their own dashboard
  if (role) {
    const mismatch = Object.entries(ROLE_ROUTES).some(
      ([r, prefix]) => r !== role && (pathname === prefix || pathname.startsWith(prefix + "/"))
    )
    if (mismatch) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icon.svg, apple-icon.svg (icons)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|apple-icon\\.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)).*)",
  ],
}

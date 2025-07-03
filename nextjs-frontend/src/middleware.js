// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import publicRoute from "./routes/public-route";

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;
//   const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
//   const isPublicRoute = Object.values(publicRoute).includes(normalizedPath);

//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   // Get the token (you may need to set NEXTAUTH_SECRET in your env)
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   if (!token) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/login";
//     url.search = "";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)).*)"],
// };

import publicRoute from "./routes/public-route";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

        const isPublicRoute = Object.values(publicRoute).includes(normalizedPath);

        if (isPublicRoute) return true;

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)).*)"],
};

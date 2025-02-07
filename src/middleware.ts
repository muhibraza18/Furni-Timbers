import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node'; // Corrected import

const isProtectedRoute = createRouteMatcher([
  '/checkout(.*)', 
  '/forum(.*)',
  '/admin(.*)' // Protect admin route
]);

export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth(); // Await the auth object

  // Debugging: Log the authObject to see its contents
  console.log("Auth Object:", authObject);
  
  // Check if the user is authenticated
  if (isProtectedRoute(req)) {
    if (!authObject.userId) {
      console.log("User is not authenticated, redirecting to home.");
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      // Fetch user details using clerkClient
      const user = await clerkClient.users.getUser(authObject.userId);
      const userEmail = user?.emailAddresses?.[0]?.emailAddress; // Get user's primary email

      // Debugging: Log the user email
      console.log("User Email:", userEmail);

      // Additional check for /admin route
      if (req.nextUrl.pathname.startsWith('/admin')) {
        if (userEmail !== "muhibraza04@gmail.com") {
          console.log("Email does not match, redirecting to home.");
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return NextResponse.redirect(new URL("/", req.url)); // Redirect if user fetch fails
    }
  }

  // If the route is not protected or the user is authorized, continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};








// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isProtectedRoute = createRouteMatcher(['/checkout(.*)', '/forum(.*)'])

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect()
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

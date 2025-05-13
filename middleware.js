import { decode } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const publicPaths = ['/', '/home', '/login','/signup', '/contact'];




const isTokenValid = (token) => {
  
  try {
    const decodedToken = decode(token);

    if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      if (decodedToken.exp < currentTime) {
        // Token has expired
        return false;
      }
    }

   // console.log(decodedToken); // Log token details for debugging if needed
    return true;
  } catch (error) {
    // Optional: log error details for debugging
    return false;
  }
};


export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('Token')?.value || null;

  if (!isTokenValid(token) && token!==null) {
    // Set the token cookie to null if it's expired or invalid
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('Token', '', { maxAge: 0 });
    return response;
  }
 
 
  // Public paths are accessible without any authentication
  if (publicPaths.includes(path)) {
    // Redirect logged-in users away from login/signup to the dashboard
    if ( token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If the user is not logged in, redirect to login for protected paths
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Check if accessing an admin-only route, and redirect if not an admin
  if (path.startsWith('/admin') && !userIsAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  


  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/signup', '/contact','/']
};
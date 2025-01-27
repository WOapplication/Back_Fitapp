import { NextResponse } from 'next/server';

export function middleware(req) {
    const res = NextResponse.next();

    console.log('Middleware activated for URL:', req.url);


    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');


    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            status: 200,
        });
    }

    return res;
}

export const config = {
    matcher: '/api/:path*', // Middleware для всех маршрутов внутри /api/
};

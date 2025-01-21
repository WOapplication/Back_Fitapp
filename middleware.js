import { NextResponse } from 'next/server';

export function middleware(req) {
    const res = NextResponse.next();

    // Добавляем заголовки CORS
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Обработка preflight-запросов
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: res.headers,
            status: 200,
        });
    }

    return res;
}

import { NextResponse } from 'next/server';

/** Endpoint de salut bàsic. Punt de partida per a futures rutes d'API. */
export function GET() {
  return NextResponse.json({ status: 'ok', service: '360events' });
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-extrabold heading-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-platinum">
        Aquesta pàgina no existeix
      </h1>
      <p className="mt-3 max-w-md text-text-gray">
        Potser l’enllaç és antic o la pàgina encara està en construcció.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Tornar a l’inici
      </Link>
    </main>
  );
}

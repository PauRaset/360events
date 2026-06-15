import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Logo } from '@/components/ui/Logo';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Accés al panell',
  robots: { index: false, follow: false },
};

export default async function PanellLoginPage() {
  const session = await auth();
  if (session?.user) redirect('/panell/reserves');

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 font-display text-2xl font-extrabold text-platinum">
            Panell de gestió
          </h1>
          <p className="mt-2 text-sm text-text-gray">
            Accés restringit. Inicia sessió per continuar.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

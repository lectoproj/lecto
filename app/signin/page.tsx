'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataProtection, setDataProtection] = useState(false);
  const [dataPublication, setDataPublication] = useState(false);

  const handleSignIn = async (providerId: string) => {
    setLoading(true);
    const res = await signIn(providerId, { callbackUrl: '/' });
    setLoading(false);

    if (!res?.ok) {
      setError('Sign-in failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!dataProtection || !dataPublication) {
    //   setError('You must agree to the data protection and publication terms.');
    //   return;
    // }

    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    setLoading(false);

    if (res?.ok) {
      // Redirect to home or another page after successful login
      window.location.href = '/';
    } else {
      setError(res?.error || 'Invalid email or password');
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales abajo</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* 
          Data protection and publication checkboxes
          <div className="grid gap-4 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dataProtection"
                checked={dataProtection}
                onChange={(e) => setDataProtection(e.target.checked)}
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="dataProtection" className="ml-2 text-sm text-gray-700">
                Entiendo que mis datos usados se protegerán bajo la ley de protección de datos personales y solamente se utilizarán para la prueba de la aplicación.
              </Label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dataPublication"
                checked={dataPublication}
                onChange={(e) => setDataPublication(e.target.checked)}
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="dataPublication" className="ml-2 text-sm text-gray-700">
                Acepto que la información obtenida en la aplicación se publicará para fines científicos y mis datos se resguardarán.
              </Label>
            </div>
          </div> */}

          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <div className="flex flex-col gap-2">
            {/* <Button
              type="button"
              className="w-full"
              onClick={() => handleSignIn('github')}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign in with GitHub'}
            </Button> */}

            <Button
              type="button"
              className="w-full bg-blue-500 text-white"
              onClick={() => handleSignIn('google')}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign in with Google'}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          No tienes una cuenta?{' '}
          <Link href="/register" className="underline">
            Registrate
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

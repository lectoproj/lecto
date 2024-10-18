'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // For Google/GitHub sign-in
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Custom input component
import { Label } from '@/components/ui/label'; // Custom label component
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'; // Custom card component

// export const metadata = {
//   title: 'Registrate | Lecto'
// };

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [dataProtection, setDataProtection] = useState(false);
  const [dataPublication, setDataPublication] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          name,
          fecha_nacimiento: new Date(fechaNacimiento)
            .toISOString()
            .split('T')[0], // Convert to text (YYYY-MM-DD)
          data_protection: dataProtection,
          data_publication: dataPublication
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/signin');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: '/' });
    setLoading(false);
  };

  const isFormValid = dataProtection && dataPublication;

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Registrar</CardTitle>
        <CardDescription>Crear una nueva cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
            <Input
              id="fecha_nacimiento"
              type="date"
              placeholder="Enter your date of birth"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </div>

          {/* Data protection and publication checkboxes */}
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
              <Label
                htmlFor="dataProtection"
                className="ml-2 text-sm text-gray-700"
              >
                Entiendo que mis datos usados se protegerán bajo la ley de
                protección de datos personales y solamente se utilizarán para la
                prueba de la aplicación.
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
              <Label
                htmlFor="dataPublication"
                className="ml-2 text-sm text-gray-700"
              >
                Acepto que la información obtenida en la aplicación se publicará
                para fines científicos y mis datos se resguardarán.
              </Label>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !isFormValid}
          >
            {loading ? 'Registering...' : 'Registrate'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="border-t border-gray-300 w-full"></span>
          <span className="px-4 text-gray-500">O</span>
          <span className="border-t border-gray-300 w-full"></span>
        </div>

        {/* Google & GitHub Sign-In */}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            className="w-full bg-blue-500 text-white"
            onClick={() => handleSignIn('google')}
            disabled={loading || !isFormValid}
          >
            {loading ? 'Loading...' : 'Registrate con Google'}
          </Button>
        </div>

        {/* Link to Sign In Page */}
        <div className="mt-4 text-center text-sm">
          Ya tienes una cuenta?{' '}
          <a href="/signin" className="underline text-blue-500">
            Ingresa
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

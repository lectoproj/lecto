'use client'

import React, { useState, useEffect, useCallback, createContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const protectedPaths = ['/lecturas/texto', '/evaluacion'];

export const NavigationContext = createContext<{ handleNavigation: (href: string) => boolean }>({
  handleNavigation: () => true,
});

export const NavigationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (protectedPaths.includes(pathname)) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  const handleNavigation = useCallback((href: string) => {
    if (protectedPaths.includes(pathname) && !protectedPaths.includes(href)) {
      setIsAlertOpen(true);
      setPendingNavigation(href);
      return false;
    }
    return true;
  }, [pathname]);

  const handleConfirmNavigation = () => {
    setIsAlertOpen(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleCancelNavigation = () => {
    setIsAlertOpen(false);
    setPendingNavigation(null);
  };

  return (
    <NavigationContext.Provider value={{ handleNavigation }}>
      {children}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de salir de esta lectura. Si lo haces, perderas tu progreso y esta lectura y su evaluación no se guardarán. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNavigation}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNavigation}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </NavigationContext.Provider>
  );
};
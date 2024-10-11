import React, { useContext } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Menu, BookPlus, Settings } from 'lucide-react';
import { Logo, UsersIcon } from '@/components/icons';
import { NavItem } from './nav-item';
import { AuthContext } from 'app/contextApi/authContext';

const Mobile = () => {
  const authContext = useContext(AuthContext);
  const userInfo = authContext?.userInfo;

  // Helper function to check if the user is eligible for the posttest
  const showPosttest =
    userInfo?.preCount > 0 &&
    userInfo?.postCount === 0 &&
    userInfo?.normalCount === 8;

  // Helper function to check if the user is eligible for Lecturas
  const showLecturas =
    userInfo?.preCount > 0 &&
    ((userInfo?.normalCount === 8 && userInfo?.postCount > 0) ||
      userInfo?.normalCount !== 8);

    return (
        <div className="lg:hidden">
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="lg:hidden">
                <Menu className="h-6 w-6 text-green-500" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="p-0 bg-gradient-to-b from-blue-300 via-purple-300 to-purple-200 dark:bg-gradient-to-b dark:from-blue-300 dark:via-purple-300 dark:to-purple-200"
            >
                <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-5 bg-gradient-to-r from-purple-300 via-purple-200 to-blue-300">
                    <Link className="flex items-center gap-2 font-semibold" href="/">
                    <Logo />
                    <span className="text-green-600">Lecto</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                    <NavItem href="/">
                        <Home className="h-4 w-4 text-green-500" />
                        Inicio
                    </NavItem>
                    <NavItem href="/users">
                        <UsersIcon className="h-4 w-4 text-green-500" />
                        Usuario
                    </NavItem>
                    <NavItem href="/settings">
                        <Settings className="h-4 w-4 text-green-500" />
                        Configuracion
                    </NavItem>
                    {userInfo?.preCount < 1 && (
                        <>
                    <NavItem href="/evaluaciones-guardadas">
                    <BookPlus className="h-4 w-4 text-green-500" />
                    Evaluaciones guardadas
                </NavItem>
                <NavItem href="/perfil">
                        <BookPlus className="h-4 w-4 text-green-500" />
                        Perfil
                    </NavItem>
                    <NavItem href="/salon-de-logros">
                    <BookPlus className="h-4 w-4 text-green-500" />
                    Salón de logros
                </NavItem>
                <NavItem href="/racha-de-lectura">
                    <BookPlus className="h-4 w-4 text-green-500" />
                    Racha de lectura
                </NavItem>
                        <NavItem href="/pretest">
                            <BookPlus className="h-4 w-4 text-green-500" />
                            Pretest Evaluation
                        </NavItem>
                        </>
                    )}
                    {showPosttest && (
                        <NavItem href="/posttest">
                            <BookPlus className="h-4 w-4 text-green-500" />
                            Posttest Evaluation
                        </NavItem>
                    )}
                    {showLecturas && (
                        <NavItem href="/lecturas">
                            <BookPlus className="h-4 w-4 text-green-500" />
                            Lecturas
                        </NavItem>
                    )}
                    </nav>
                </div>
                </div>
            </SheetContent>
            </Sheet>
        </div>
  )
}

export default Mobile;

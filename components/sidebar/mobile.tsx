import React, { useContext } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Menu, BookPlus, User, Bookmark, CopyCheck, Gem, MessageCircleQuestion } from 'lucide-react';
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
                <Menu className="h-6 w-6 text-amber-900" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="p-0"
            >
                <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-5 ">
                    <Link className="flex items-center gap-2 font-semibold" href="/">
                    <Logo />
                    <span className="text-amber-900">Lecto</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                    <NavItem href="/">
                        <Home className="h-4 w-4 text-amber-900" />
                        Inicio
                    </NavItem>
                    {showLecturas && (
                        <NavItem href="/lecturas">
                            <BookPlus className="h-4 w-4 text-amber-900" />
                            Lectura diaria
                        </NavItem>
                    )}
                    {userInfo?.email ? (
                        <>
                    <NavItem href="/evaluaciones-guardadas">
                        <Bookmark className="h-4 w-4 text-amber-900" />
                        Historial de evaluaciones
                    </NavItem>
                    <NavItem href="/perfil">
                        <User className="h-4 w-4 text-amber-900" />
                        Perfil
                    </NavItem>
                    <NavItem href="/salon-de-logros">
                        <Gem className="h-4 w-4 text-amber-900" />
                        Salón de logros
                    </NavItem>
                    <NavItem href="/racha-de-lectura">
                        <CopyCheck className="h-4 w-4 text-amber-900" />
                        Racha de lectura
                    </NavItem>
                    </>): null
                    }
                    {userInfo?.preCount < 1 && (
                        <NavItem href="/pretest">
                            <BookPlus className="h-4 w-4 text-amber-900" />
                            Tu primera evaluación
                        </NavItem>
                        )}
                    {showPosttest && (
                        <NavItem href="/posttest">
                            <BookPlus className="h-4 w-4 text-amber-900" />
                            Evaluación de control
                        </NavItem>
                    )}
                    <NavItem href="/qa">
                        <MessageCircleQuestion className="h-4 w-4 text-amber-900" />
                        Preguntas frecuentes
                    </NavItem>
                    </nav>
                </div>
                </div>
            </SheetContent>
            </Sheet>
        </div>
  )
}

export default Mobile;

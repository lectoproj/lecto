import React, { useContext } from 'react';
import { Home, BookPlus, User, Bookmark, CopyCheck, Gem, MessageCircleQuestion} from 'lucide-react';
import { UsersIcon } from '@/components/icons';
import { NavItem } from './nav-item';
import { AuthContext } from 'app/contextApi/authContext';

const Web = () => {
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
    );
};

export default Web;

import React, { useContext } from 'react';
import { Home, BookPlus, Settings } from 'lucide-react';
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
                
                {userInfo?.email ? (   
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
                </>): null
                }
                {userInfo?.preCount < 1 && (

                    <NavItem href="/pretest">
                        <BookPlus className="h-4 w-4 text-green-500" />
                        Pretest Evaluation
                    </NavItem>
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
    );
};

export default Web;

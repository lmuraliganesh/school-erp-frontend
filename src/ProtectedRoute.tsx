import {Navigate} from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps{
    token : string|null;
    children: ReactNode;
}

function ProtectedRoute({token,children}:ProtectedRouteProps){
    if (!token){
        return<Navigate to = "\login" replace />;
        }
        return<>{children}</>;
}

export default ProtectedRoute; 
import { useState, useContext, createContext, ReactNode } from 'react';
import auth from '@react-native-firebase/auth'; // or your auth service

type User = {
    uid: string;
    email: string;
    displayName?: string;
};

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const { user: authUser } = await auth().signInWithEmailAndPassword(email, password);
            setUser({
                uid: authUser.uid,
                email: authUser.email!,
                displayName: authUser.displayName || undefined,
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, displayName: string) => {
        try {
            const { user: authUser } = await auth().createUserWithEmailAndPassword(email, password);
            await authUser.updateProfile({ displayName });
            setUser({
                uid: authUser.uid,
                email: authUser.email!,
                displayName,
            });
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth().signOut();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
    type User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import type { UserRole } from "@/lib/db/types";

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    role: UserRole | null;
    setRole: (role: UserRole) => void;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: UserRole) => Promise<void>;
    signInWithGoogle: (role?: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRoleState] = useState<UserRole | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                const saved = localStorage.getItem(`role_${u.uid}`);
                if (saved === "job_seeker" || saved === "hr_recruiter") {
                    setRoleState(saved);
                } else {
                    const userDoc = await getDoc(doc(db, "users", u.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        if (data.role === "job_seeker" || data.role === "hr_recruiter") {
                            setRoleState(data.role);
                            localStorage.setItem(`role_${u.uid}`, data.role);
                        }
                    }
                }
            } else {
                setRoleState(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    function setRole(r: UserRole) {
        setRoleState(r);
        if (user) {
            localStorage.setItem(`role_${user.uid}`, r);
        }
    }

    async function signIn(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
    }

    async function createUserDocument(user: User, role: UserRole) {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) {
            const isJobSeeker = role !== "hr_recruiter";
            await setDoc(userRef, {
                userId: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split("@")[0] || "",
                role,
                isJobSeeker,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                profileComplete: false,
                metadata: {
                    totalResumesUploaded: 0,
                    totalJobsApplied: 0,
                    averageATSScore: 0
                }
            });
        }
    }

    async function signUp(email: string, password: string, role: UserRole) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserDocument(credential.user, role);
        setRole(role);
    }

    async function signInWithGoogle(role?: UserRole) {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        if (role) {
            await createUserDocument(credential.user, role);
            setRole(role);
        }
    }

    async function signOut() {
        await firebaseSignOut(auth);
        setRoleState(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, role, setRole, signIn, signUp, signInWithGoogle, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}

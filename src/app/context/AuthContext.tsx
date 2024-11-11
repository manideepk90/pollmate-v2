"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/initFirebase";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserData {
  uid: string;
  email: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  status: "online" | "offline";
  lastActive: Date;
  loginTimestamp: number;
  polls?: Poll[];
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserPolls = useCallback(async (userId: string) => {
    try {
      const pollsRef = collection(db, "polls");
      const q = query(pollsRef, where("createdBy", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Poll[];
    } catch (error) {
      console.error("Error fetching user polls:", error);
      return [];
    }
  }, []);

  const fetchUserData = useCallback(
    async (userId: string) => {
      try {
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data() as UserData;
          const userPolls = await fetchUserPolls(userId);
          setUserData({ ...userData, polls: userPolls });
        } else {
          console.error("No user data found!");
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      }
    },
    [fetchUserPolls]
  );

  const updateUserStatus = useCallback(
    async (userId: string, status: "online" | "offline") => {
      try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          status,
          lastActive: new Date(),
          loginTimestamp: new Date().getTime(),
        });
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    },
    []
  );

  const checkAutoLogout = useCallback(async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const { loginTimestamp } = docSnap.data();
        if (new Date().getTime() - loginTimestamp > THIRTY_DAYS_MS) {
          await logout();
          toast.error("Session expired. Please login again.");
        }
      }
    } catch (error) {
      console.error("Error checking auto logout:", error);
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    if (user?.uid) {
      await fetchUserData(user.uid);
    }
  }, [user?.uid, fetchUserData]);

  const updateUserProfile = useCallback(
    async (data: Partial<UserData>) => {
      if (!user?.uid) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          ...data,
          updatedAt: new Date(),
        });
        await refreshUserData();
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      }
    },
    [user?.uid, refreshUserData]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      try {
        if (currentUser) {
          setUser(currentUser);
          await checkAutoLogout(currentUser.uid);
          await fetchUserData(currentUser.uid);
          await updateUserStatus(currentUser.uid, "online");
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription and update status on unmount
    return () => {
      if (user?.uid) {
        updateUserStatus(user.uid, "offline");
      }
      unsubscribe();
    };
  }, [checkAutoLogout, updateUserStatus, fetchUserData]);

  const logout = async () => {
    try {
      const confirmation = window.confirm("Are you sure you want to log out?");
      if (!confirmation || !user) return;

      await updateUserStatus(user.uid, "offline");
      await signOut(auth);
      setUser(null);
      setUserData(null);
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to logout");
    }
  };

  const value = {
    user,
    userData,
    loading,
    logout,
    updateUserProfile,
    refreshUserData,
  };

  if (loading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

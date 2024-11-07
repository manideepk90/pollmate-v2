import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/initFirebase";

export const checkAdminAccess = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { isAuthorized: false, redirectTo: "/login?returnUrl=/dashboard" };
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || !userDoc.data().isAdmin) {
      return { isAuthorized: false, redirectTo: "/polls/my-polls" };
    }

    return { isAuthorized: true, redirectTo: null };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAuthorized: false, redirectTo: "/polls/my-polls" };
  }
};

export const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.data();
};

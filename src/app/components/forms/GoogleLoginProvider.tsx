import React from "react";
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { db, auth } from "@/firebase/initFirebase";
import CommonButton from "../buttons/CommonButton";

const providers = [
  {
    name: "google",
    displayName: "Google",
    icon: "/assets/icons/google-icon.svg",
  },
];

const GoogleLoginProvider = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Fetch URL parameters
  const pollId = searchParams.get("pollId"); // Get pollId from the query parameters

  const checkIfNewUser = async (uid: string) => {
    const userDoc = doc(db, "users", uid);
    const userRef = await getDoc(userDoc);
    console.log("Checking if user exists in Firestore:", userRef.exists());
    return userRef;
  };

  const createNewUser = async (user: any) => {
    const userDoc = doc(db, "users", user.uid);
    await setDoc(userDoc, {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      image: user.photoURL,
    });
    console.log("New user created in Firestore:", {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      image: user.photoURL,
    });
  };

  const handleSignin = async (providerName: string) => {
    if (providerName === "google") {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User data after sign-in:", user);

        // Check if user exists in Firestore
        const userRef = await checkIfNewUser(user.uid);

        if (userRef.exists()) {
          console.log("User exists, redirecting...");
        } else {
          await createNewUser(user);
          console.log("New user created, redirecting...");
        }

        if (pollId) {
          router.push(`/adminDashboard/${pollId}`);
        } else {
          router.push("/adminDashboard");
        }
      } catch (error: any) {
        console.error("Error signing in:", error.message);
      }
    }
  };

  return (
    <div>
      {providers.map((item, index) => (
        <CommonButton
          callback={() => handleSignin(item.name)}
          key={index}
          variant="outline"
          className="flex flex-row items-center justify-center gap-4 rounded-md w-full px-4 py-2"
        >
          <Image src={item.icon} height={24} width={24} alt="Google icon" />
          {item.displayName}
        </CommonButton>
      ))}
    </div>
  );
};

export default GoogleLoginProvider;

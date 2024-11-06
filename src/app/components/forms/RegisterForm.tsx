"use client";

import React, { useState } from "react";
import CustomInput from "../inputs/CustomInput";
import CommonButton from "../buttons/CommonButton";
import GoogleLoginProvider from "./GoogleLoginProvider";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/initFirebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<RegisterData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const validateInputs = (): string | null => {
    const { email, password, confirmPassword, name } = data;

    if (!email || !password || !confirmPassword || !name) {
      return "Please fill in all fields";
    }
    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email";
    }
    return null;
  };

  const createUserDocument = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        uid,
        email: data.email,
        name: data.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAdmin: false,
        status: "online",
        lastActive: serverTimestamp(),
        loginTimestamp: Date.now(),
        polls: [],
        image: null,
        settings: {
          emailNotifications: true,
          theme: "light",
          language: "en",
        },
        stats: {
          totalPolls: 0,
          totalVotes: 0,
          totalViews: 0,
        },
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw new Error("Failed to create user profile");
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      // Validate inputs
      const validationError = validateInputs();
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const loadingToast = toast.loading("Creating your account...");

      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Create user document in Firestore
      await createUserDocument(userCredential.user.uid);

      toast.dismiss(loadingToast);
      toast.success("Welcome to PollMate! Your account has been created.");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password registration is not enabled.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Please choose a stronger password.";
      }

      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full items-center justify-center p-6 gap-4">
      <Toaster />
      <div className="w-full max-w-[320px] justify-center items-center flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Welcome to <span className="text-primary">Poll</span>
          <span className="text-secondary">Mate</span>!
        </h1>

        {/* Name Input */}
        <CustomInput
          placeholder="Full Name"
          label="Full Name"
          borderRadius="rounded-md"
          isMaxCharacters={false}
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        {/* Email Input */}
        <CustomInput
          placeholder="Email"
          label="Email"
          borderRadius="rounded-md"
          isMaxCharacters={false}
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        {/* Password Input */}
        <CustomInput
          placeholder="Password"
          label="Password"
          borderRadius="rounded-md"
          isMaxCharacters={false}
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const nextInput = e.currentTarget.nextSibling as HTMLInputElement;
              if (nextInput) nextInput.focus();
            }
          }}
        />

        {/* Confirm Password Input */}
        <CustomInput
          placeholder="Confirm Password"
          label="Confirm Password"
          borderRadius="rounded-md"
          isMaxCharacters={false}
          type="password"
          value={data.confirmPassword}
          onChange={(e) =>
            setData({ ...data, confirmPassword: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleRegister();
            }
          }}
        />
      </div>

      <div className="w-full max-w-[320px] justify-center items-center flex flex-col gap-1">
        <CommonButton loading={loading} callback={handleRegister}>
          Register
        </CommonButton>
        <p className="text-sm text-gray-500">----------or----------</p>
        <GoogleLoginProvider />
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link className="text-blue-500" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;

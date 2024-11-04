"use client";
import React, { useState } from "react";
import CustomInput from "../inputs/CustomInput";
import CommonButton from "../buttons/CommonButton";
import Link from "next/link";
import GoogleLoginProvider from "./GoogleLoginProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { auth } from "@/firebase/initFirebase";
import { useRouter } from "next/navigation";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const handleLogin = async () => {
    setLoading(true);
    const { email, password } = data;
    if (!email || !password) {
      toast.error("Please enter email and password");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      setLoading(false);
      return;
    }

    const loadingToastId = toast.loading("Logging in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! You've successfully logged in.");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error.message);
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      toast.dismiss(loadingToastId);
    }
  };

  return (
    <div className="w-full flex flex-col h-full items-center justify-center p-6 gap-4">
      <Toaster />
      <div className="w-full max-w-[320px] justify-center items-center flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Welcome Back to <span className="text-primary">Poll</span>
          <span className="text-secondary">Mate</span>!
        </h1>
        <CustomInput
          placeholder="Email"
          label="Email"
          borderRadius="rounded-md"
          isMaxCharacters={false}
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <CustomInput
          placeholder="Password"
          label="Password"
          borderRadius="rounded-md"
          isMaxCharacters={false}
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </div>
      <div className="w-full max-w-[320px] justify-center items-center flex flex-col gap-1">
        <CommonButton loading={loading} callback={handleLogin}>
          Login
        </CommonButton>
        <p className="text-sm text-gray-500">----------or----------</p>
        <GoogleLoginProvider />
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link className="text-blue-500" href="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;

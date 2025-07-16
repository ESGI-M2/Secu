"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authContext } from "@/context/authContext";
import api from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const { setUser } = useContext(authContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const result = await api.post("/auth/login", {
        email,
        password,
      });
      console.log("Réponse backend (succès):", result);
      const msg = result.data?.message || "";
      // Redirection immédiate si 2FA requis (insensible à la casse), AVANT le test du status
      if (msg.toLowerCase().includes("code") && msg.toLowerCase().includes("connexion")) {
        router.push(`/2fa?email=${encodeURIComponent(email as string)}`);
        setLoading(false);
        return;
      }
      if (result.status !== 200) {
        setError(msg || "Login failed");
        setLoading(false);
        return;
      }
      window.localStorage.setItem("token", result.data.access_token);
      document.cookie = `jwt=${result.data.access_token}; path=/; max-age=3600; SameSite=Strict`;
      window.localStorage.setItem("user", JSON.stringify(result.data.user));
      setUser(result.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      // On log l'erreur pour debug
      console.log("Réponse backend (erreur):", err);
      const msg = err.response?.data?.message || err.message || "Login failed";
      if (msg.toLowerCase().includes("code") && msg.toLowerCase().includes("connexion")) {
        router.push(`/2fa?email=${encodeURIComponent(email as string)}`);
        setLoading(false);
        return;
      }
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center mx-auto">
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <span>Pas encore de compte? </span>
          &nbsp;
          <Link href="/register" className="text-blue-500 font-bold">
            Inscrivez vous
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

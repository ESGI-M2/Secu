"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

export default function TwoFAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api.post("/auth/2fa/verify", { email, code: code.trim() });
      // Succès si status 2xx ou si access_token présent
      if ((result.status >= 200 && result.status < 300) && result.data.access_token) {
        window.localStorage.setItem("token", result.data.access_token);
        document.cookie = `jwt=${result.data.access_token}; path=/; max-age=3600; SameSite=Strict`;
        router.push("/users");
        return;
      }
      // Si jamais le backend renvoie access_token même avec un autre status
      if (result.data.access_token) {
        window.localStorage.setItem("token", result.data.access_token);
        document.cookie = `jwt=${result.data.access_token}; path=/; max-age=3600; SameSite=Strict`;
        router.push("/users");
        return;
      }
      setError(result.data?.message || "Erreur lors de la vérification");
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erreur inconnue");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center mx-auto">
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle>Vérification 2FA</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code reçu par email</Label>
              <Input
                type="text"
                name="code"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              Vérifier
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
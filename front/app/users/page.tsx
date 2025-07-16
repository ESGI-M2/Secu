"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get("/users")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message || "Erreur lors du chargement des utilisateurs");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    document.cookie = "jwt=; path=/; max-age=0;";
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-8">
      <div className="w-full max-w-3xl flex justify-end mb-2">
        <Button onClick={handleLogout} variant="outline" className="mt-2">Logout</Button>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-blue-800 text-center drop-shadow">Liste des utilisateurs</h1>
      <Card className="w-full max-w-3xl shadow-xl">
        <CardContent>
          {loading && <div className="text-center py-8">Chargement...</div>}
          {error && <div className="text-red-500 text-center py-8">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Rôle</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((user, idx) => (
                    <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50 hover:bg-blue-100 transition"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-block px-2 py-1 rounded bg-blue-200 text-blue-800 font-semibold text-xs">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
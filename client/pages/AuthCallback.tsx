import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initializeAuth } from "@/lib/auth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    void initializeAuth().finally(() => navigate(params.get("next") || "/account", { replace: true }));
  }, [navigate, params]);

  return <main className="flex min-h-screen items-center justify-center bg-[#F9F5F1] text-sm text-stone-600">Completing your secure sign in…</main>;
};

export default AuthCallback;

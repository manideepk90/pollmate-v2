import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/app/utils/auth";

export default function withAdminAuth(WrappedComponent: React.ComponentType) {
  return function WithAdminAuthWrapper(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const { isAuthorized, redirectTo } = await checkAdminAccess();
        
        if (!isAuthorized && redirectTo) {
          router.push(redirectTo);
          return;
        }
        
        setIsAuthorized(isAuthorized);
        setLoading(false);
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return (
        <div className="w-full h-screen grid place-items-center">
          <div className="loader"></div>
        </div>
      );
    }

    if (!isAuthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 
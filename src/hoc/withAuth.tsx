import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/initFirebase";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          setIsRedirecting(true);
          // Wait for 3 seconds before redirecting
          setTimeout(() => {
            const returnUrl = encodeURIComponent(pathname);
            router.push(`/login?returnUrl=${returnUrl}`);
          }, 3000);
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [router, pathname]);

    if (isRedirecting) {
      return (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(128, 128, 128, 0.8)", // Grey background with some transparency
            padding: "20px",
            borderRadius: "8px",
            color: "white",
            textAlign: "center",
          }}
        >
          Redirecting to login page...
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;

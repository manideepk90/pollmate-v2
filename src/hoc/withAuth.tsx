import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [redirectMessage, setRedirectMessage] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setRedirectMessage("Redirecting to login page...");
          setIsRedirecting(true);
          setTimeout(() => {
            const returnUrl = encodeURIComponent(pathname);
            router.push(`/login?returnUrl=${returnUrl}`);
          }, 3000);
        } else {
          // Check if user is blocked
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            
            if (userData?.isBlocked && pathname !== '/blocked') {
              setRedirectMessage("Account is blocked. Redirecting...");
              setIsRedirecting(true);
              setTimeout(() => {
                router.push('/blocked');
              }, 1500);
            }
          } catch (error) {
            console.error("Error checking user status:", error);
          }
        }
      });

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
            backgroundColor: "rgba(128, 128, 128, 0.8)",
            padding: "20px",
            borderRadius: "8px",
            color: "white",
            textAlign: "center",
          }}
        >
          {redirectMessage}
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;

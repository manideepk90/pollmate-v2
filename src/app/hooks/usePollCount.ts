import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";

export function usePollCount(userId: string) {
  const [pollsCount, setPollsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pollsViewsCount, setPollsViewsCount] = useState<number>(0);
  useEffect(() => {
    const fetchPollCount = async () => {
      try {
        const pollsRef = collection(db, "polls");
        const q = query(pollsRef, where("createdBy", "==", userId));
        const querySnapshot = await getDocs(q);
        setPollsCount(querySnapshot.size);

        // Calculate total views from all polls
        let totalViews = 0;
        querySnapshot.docs.forEach((doc) => {
          const pollData = doc.data();
          totalViews += pollData.views || 0;
        });
        setPollsViewsCount(totalViews);
      } catch (err) {
        console.error("Error fetching poll count:", err);
        setError("Failed to fetch poll count");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPollCount();
    }
  }, [userId]);

  return { pollsCount, loading, error, pollsViewsCount };
}

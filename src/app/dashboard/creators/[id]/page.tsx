"use client";
import CommonButton from "@/app/components/buttons/CommonButton";
import Link from "next/link";
import CustomChart from "@/app/components/Chart/CustomChart";
import React, { useEffect, useState } from "react";
import DashboardPollItemWithBlock from "@/app/components/dashboard/DashboardPollItemWithBlock";
import DashboardUserReport from "@/app/components/dashboard/dashboardUserReport";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function Page() {
  const { id } = useParams();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleBlockUser = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const userRef = doc(db, "users", id as string);

      await updateDoc(userRef, {
        isBlocked: !user?.isBlocked,
      });

      setIsBlocked(!user?.isBlocked);
      toast.success(
        `User ${user?.isBlocked ? "unblocked" : "blocked"} successfully`
      );
      fetchUserData();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUserData = async () => {
    try {
      // Fetch user polls
      const userRef = doc(db, "users", id as string);
      const userSnapshot = await getDoc(userRef);
      setUser(userSnapshot.data());

      const pollsRef = collection(db, "polls");
      const pollsQuery = query(pollsRef, where("createdBy", "==", id));
      const pollsSnapshot = await getDocs(pollsQuery);
      const pollsData = pollsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Poll[];
      setPolls(pollsData);

      // Fetch user reports
      const reportsRef = collection(db, "pollReports");
      const reportsQuery = query(
        reportsRef,
        where(
          "pollUid",
          "in",
          pollsData.map((poll) => poll.uid)
        )
      );
      const reportsSnapshot = await getDocs(reportsQuery);
      const reportsData = reportsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        poll: pollsData.find((poll) => poll.uid === doc.data().pollUid),
      }));
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full grid place-items-center">Loading...</div>
    );
  }

  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-10">
      {/* <h1 className="text-primary text-3xl font-bold text-center">
        User Analytics
      </h1> */}
      <Toaster />

      <div className="w-full h-full flex justify-end">
        <CommonButton callback={handleBlockUser}>
          {user?.isBlocked ? "Unblock User" : "Block User"}
        </CommonButton>
      </div>

      <h3 className="text-primary text-2xl font-bold text-center py-6">
        User polls
      </h3>
      <div className="w-full h-full flex gap-4 flex-col">
        {polls.map((poll) => (
          <DashboardPollItemWithBlock key={poll.id} poll={poll} />
        ))}
      </div>
      <h3 className="text-primary text-2xl font-bold text-center py-6">
        User reports
      </h3>
      <div className="w-full h-full flex gap-4 flex-col">
        {reports.map((report) => (
          <DashboardUserReport key={report.createdAt} report={report} />
        ))}
      </div>
    </section>
  );
}

export default Page;

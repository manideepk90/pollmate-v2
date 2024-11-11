"use client";
import React, { useEffect, useState } from "react";
import CustomChart from "@/app/components/Chart/CustomChart";
import CommonButton from "@/app/components/buttons/CommonButton";
import { Dialog } from "@/app/components/common/Dialog";
import CustomInput from "@/app/components/inputs/CustomInput";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { formatDate } from "@/app/utils/dateUtils";
import { formatNumber } from "@/app/utils/numberUtils";
import ShareModal from "@/app/components/Share/ShareModal";
import { FaBan } from "react-icons/fa";

interface Ad {
  id: string;
  title: string;
  description: string;
  redirectLink: string;
  image: string;
  maxViews: number;
  currentViews: number;
  clicks: number;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  createdBy: string;
  type: string;
}

interface LimitHistory {
  id: string;
  adId: string;
  previousLimit: number;
  newLimit: number;
  changedAt: string;
  changedBy: string;
  reason?: string;
}

function AdAnalyticsPage() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [newLimit, setNewLimit] = useState("");
  const [limitReason, setLimitReason] = useState("");
  const [limitHistory, setLimitHistory] = useState<LimitHistory[]>([]);
  const params = useParams();
  const adId = params.adId as string;

  const fetchAd = async () => {
    try {
      setLoading(true);
      const adDoc = await getDoc(doc(db, "ads", adId));
      if (adDoc.exists()) {
        setAd({ id: adDoc.id, ...adDoc.data() } as Ad);
        await fetchLimitHistory();
      } else {
        toast.error("Ad not found");
      }
    } catch (error) {
      console.error("Error fetching ad:", error);
      toast.error("Failed to load ad data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLimitHistory = async () => {
    try {
      const historyRef = collection(db, "adLimitHistory");
      const q = query(historyRef, orderBy("changedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LimitHistory[];
      setLimitHistory(history);
    } catch (error) {
      console.error("Error fetching limit history:", error);
      toast.error("Failed to load limit history");
    }
  };

  useEffect(() => {
    if (adId) {
      fetchAd();
    }
  }, [adId]);

  const handleSetLimit = async () => {
    if (!ad || !newLimit || isNaN(Number(newLimit))) {
      toast.error("Please enter a valid limit");
      return;
    }

    try {
      const newMaxViews = Number(newLimit);

      // Add to history
      await addDoc(collection(db, "adLimitHistory"), {
        adId: ad.id,
        previousLimit: ad.maxViews,
        newLimit: newMaxViews,
        changedAt: new Date().toISOString(),
        changedBy: "admin", // Replace with actual user ID
        reason: limitReason,
      });

      // Update ad
      await updateDoc(doc(db, "ads", adId), {
        maxViews: newMaxViews,
      });

      setAd({ ...ad, maxViews: newMaxViews });
      await fetchLimitHistory();
      toast.success("Ad limit updated successfully");
      setShowLimitDialog(false);
      setNewLimit("");
      setLimitReason("");
    } catch (error) {
      console.error("Error updating limit:", error);
      toast.error("Failed to update ad limit");
    }
  };

  const handleToggleBlock = async () => {
    if (!ad) return;
    try {
      await updateDoc(doc(db, "ads", adId), {
        isBlocked: !ad.isBlocked,
      });
      setAd({ ...ad, isBlocked: !ad.isBlocked });
      toast.success(
        `Ad ${ad.isBlocked ? "unblocked" : "blocked"} successfully`
      );
    } catch (error) {
      console.error("Error toggling block status:", error);
      toast.error("Failed to update ad status");
    }
  };

  const exportToCSV = () => {
    if (!ad) return;
    const adData = [
      ["Ad Details", ""],
      ["Title", ad.title],
      ["Description", ad.description],
      ["Redirect Link", ad.redirectLink],
      ["Current Views", ad.currentViews],
      ["Max Views", ad.maxViews],
      ["Clicks", ad.clicks],
      ["Status", ad.isBlocked ? "Blocked" : "Active"],
      ["Created At", formatDate(ad.createdAt)],
      ["", ""],
      ["Limit History", ""],
      ["Date", "Previous Limit", "New Limit", "Reason"],
      ...limitHistory.map((history) => [
        formatDate(history.changedAt),
        history.previousLimit,
        history.newLimit,
        history.reason || "No reason provided",
      ]),
    ];

    const csvContent = adData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ad_analytics_${ad.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="w-full h-full grid place-items-center">Loading...</div>
    );
  }

  if (!ad) {
    return <div className="text-center text-red-500">Ad not found</div>;
  }

  const chartData = [
    { name: "Views", value: ad.currentViews },
    { name: "Clicks", value: ad.clicks },
  ];

  return (
    <section className="w-full h-full flex flex-col justify-center gap-4 py-10 px-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-primary text-3xl font-bold">Ad Analytics</h1>
        <CommonButton
          variant="outline"
          style={{
            color: ad.isBlocked ? "green" : "red",
            borderColor: ad.isBlocked ? "green" : "red",
          }}
          callback={handleToggleBlock}
        >
          <FaBan className="mr-2" />
          {ad.isBlocked ? "Unblock Ad" : "Block Ad"}
        </CommonButton>
      </div>

      {/* <div className="w-full min-h-[300px] bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <CustomChart data={chartData} />
      </div> */}

      <div className="w-full h-full flex gap-4 flex-col p-10 bg-white rounded-lg">
        <div className="w-full h-full flex gap-4 flex-col">
          <div className="w-full h-full flex gap-4 flex-col md:flex-row">
            <div className="w-full h-full flex gap-4 flex-col">
              <h3 className="text-primary text-2xl font-bold">{ad.title}</h3>
              <p className="text-gray-600">{ad.description}</p>
              <p className="text-primary text-md">
                {formatNumber(ad.currentViews)}/{formatNumber(ad.maxViews)}{" "}
                views
              </p>
              <p className="text-primary text-md">
                {formatNumber(ad.clicks)} clicks
              </p>
              <p className="text-primary text-md">
                Status: {ad.isActive ? "Active" : "Inactive"}
              </p>
              <p className="text-primary text-md">
                Created: {formatDate(ad.createdAt)}
              </p>
              <a
                href={ad.redirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {ad.redirectLink}
              </a>
            </div>
            {ad.image && (
              <div className="w-full max-w-md">
                <Image
                  src={ad.image}
                  alt={ad.title}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Limit History Section */}
      <div className="w-full bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-primary text-xl font-bold mb-4">Limit History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-4">Date</th>
                <th className="p-4">Previous Limit</th>
                <th className="p-4">New Limit</th>
                <th className="p-4">Reason</th>
              </tr>
            </thead>
            <tbody>
              {limitHistory.map((history) => (
                <tr key={history.id} className="border-b">
                  <td className="p-4">{formatDate(history.changedAt)}</td>
                  <td className="p-4">{formatNumber(history.previousLimit)}</td>
                  <td className="p-4">{formatNumber(history.newLimit)}</td>
                  <td className="p-4">
                    {history.reason || "No reason provided"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full h-full flex gap-4 justify-center">
        <CommonButton
          style={{ padding: "10px 26px", borderRadius: "10px" }}
          className="text-primary"
          callback={() => setShowLimitDialog(true)}
        >
          Set Ad Limit
        </CommonButton>
        <CommonButton
          style={{ padding: "10px 26px", borderRadius: "10px" }}
          className="text-primary"
          callback={exportToCSV}
        >
          Download CSV
        </CommonButton>
        <CommonButton
          style={{ padding: "10px 26px", borderRadius: "10px" }}
          className="text-primary"
          callback={() => setShowShareModal(true)}
        >
          Share Ad
        </CommonButton>
      </div>

      {/* Set Limit Dialog */}
      <Dialog
        isOpen={showLimitDialog}
        onClose={() => {
          setShowLimitDialog(false);
          setNewLimit("");
          setLimitReason("");
        }}
        title="Set Ad View Limit"
      >
        <div className="flex flex-col gap-4 p-4">
          <CustomInput
            label="New View Limit"
            type="number"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            placeholder="Enter new view limit"
          />
          <CustomInput
            label="Reason for Change"
            value={limitReason}
            onChange={(e) => setLimitReason(e.target.value)}
            placeholder="Enter reason for changing limit"
            multiline
          />
          <div className="flex justify-end gap-4">
            <CommonButton
              variant="outline"
              callback={() => setShowLimitDialog(false)}
            >
              Cancel
            </CommonButton>
            <CommonButton callback={handleSetLimit}>Set Limit</CommonButton>
          </div>
        </div>
      </Dialog>
    </section>
  );
}

export default AdAnalyticsPage;

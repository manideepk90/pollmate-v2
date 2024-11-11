import Link from "next/link";
import React, { useState } from "react";
import CommonButton from "../buttons/CommonButton";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import { exportPollToCSV } from "@/app/utils/exportUtils";
import { Dialog } from "../common/Dialog";

interface Report {
  id: string;
  poll: Poll;
  description?: string;
  email: string;
  count?: number;
}

function DashboardUserReport({ report }: { report: Report }) {
  const poll = report?.poll;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + (option.votes || 0),
    0
  );

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsShareModalOpen(true);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!poll) return;

    const sortedOptions = [...poll.options].sort(
      (a, b) => (b.votes || 0) - (a.votes || 0)
    );
    exportPollToCSV(poll, sortedOptions, totalVotes);
  };

  const handleBlock = async () => {
    try {
      const pollRef = doc(db, "polls", poll.id || "");
      await updateDoc(pollRef, {
        isBlocked: !poll.isBlocked,
        blockedAt: new Date().toISOString(),
      });
      setOpenDialog(false);
      toast.success(
        `${poll.isBlocked ? "Unblocked" : "Blocked"} poll successfully`
      );
    } catch (error) {
      toast.error(`Error ${poll.isBlocked ? "unblocking" : "blocking"} poll`);
      console.error("Error blocking poll:", error);
    }
  };

  return (
    <div
      style={{ background: "var(--linear)", borderRadius: "10px" }}
      className="w-full h-full border p-[1px]"
    >
      <div
        style={{ borderRadius: "8px" }}
        className="w-full h-full flex gap-4 border-gray-200 bg-white p-3 items-center justify-between md:flex-nowrap flex-wrap"
      >
        <div className="">
          <Link href={`/polls/${poll?.public_link}`}>
            <h4 className="text-primary cursor-pointer font-bold text-2xl">
              {poll?.title}
              <span className="text-sm text-red-500 ml-2">
                {report.count || 1} reports
              </span>
            </h4>
          </Link>
          <p className="text-sm text-gray-500">{poll?.description}</p>
        </div>
        <div className="flex md:flex-col gap-2 items-end md:items-start">
          <p className="text-md text-primary text-end">
            {report?.description || "Not suitable for audience"}
          </p>
          <p className="text-sm text-gray-500">Reported by: {report?.email}</p>
        </div>
        <div className="flex gap-6 justify-center">
          <div className="flex md:flex-col flex-row gap-2 items-center justify-center">
            <Link href={`/dashboard/polls/${poll?.public_link}`}>
              <CommonButton>view poll</CommonButton>
            </Link>
            <CommonButton
              variant="outline"
              className="px-4 py-1 border-red-500 text-red-500 hover:bg-red-500 rounded-md hover:text-white"
              callback={() => setOpenDialog(true)}
            >
              {poll.isBlocked ? "Unblock" : "Block"} poll
            </CommonButton>
          </div>
          <div className=" flex md:justify-end justify-between flex-row gap-4">
            <Image
              src="/assets/icons/share.svg"
              alt="share"
              width={20}
              height={20}
              onClick={handleShare}
            />
            {/* <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={20}
                  height={20}
                /> */}
            <Image
              src="/assets/icons/download.svg"
              alt="download"
              width={20}
              height={20}
              onClick={handleDownload}
            />
            {/* <Image
                  src="/assets/icons/delete.svg"
                  alt="delete"
                  width={20}
                  height={20}
                /> */}
          </div>
        </div>
      </div>

      <Dialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        title={`Confirm ${poll.isBlocked ? "Unblock" : "Block"}`}
      >
        <div className="flex flex-col gap-4 p-4">
          <p className="text-primary text-lg">
            Are you sure you want to {poll.isBlocked ? "unblock" : "block"} this
            poll?
          </p>
          <div className="flex gap-4 justify-end">
            <CommonButton callback={() => setOpenDialog(false)}>
              Cancel
            </CommonButton>
            <CommonButton
              callback={handleBlock}
              variant="outline"
              className="text-red-500 border-red-500 rounded-md 
              px-4 py-1 hover:bg-red-500 hover:text-white"
            >
              {poll.isBlocked ? "Unblock" : "Block"}
            </CommonButton>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default DashboardUserReport;

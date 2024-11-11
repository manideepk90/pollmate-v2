"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PollOptionItem from "./PollOption";
import CommonButton from "../buttons/CommonButton";
import { formatDate } from "@/app/utils/dateUtils";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getPoll, votePoll, updatePollViews } from "@/app/utils/polls";
import { getLocalStorage, setLocalStorage } from "@/app/utils/localStorage";
import toast, { Toaster } from "react-hot-toast";
import ShareModal from "../Share/ShareModal";
import ReportModal from "../forms/ReportModal";
import { FaBan } from "react-icons/fa";

function PollDetails() {
  const { id: link } = useParams();
  const [poll, setPoll] = useState<Poll | undefined>(undefined);
  const [voted, setVoted] = useState<string | null>(null);
  const router = useRouter();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await getPoll(link as string);
        setPoll(pollData);

        // Check if user has viewed this poll before
        const viewKey = `poll_view_${link}`;
        const hasViewedBefore = getLocalStorage(viewKey);

        if (!hasViewedBefore) {
          // Update view count in Firestore
          await updatePollViews(link as string);
          // Mark as viewed in localStorage
          setLocalStorage(viewKey, "true");
        }
      } catch (error) {
        toast.error("No poll found");
        setTimeout(() => {
          router.push("/404");
        }, 1000);
      }
    };

    fetchPoll();
  }, [link]);

  useEffect(() => {
    const voteKey = `poll_vote_${link}`;
    const previousVote = getLocalStorage(voteKey);
    if (previousVote) {
      setVoted(JSON.parse(previousVote).value);
    }
  }, [link]);

  const handleVote = async (value: string) => {
    try {
      const voteKey = `poll_vote_${link}`;
      const previousVote = getLocalStorage(voteKey);

      if (previousVote && JSON.parse(previousVote).value === value) {
        toast.error("You have already voted for this option");
        return;
      }

      toast.loading("Submitting vote...");
      const result = await votePoll(
        poll?.public_link as string,
        value,
        previousVote ? JSON.parse(previousVote).value : null
      );

      if (result) {
        setPoll(result as Poll);
        toast.dismiss();
        toast.success("Vote submitted successfully");

        // Store vote in localStorage
        setLocalStorage(
          voteKey,
          JSON.stringify({
            value,
            timestamp: new Date().getTime(),
          })
        );
        setVoted(value);
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.dismiss();
      toast.error("Failed to submit vote");
    }
  };

  const handleReportClick = () => {
    const existingReports = getLocalStorage(`poll_report_${link}`);
    if (existingReports) {
      toast.error("You have already reported this poll");
      return;
    }

    setIsReportModalOpen(true);
  };

  useEffect(() => {
    if (poll?.isBlocked) {
      toast.error("This poll is blocked");
      // setTimeout(() => {
      //   router.push("/404");
      // }, 3000);
    }
  }, [poll?.isBlocked]);

  return !poll?.isBlocked ? (
    <div
      style={{
        minWidth: "200px",
      }}
      className="flex-1 flex flex-col gap-5 items-center p-6"
    >
      <Toaster />
      <div className="flex items-center justify-center w-full gap-5">
        <h2 className="text-3xl text-center font-bold text-primary">
          {poll?.title}
        </h2>
        {poll?.isBlocked && (
          <div className="flex items-center gap-1">
            <FaBan className="text-red-500" />
            <p className="text-sm text-red-500 self-end"> Blocked</p>
          </div>
        )}
      </div>

      <p className="text-md text-slate-500 text-center">{poll?.description}</p>
      <div className="flex items-center justify-center w-full gap-5 p-2">
        <div
          onClick={handleShareClick}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
        >
          <Image
            src={"/assets/icons/share.svg"}
            alt="poll"
            className="cursor-pointer"
            width={24}
            height={24}
          />
        </div>
        <div
          onClick={handleReportClick}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
        >
          <Image
            src={"/assets/icons/report.svg"}
            alt="poll"
            width={24}
            height={24}
          />
        </div>
      </div>
      {poll?.image && (
        <div className="flex items-center justify-center w-full h-56 gap-5 relative border overflow-hidden border-slate-500 rounded-xl">
          <Image
            src={poll?.image}
            alt="poll"
            title="poll"
            fill
            style={{
              objectFit: "contain",
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
      <div className="flex items-center justify-center w-full gap-5">
        {poll?.updatedAt ? (
          <p className="text-sm text-slate-500">
            Updated at {formatDate(poll.updatedAt) || "N/A"}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Created at {formatDate(poll?.createdAt || "") || "N/A"}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-5">
        {poll &&
          poll?.options &&
          poll?.options?.length > 0 &&
          poll?.options.map((option, index) => (
            <PollOptionItem
              key={index}
              option={option}
              active={option.value === voted}
              callback={handleVote}
            />
          ))}
      </div>
      <div className="flex items-center justify-center w-full gap-5">
        <h6 className="text-primary text-xl font-bold">Total votes</h6>
        <p className="text-primary text-xl font-bold">
          {poll && poll?.options && poll?.options?.length > 0
            ? poll?.options.reduce((acc, curr) => acc + curr.votes, 0)
            : 0}
        </p>
      </div>
      <div className="flex items-center justify-center w-full gap-5">
        <CommonButton callback={handleShareClick}>Share </CommonButton>
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        poll={poll}
        onClose={() => setIsShareModalOpen(false)}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        pollId={poll?.public_link as string}
        pollUid={poll?.uid as string}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  ) : (
    <div className="flex-1 flex flex-col gap-5 items-center p-6">
      <Toaster />
      <h1 className="text-primary text-3xl font-bold">This poll is blocked</h1>
      <p className="text-primary text-md text-center">
        Please contact the administrator to unblock this poll
      </p>
      <CommonButton callback={() => router.push("/")}>Go to home</CommonButton>
    </div>
  );
}

export default PollDetails;

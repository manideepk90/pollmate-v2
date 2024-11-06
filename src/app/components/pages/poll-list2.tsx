"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { formatNumber } from "@/app/utils/numberUtils";
import { deletePoll } from "@/app/utils/polls";
import { ConfirmDialog } from "@/app/components/common/ConfirmDialog";
import { toast } from "react-hot-toast";

interface PollListItemProps {
  poll?: Poll;
  onPollDeleted?: (pollId: string) => void;
}

import { exportPollToCSV } from "@/app/utils/exportUtils";

function PollListItem({ poll, onPollDeleted }: PollListItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { topOptions, othersVotes, totalVotes } = useMemo(() => {
    if (!poll?.options?.length) {
      return { topOptions: [], othersVotes: 0, totalVotes: 0 };
    }

    // Sort options by votes in descending order
    const sortedOptions = [...poll.options].sort(
      (a, b) => (b.votes || 0) - (a.votes || 0)
    );

    // Get top 2 options
    const top2Options = sortedOptions.slice(0, 2);

    // Calculate others' votes
    const othersVotes = sortedOptions
      .slice(2)
      .reduce((sum, opt) => sum + (opt.votes || 0), 0);

    // Calculate total votes
    const totalVotes = sortedOptions.reduce(
      (sum, opt) => sum + (opt.votes || 0),
      0
    );

    return {
      topOptions: top2Options,
      othersVotes,
      totalVotes,
    };
  }, [poll?.options]);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!poll) return;

    // Use the same sorted options we already calculated in useMemo
    exportPollToCSV(poll, topOptions.concat(poll.options.slice(2)), totalVotes);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!poll?.id || isDeleting) return;

    setIsDeleting(true);
    const result = await deletePoll(poll.id);

    if (result.success) {
      toast.success("Poll deleted successfully");
      onPollDeleted?.(poll.id); // This will trigger the refresh
    } else {
      toast.error(result.error || "Failed to delete poll");
    }

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div
      style={{ background: "var(--linear)", padding: "1px" }}
      className="w-full rounded-md hover:shadow-md transition-shadow duration-200"
    >
      <div className="w-full h-full rounded-md bg-white p-4 flex gap-4 items-center">
        {/* Title and Description */}
        <div className="flex-1">
          <Link href={`/polls/my-polls/${poll?.public_link}`}>
            <h4 className="text-primary cursor-pointer font-semibold hover:underline">
              {poll?.title}
            </h4>
          </Link>
          <p className="text-sm text-gray-500 mt-1">{poll?.description}</p>
        </div>

        {/* Votes Distribution */}
        <div className="flex-1">
          <table
            className="text-sm text-gray-500 w-full"
            style={{ borderSpacing: "10px 15px" }}
          >
            <tbody>
              {topOptions.map((option, index) => (
                <tr key={index}>
                  <td className="text-left">{option.value}</td>
                  <td className="text-right font-medium">
                    {formatNumber(option.votes || 0)}
                  </td>
                </tr>
              ))}
              {othersVotes > 0 && (
                <tr>
                  <td className="text-left">Others</td>
                  <td className="text-right font-medium">
                    {formatNumber(othersVotes)}
                  </td>
                </tr>
              )}
              <tr className="font-semibold text-primary">
                <td className="text-left">Total</td>
                <td className="text-right">{formatNumber(totalVotes)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Views Count */}
        <div className="flex-1">
          <table
            className="text-sm text-gray-500"
            style={{ borderSpacing: "10px 15px" }}
          >
            <tbody>
              <tr>
                <td className="font-medium">
                  {formatNumber(poll?.views || 0)}
                </td>
                <td>views</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 flex justify-end">
          <div className="flex md:flex-row flex-col gap-4">
            <button
              className="hover:opacity-70 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                // Handle share logic
              }}
            >
              <Image
                src="/assets/icons/share.svg"
                alt="share"
                width={20}
                height={20}
              />
            </button>
            <Link href={`/polls/${poll?.public_link}/edit`}>
              <Image
                src="/assets/icons/edit.svg"
                alt="edit"
                width={20}
                height={20}
                className="hover:opacity-70 transition-opacity"
              />
            </Link>
            <button
              className="hover:opacity-70 transition-opacity"
              onClick={handleDownload}
            >
              <Image
                src="/assets/icons/download.svg"
                alt="download"
                width={20}
                height={20}
              />
            </button>
            <button
              className="hover:opacity-70 transition-opacity disabled:opacity-50"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Image
                src="/assets/icons/delete.svg"
                alt="delete"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Poll"
        message="Are you sure you want to delete this poll? This action cannot be undone."
      />
    </div>
  );
}

export default PollListItem;

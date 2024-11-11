"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { formatNumber } from "@/app/utils/numberUtils";
import { deletePoll } from "@/app/utils/polls";
import { ConfirmDialog } from "@/app/components/common/ConfirmDialog";
import { toast } from "react-hot-toast";
import { Dialog } from "@/app/components/common/Dialog";
import { updatePollPublicLink } from "@/app/utils/polls";

interface PollListItemProps {
  poll?: Poll;
  onPollUpdated?: (pollId: string) => void;
}

import { exportPollToCSV } from "@/app/utils/exportUtils";
import { useAuth } from "@/app/context/AuthContext";
import ShareModal from "../Share/ShareModal";
import { FaBan } from "react-icons/fa";

function PollListItem({ poll, onPollUpdated }: PollListItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [publicLink, setPublicLink] = useState(poll?.public_link || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user } = useAuth();

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
      onPollUpdated?.(poll.id);
    } else {
      toast.error(result.error || "Failed to delete poll");
    }

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  const handleUpdatePublicLink = async () => {
    if (!poll?.id || isUpdating) return;

    // Basic validation
    const trimmedLink = publicLink.trim();
    if (!trimmedLink) {
      toast.error("Public link cannot be empty");
      return;
    }

    // Format the link
    const formattedLink = trimmedLink
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    setIsUpdating(true);
    try {
      const result = await updatePollPublicLink(poll.id, formattedLink);

      if (result.success) {
        toast.success("Public link updated successfully");
        // Trigger refresh with the updated poll
        onPollUpdated?.(poll.id);
        setIsEditModalOpen(false);
      } else {
        toast.error(result.error || "Failed to update public link");
      }
    } catch (error) {
      toast.error("Failed to update public link");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsShareModalOpen(true);
  };

  return (
    <div
      style={{ background: "var(--linear)", padding: "1px" }}
      className="w-full rounded-md hover:shadow-md transition-shadow duration-200"
    >
      <div className="w-full h-full rounded-md bg-white p-4 flex gap-4 items-center">
        {/* Title and Description */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-2 items-start">
            <Link href={`/polls/my-polls/${poll?.public_link}`}>
              <h4 className="text-primary cursor-pointer font-semibold hover:underline">
                {poll?.title && poll?.title.slice(0, 30)}
                {poll?.title && poll?.title.length > 30 && "..."}
              </h4>
            </Link>
            {poll?.reportCount && (
              <p className="text-sm text-red-500 self-end">
                {poll?.reportCount === 1
                  ? "1 report"
                  : `${poll?.reportCount} reports`}
              </p>
            )}
            {poll?.isBlocked && (
              <div className="flex items-center gap-1">
                <FaBan className="text-red-500" />
                <p className="text-sm text-red-500 self-end"> Blocked</p>
              </div>
            )}
          </div>
          {poll?.description && (
            <p className="text-sm text-gray-500 mt-1">
              {poll?.description && poll?.description.slice(0, 100)}
              {poll?.description && poll?.description.length > 100 && "..."}
            </p>
          )}
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
              onClick={handleShareClick}
            >
              <Image
                src="/assets/icons/share.svg"
                alt="share"
                width={20}
                height={20}
              />
            </button>

            <button
              className="hover:opacity-70 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                setIsEditModalOpen(true);
              }}
            >
              <Image
                src="/assets/icons/edit.svg"
                alt="edit"
                width={20}
                height={20}
                className="hover:opacity-70 transition-opacity"
              />
            </button>
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

      <Dialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Public Link"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Link
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={publicLink}
                onChange={(e) => setPublicLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter public link"
                disabled={isUpdating}
              />
              <p className="text-sm text-gray-500">
                This will be the URL for your poll:
                <span className="text-primary">
                  /polls/
                  {publicLink
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "") || "your-link"}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Only letters, numbers, and hyphens are allowed. Spaces will be
                converted to hyphens.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePublicLink}
              disabled={isUpdating || !publicLink.trim()}
              className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/80 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Dialog>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        poll={poll}
      />
    </div>
  );
}

export default PollListItem;

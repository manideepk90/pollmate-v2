import React from "react";
import { Dialog } from "../common/Dialog";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

function ShareModal({
  isOpen,
  onClose,
  poll,
}: {
  isOpen: boolean;
  onClose: () => void;
  poll?: Poll;
}) {
  const { user } = useAuth();

  const handleCopyLink = async () => {
    const shareLink = `${window.location.origin}/polls/${poll?.public_link}${
      user?.uid ? `?sharedBy=${user?.uid}` : ""
    }`;

    if (navigator.share && /mobile|android|ios/i.test(navigator.userAgent)) {
      // Mobile share API
      try {
        await navigator.share({
          title: poll?.title,
          text: `Check out this poll: ${poll?.title}`,
          url: shareLink,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleSocialShare = (platform: string) => {
    const shareLink = `${window.location.origin}/polls/${poll?.public_link}${
      user?.uid ? `?sharedBy=${user?.uid}` : ""
    }`;
    const text = encodeURIComponent(`Check out this poll: ${poll?.title}`);
    const url = encodeURIComponent(shareLink);

    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://web.whatsapp.com/send?text=${text}%20${url}`;
        // For mobile devices, fallback to wa.me
        if (/mobile|android|ios/i.test(navigator.userAgent)) {
          shareUrl = `https://wa.me/?text=${text}%20${url}`;
        }
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
    }

    window.open(shareUrl, "_blank");
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Share Poll">
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={`${window.location.origin}/polls/${poll?.public_link}${
                user?.uid ? `?sharedBy=${user?.uid}` : ""
              }`}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
            >
              Copy
            </button>
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <Link
            href={`${window.location.origin}/polls/${poll?.public_link}${
              user?.uid ? `?sharedBy=${user?.uid}` : ""
            }`}
            target="_blank"
          >
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80">
              open
            </button>
          </Link>
          <button
            onClick={() => handleSocialShare("whatsapp")}
            className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white"
          >
            <FaWhatsapp />
          </button>
          <button
            onClick={() => handleSocialShare("facebook")}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FaFacebook />
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ShareModal;

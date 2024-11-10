"use client";
import React, { useEffect, useState, useCallback } from "react";
import PollItem from "../polls/PollCard";
import "./poll-list.css";
import getPolls from "@/app/utils/polls";
import CommonButton from "../buttons/CommonButton";
import { useParams } from "next/navigation";
function PollList({ isStraight = false }: { isStraight?: boolean }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: link } = useParams();

  const fetchPolls = useCallback(
    async (isInitial: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const { polls: newPolls, newLastVisible } = (await getPolls(
          12,
          isInitial ? null : lastVisible
        )) as {
          polls: Poll[];
          newLastVisible: any;
        };

        // Filter out the current poll if we're on a poll page
        const filteredPolls = newPolls.filter(
          (poll) => poll?.public_link !== link
        );

        setPolls((prev) =>
          isInitial ? filteredPolls : [...prev, ...filteredPolls]
        );
        setLastVisible(newLastVisible);
        setHasMore(newPolls.length === 12);
      } catch (err) {
        setError("Failed to load polls. Please try again later.");
        console.error("Error fetching polls:", err);
      } finally {
        setLoading(false);
      }
    },
    [lastVisible, link]
  );

  useEffect(() => {
    fetchPolls(true);
  }, []);

  if (error) {
    return <div className="w-full text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {polls && polls.length > 0 ? (
        <div
          className="poll-list grid w-full gap-10 justify-center items-center"
          data-isstraight={isStraight}
        >
          {polls.map((poll) => (
            <PollItem key={poll.id || poll.public_link} poll={poll} />
          ))}
        </div>
      ) : !loading ? (
        <div className="w-full font-bold flex justify-center items-center text-gray-500 text-center">
          No polls found
        </div>
      ) : null}

      {hasMore && !loading && (
        <div className="w-full flex justify-center">
          <CommonButton callback={() => fetchPolls(false)} disabled={loading}>
            {loading ? "Loading..." : "Load more"}
          </CommonButton>
        </div>
      )}
    </div>
  );
}

export default PollList;

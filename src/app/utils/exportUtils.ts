import { saveAs } from "file-saver";
import { formatDate } from "./dateUtils";

export const exportPollToCSV = (
  poll: Poll,
  sortedOptions: {
    value: string;
    votes: number;
  }[],
  totalVotes: number
) => {
  // Poll metadata
  const metadata = [
    `Title,${poll.title}`,
    `Description,${poll.description || "N/A"}`,
    `Created By,${poll.createdBy || "Anonymous"}`,
    `Created At,${formatDate(poll.createdAt)}`,
    `Total Views,${poll.views || 0}`,
    `Total Votes,${totalVotes}`,
    "", // Empty line to separate metadata from results
  ];

  // Results headers and data
  const headers = "Rank,Option,Votes,Percentage";
  const rows = sortedOptions.map((option: {
    value: string;
    votes: number;
  }, index: number) => {
    const percentage =
      totalVotes > 0
        ? (((option.votes || 0) / totalVotes) * 100).toFixed(1)
        : "0";
    return `${index + 1},${option.value},${option.votes || 0},${percentage}%`;
  });

  // Combine all content
  const csvContent = [...metadata, headers, ...rows].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${poll.title}_results.csv`);
};

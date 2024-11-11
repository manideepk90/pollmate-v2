"use client";
import React, { useEffect, useMemo, useState } from "react";
import CustomChart from "../Chart/CustomChart";
import Image from "next/image";
import { formatDate } from "@/app/utils/dateUtils";
import { formatNumber } from "@/app/utils/numberUtils";
import { exportPollToCSV } from "@/app/utils/exportUtils";
import AdComponent from "../Ads/AdComponent";
import { getReports } from "@/app/utils/polls";
import CommonButton from "../buttons/CommonButton";
import ShareModal from "../Share/ShareModal";
import { FaBan } from "react-icons/fa";
interface PollAnalyticsProps {
  poll: Poll;
}

interface Report {
  email: string;
  description: string;
}

function PollAnalytics({ poll }: PollAnalyticsProps) {
  const [reports, setReports] = useState<Report[]>([]);

  const [shareModal, setShareModal] = useState(false);
  const { sortedOptions, totalVotes } = useMemo(() => {
    const sorted = [...poll.options].sort(
      (a, b) => (b.votes || 0) - (a.votes || 0)
    );
    const total = sorted.reduce((sum, opt) => sum + (opt.votes || 0), 0);
    return { sortedOptions: sorted, totalVotes: total };
  }, [poll.options]);

  useEffect(() => {
    const fetchReports = async () => {
      const reports = await getReports(poll.uid as string);
      setReports(reports as Report[]);
    };
    fetchReports();
  }, [poll.uid]);

  const chartData = sortedOptions.map((option) => ({
    name: option.value,
    value: option.votes || 0,
  }));

  const handleDownload = () => {
    exportPollToCSV(poll, sortedOptions, totalVotes);
  };

  return (
    <section className="w-full h-full flex flex-col justify-center gap-8 py-10 px-6 max-w-7xl mx-auto">
      <h1 className="text-primary text-3xl font-bold text-center">
        Poll Analytics
      </h1>

      {/* Chart Section */}
      <div className="w-full h-[400px]">
        <CustomChart data={chartData} />
      </div>
      <ShareModal
        poll={poll}
        isOpen={shareModal}
        onClose={() => setShareModal(false)}
      />

      {/* Poll Details */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-primary text-2xl font-bold">{poll.title}</h3>
          {poll.isBlocked && (
            <div className="flex items-center gap-1">
              <FaBan className="text-red-500" />
              <p className="text-sm text-red-500 self-end"> Blocked</p>
            </div>
          )}
          <p className="text-gray-600">{poll.description}</p>
          <CommonButton callback={() => setShareModal(true)}>
            Share poll
          </CommonButton>
          <div className="space-y-2">
            <p className="text-primary">
              <span className="font-bold">{formatNumber(poll.views || 0)}</span>{" "}
              views
            </p>
            <p className="text-primary">
              <span className="font-bold">{formatNumber(totalVotes)}</span>{" "}
              total votes
            </p>
            <p className="text-gray-500 text-sm">
              Created: {formatDate(poll.createdAt)}
            </p>
            {poll.updatedAt && (
              <p className="text-gray-500 text-sm">
                Updated: {formatDate(poll.updatedAt)}
              </p>
            )}
          </div>
        </div>

        {/* Poll Image */}
        {poll.image && (
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src={poll.image}
              alt={poll.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Add this before the table */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Download Results
        </button>
      </div>

      {/* Votes Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-4">Rank</th>
              <th className="p-4">Option</th>
              <th className="p-4">Votes</th>
              <th className="p-4">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {sortedOptions.map((option, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{option.value}</td>
                <td className="p-4">{formatNumber(option.votes || 0)}</td>
                <td className="p-4">
                  {totalVotes > 0
                    ? `${(((option.votes || 0) / totalVotes) * 100).toFixed(
                        1
                      )}%`
                    : "0%"}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="p-4" colSpan={2}>
                Total
              </td>
              <td className="p-4">{formatNumber(totalVotes)}</td>
              <td className="p-4">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdComponent />
      {poll?.reportCount && (
        <div className="flex flex-col gap-2">
          <h3 className="text-primary text-2xl font-bold">Reports</h3>
          <p className="text-gray-600">{poll.reportCount} reports</p>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-4">Reported By</th>
                <th className="p-4">Reason</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{report?.email}</td>
                  <td className="p-4">{report?.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default PollAnalytics;

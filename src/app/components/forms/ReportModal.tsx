import React, { useState } from "react";
import { Dialog } from "../common/Dialog";
import CommonButton from "../buttons/CommonButton";
import CustomInput from "../inputs/CustomInput";
import { toast, Toaster } from "react-hot-toast";
import { reportPoll } from "@/app/utils/polls";

function ReportModal({
  isOpen,
  pollId,
  pollUid,
  onClose,
}: {
  isOpen: boolean;
  pollId: string;
  pollUid: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const handleReport = async () => {
    setLoading(true);
    try {
      const res = await reportPoll(email, description, pollId, pollUid);
      if (res.success) {
        toast.success("Poll reported successfully");
        onClose();
      } else {
        toast.error(res.error || "Failed to report poll");
      }
    } catch (error) {
      toast.error("Failed to report poll");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Report Poll">
      <Toaster />
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <CustomInput
            borderRadius="rounded-md"
            label="Email"
            required
            placeholder="Email"
            isMaxCharacters={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomInput
            borderRadius="rounded-md"
            label="Description"
            required
            multiline
            isMaxCharacters={true}
            placeholder="Enter reason for reporting"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-center gap-5">
          <CommonButton callback={handleReport} loading={loading}>
            Report
          </CommonButton>
        </div>
      </div>
    </Dialog>
  );
}

export default ReportModal;

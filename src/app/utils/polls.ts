import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  increment,
  runTransaction,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import toast from "react-hot-toast";

const getPolls = async (
  limitCount: number,
  lastVisible: Poll | null = null,
  isBlocked: boolean = false
) => {
  const pollsRef = collection(db, "polls");
  let q = query(
    pollsRef,
    where("isBlocked", "==", isBlocked),
    orderBy("createdAt"),
    limit(limitCount)
  );

  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  const querySnapshot = await getDocs(q);
  const polls = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { polls, newLastVisible };
};

export default getPolls;

export const getPoll = async (link: string) => {
  const pollsRef = collection(db, "polls");
  const q = query(pollsRef, where("public_link", "==", link));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data() as Poll;
};

export const updatePollViews = async (link: string) => {
  try {
    const pollsRef = collection(db, "polls");
    const q = query(pollsRef, where("public_link", "==", link));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Poll not found");
    }

    const pollDoc = querySnapshot.docs[0];

    // Use transaction to ensure atomic update
    await runTransaction(db, async (transaction) => {
      const pollSnapshot = await transaction.get(pollDoc.ref);
      if (!pollSnapshot.exists()) {
        throw new Error("Poll not found");
      }

      // Check if view was already counted in this session
      const sessionKey = `poll_view_${link}`;
      if (sessionStorage.getItem(sessionKey)) {
        return; // Skip if already viewed in this session
      }

      transaction.update(pollDoc.ref, {
        views: increment(1),
      });

      // Mark as viewed in this session
      sessionStorage.setItem(sessionKey, "true");
    });
  } catch (error) {
    console.error("Error updating views:", error);
    // Silent fail for view count to not disturb user experience
  }
};
export const deletePoll = async (
  pollId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const pollRef = doc(db, "polls", pollId);
    await deleteDoc(pollRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting poll:", error);
    return {
      success: false,
      error: "Failed to delete poll. Please try again.",
    };
  }
};

export const votePoll = async (
  link: string,
  value: string,
  removeExistingVote: string | null
) => {
  try {
    const pollsRef = collection(db, "polls");
    const q = query(pollsRef, where("public_link", "==", link));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Poll not found");
    }

    const pollDoc = querySnapshot.docs[0];

    // Use transaction to ensure vote count accuracy
    const updatedPoll = await runTransaction(db, async (transaction) => {
      const pollSnapshot = await transaction.get(pollDoc.ref);
      if (!pollSnapshot.exists()) {
        throw new Error("Poll not found");
      }

      const pollData = pollSnapshot.data() as Poll;
      const newOptions = pollData.options.map((option) => {
        const optionValue =
          option.value === value
            ? option.votes + 1
            : option.value === removeExistingVote
            ? option.votes - 1
            : option.votes;
        return {
          ...option,
          votes: optionValue < 0 ? 0 : optionValue,
        };
      });

      const newPollData = {
        ...pollData,
        options: newOptions,
      };

      transaction.update(pollDoc.ref, newPollData);
      return newPollData;
    });

    return updatedPoll;
  } catch (error) {
    console.error("Error voting:", error);
    toast.error("Failed to submit vote");
    return null;
  }
};

export const updatePollPublicLink = async (
  pollId: string,
  newPublicLink: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate the public link format
    if (!newPublicLink.trim()) {
      throw new Error("Public link cannot be empty");
    }

    // Check if the link is already taken
    const pollsRef = collection(db, "polls");
    const q = query(pollsRef, where("public_link", "==", newPublicLink));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty && querySnapshot.docs[0].id !== pollId) {
      throw new Error("This public link is already taken");
    }

    // Update the poll
    const pollRef = doc(db, "polls", pollId);
    await updateDoc(pollRef, {
      public_link: newPublicLink,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating public link:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update public link",
    };
  }
};

export const reportPoll = async (
  email: string,
  description: string,
  pollId: string,
  pollUid: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }

    // Validate other inputs
    if (!description?.trim() || !pollId?.trim()) {
      throw new Error("All fields are required");
    }

    if (description.length > 300) {
      throw new Error("Description cannot be longer than 300 characters");
    }

    // Create a reference to the reports collection
    const reportsRef = collection(db, "pollReports");

    // Check if this email has already reported this poll
    const q = query(
      reportsRef,
      where("email", "==", email),
      where("pollUid", "==", pollUid)
    );
    const existingReports = await getDocs(q);

    if (!existingReports.empty) {
      throw new Error("You have already reported this poll");
    }

    // Add the report document
    await addDoc(reportsRef, {
      pollId,
      pollUid,
      email,
      description,
      status: "pending", // pending, reviewed, resolved
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Optional: Update the poll document to track report count
    const pollRef = collection(db, "polls");
    const q2 = query(
      pollRef,
      pollUid ? where("uid", "==", pollUid) : where("public_link", "==", pollId)
    );
    const querySnapshot = await getDocs(q2);
    const pollDoc = querySnapshot.docs[0];
    if (pollDoc) {
      await updateDoc(pollDoc.ref, {
        reportCount: increment(1),
      });
    }

    toast.success("Report submitted successfully");
    localStorage.setItem(`poll_report_${pollUid}`, "true");
    return { success: true };
  } catch (error) {
    console.error("Error reporting poll:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit report",
    };
  }
};

export const getReports = async (pollId: string) => {
  const reportsRef = collection(db, "pollReports");
  const q = query(reportsRef, where("pollUid", "==", pollId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

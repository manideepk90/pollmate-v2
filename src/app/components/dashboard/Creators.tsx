import React, { useState, useEffect } from "react";
import DashboardUserItem from "./DashboardUserItem";
import CommonButton from "../buttons/CommonButton";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/initFirebase"; // Ensure this path matches your Firebase config

interface Creator {
  id: string;
  name: string;
  image: string;
  followers: number;
  category: string;
  email: string;
  engagement?: number;
  isVerified?: boolean;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

function Creators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        const fetchedCreators: Creator[] = [];
        const uniqueCategories = new Set<string>(["All"]);

        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.category) {
            uniqueCategories.add(userData.category);
          }

          fetchedCreators.push({
            id: doc.id,
            name: userData.name || "Anonymous",
            email: userData.email || "No email provided",
            image: userData.image || "/assets/icons/user.svg",
            followers: userData.followers || 0,
            category: userData.category || "Uncategorized",
            engagement: userData.engagement,
            isVerified: userData.isVerified,
            socialLinks: userData.socialLinks,
          });
        });

        setCategories(Array.from(uniqueCategories));
        setCreators(fetchedCreators);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter creators based on search and category
  const filteredCreators = creators.filter(
    (creator) =>
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory.toLowerCase() === "all" ||
        creator.category.toLowerCase() === selectedCategory.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="w-full h-full flex flex-col gap-6 bg-background p-6 rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-primary text-3xl font-bold">Creators</h1>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-auto pl-10 pr-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20 focus:outline-none focus:border-primary"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === category.toLowerCase()
                    ? "bg-primary text-white"
                    : "bg-secondary/10 hover:bg-secondary/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2  gap-4">
        {filteredCreators.length > 0 ? (
          filteredCreators.map((creator) => (
            <DashboardUserItem key={creator.id} creator={creator} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No creators found matching your criteria
          </div>
        )}
      </div>

      {/* Show more button */}
      {filteredCreators.length > 0 && (
        <div className="w-full flex justify-center mt-4">
          <Link href="/dashboard/creators">
            <CommonButton
              callback={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300"
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                fontWeight: "600",
              }}
            >
              Explore More Creators
            </CommonButton>
          </Link>
        </div>
      )}
    </section>
  );
}

export default Creators;

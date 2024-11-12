import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/initFirebase";
import CommonButton from "../buttons/CommonButton";
import toast from "react-hot-toast";

interface MetaConfig {
  showAds: boolean;
  showInactiveAds: boolean;
}

function MetaConfigSection() {
  const [config, setConfig] = useState<MetaConfig>({
    showAds: true,
    showInactiveAds: false,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMetaConfig = async () => {
      try {
        const metaDoc = await getDoc(doc(db, "meta", "config"));
        if (metaDoc.exists()) {
          setConfig({
            showAds: metaDoc.data().showAds ?? true,
            showInactiveAds: metaDoc.data().showInactiveAds ?? false,
          });
        }
      } catch (error) {
        console.error("Error fetching meta config:", error);
        toast.error("Failed to load configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchMetaConfig();
  }, []);

  const handleToggle = async (key: keyof MetaConfig) => {
    try {
      setUpdating(true);
      const newValue = !config[key];

      const metaConfigRef = doc(db, "meta", "config");
      const metaConfigDoc = await getDoc(metaConfigRef);
      if (metaConfigDoc.exists()) {
        const currentConfig = metaConfigDoc.data() as MetaConfig;
        await updateDoc(metaConfigRef, {
          ...currentConfig,
          [key]: newValue,
        });
      } else {
        await setDoc(metaConfigRef, {
          showAds: true,
          showInactiveAds: false,
        });
      }

      setConfig((prev) => ({
        ...prev,
        [key]: newValue,
      }));

      toast.success("Configuration updated successfully");
    } catch (error) {
      console.error("Error updating config:", error);
      toast.error("Failed to update configuration");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-primary text-xl font-semibold mb-4">
        Ad Display Settings
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Show Ads</h3>
            <p className="text-sm text-gray-500">
              Enable or disable ad display across the platform
            </p>
          </div>
          <CommonButton
            variant={config.showAds ? "primary" : "outline"}
            callback={() => handleToggle("showAds")}
            loading={updating}
          >
            {config.showAds ? "Enabled" : "Disabled"}
          </CommonButton>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Show Inactive Ads</h3>
            <p className="text-sm text-gray-500">
              Include inactive ads in the rotation
            </p>
          </div>
          <CommonButton
            variant={config.showInactiveAds ? "primary" : "outline"}
            callback={() => handleToggle("showInactiveAds")}
            loading={updating}
          >
            {config.showInactiveAds ? "Enabled" : "Disabled"}
          </CommonButton>
        </div>
      </div>
    </div>
  );
}

export default MetaConfigSection;

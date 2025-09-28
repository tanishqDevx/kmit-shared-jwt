"use client";
import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios";

const SITEKEY = "898273e0-27c2-47fa-bf84-7bb23b6432d4";

export default function Home() {
  const [number, setNumber] = useState("");
  const [data, setData] = useState<any>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/get-profile?number=${number}`);
      setData(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) setShowCaptcha(true);
      else console.error(err);
    }
  };

  const handleCaptchaSuccess = async (token: string) => {
    await axios.post("/api/def-token", { captcha: token });
    setShowCaptcha(false);
    fetchProfile();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search Student Profile</h1>
      <input
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Enter student number"
        className="border p-2 m-2 rounded"
      />
      <button
        onClick={fetchProfile}
        className="bg-blue-600 text-white p-2 rounded ml-2"
      >
        Fetch Profile
      </button>

      {showCaptcha && (
        <div className="mt-4">
          <p>Please verify hCaptcha:</p>
          <HCaptcha sitekey={SITEKEY} onVerify={handleCaptchaSuccess} />
        </div>
      )}

      {data && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

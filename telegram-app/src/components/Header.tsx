"use client";
import { Button, Space, message } from "antd";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useTelegramSocket } from "@/hooks/useTelegramSocket";

export default function Header() {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  useTelegramSocket(socketReady);
  const handleLoginWithQR = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/tele/login/", {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch QR");

      const data = await response.json();

      localStorage.setItem("session_id", data.session_id);
      setQrUrl(data.qr_url);
      message.success("QR Code loaded. Please scan with Telegram app.");
      setSocketReady(true);
    } catch (error) {
      console.error(error);
      message.error("Error fetching QR code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-24 space-y-8">
      <h1 className="text-4xl font-medium text-gray-900">
        Sign in to Telegram
      </h1>

      <Space size="middle">
        <Button
          type="default"
          size="large"
          onClick={handleLoginWithQR}
          loading={loading}
        >
          Login with QR
        </Button>

        <Button type="primary" size="large">
          Login with Code
        </Button>
      </Space>

      {qrUrl && (
        <div className="mt-10">
          <QRCodeCanvas value={qrUrl} size={220} className="ml-7" />
          <br></br>
          <p className="mt-4 text-gray-600 text-sm text-center">
            Scan this with your Telegram app to login.
          </p>
        </div>
      )}
    </div>
  );
}

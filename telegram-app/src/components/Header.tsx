'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Space, message } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { useTelegramSocket } from '@/hooks/useTelegramSocket';

export default function Header() {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('is_logged_in');
    if (isLoggedIn === 'true') {
      console.log('Already logged in. Redirecting...');
      router.push('/conversations');
    }
  }, []);

  useTelegramSocket(socketReady, {
    onLoginSuccess: (sessionId) => {
      message.success('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/conversations');
      }, 1000);
    }
  });

  const handleLoginWithQR = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/tele/login/');
      const data = await res.json();
      localStorage.setItem('session_id', data.session_id);
      setQrUrl(data.qr_url);
      setSocketReady(true);
    } catch (err) {
      console.error(err);
      message.error('Failed to get QR code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-24 space-y-8">
      <h1 className="text-4xl font-medium text-gray-900">Sign in to Telegram</h1>
      <Space size="middle">
        <Button type="default" size="large" onClick={handleLoginWithQR} loading={loading}>
          Login with QR
        </Button>
        <Button type="primary" size="large">Login with Code</Button>
      </Space>
      {qrUrl && (
        <div className="mt-10">
          <QRCodeCanvas value={qrUrl} size={220} />
          <p className="text-gray-500 text-sm text-center mt-4">
            Scan this with Telegram to login.
          </p>
        </div>
      )}
    </div>
  );
}

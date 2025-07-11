'use client';
import { Button, Space } from 'antd';

export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center mt-24 space-y-8">
      <h1 className="text-4xl font-medium text-gray-900">
        Sign in to Telegram
      </h1>

      <Space size="middle">
        <Button type="default" size="large">
          Login with QR
        </Button>

        <Button type="primary" size="large">
          Login with Code
        </Button>
      </Space>
    </div>
  );
}

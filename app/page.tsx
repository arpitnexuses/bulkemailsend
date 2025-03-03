import EmailSendTool from "@/components/email-send-tool";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.has('auth');

  if (!isLoggedIn) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="border dark:border-gray-700 rounded-lg p-6 shadow-sm dark:shadow-gray-800">
        <EmailSendTool />
      </div>
    </div>
  );
}


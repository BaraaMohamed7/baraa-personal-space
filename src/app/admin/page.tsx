import type { Metadata } from 'next';
import { isAdmin } from '@/lib/admin-session';
import AdminPanel from '@/components/AdminPanel';
import AdminLogin from '@/components/AdminLogin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title:'Admin · Baraa Personal Space', robots: { index:false, follow:false } };

export default async function AdminPage() {
  return (await isAdmin()) ? <AdminPanel /> : <AdminLogin />;
}

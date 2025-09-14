'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Store,
  Menu
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <Store className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </Link>
      </div>
      
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
            <Badge variant="secondary" className="text-xs">Admin</Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold text-gray-900">Admin</span>
          </Link>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-4 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
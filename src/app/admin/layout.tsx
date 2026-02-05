'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Package,
  FlaskConical,
  Settings,
  Bell,
  User,
  LogOut,
  Factory,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSearch } from '@/components/admin/admin-search';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: LayoutGrid, label: 'Dashboard', exact: true },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/brands', icon: Factory, label: 'Brands' },
    { href: '/admin/lab', icon: FlaskConical, label: 'Lab' },
  ];

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Sidebar */}
      <aside className='w-16 bg-white border-r flex flex-col items-center py-4 gap-6 fixed h-full z-10'>
        <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold'>
          <span className='text-xl'>🐾</span>
        </div>

        <nav className='flex flex-col gap-4 flex-1 w-full items-center'>
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'p-3 rounded-xl transition-colors',
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100',
                )}
                title={item.label}>
                <item.icon size={24} />
              </Link>
            );
          })}
        </nav>

        <div className='mt-auto flex flex-col gap-4 items-center'>
          <Link
            href='/admin/settings'
            className='p-3 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors'>
            <Settings size={24} />
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 ml-16 flex flex-col'>
        {/* Header */}
        <header className='h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            {/* Simple Breadcrumbs */}
            <span>首頁</span>
            <span>›</span>
            <span className='bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium'>
              {pathname === '/admin'
                ? '儀表板'
                : pathname.startsWith('/admin/products')
                  ? '產品管理'
                  : pathname.startsWith('/admin/brands')
                    ? '品牌資料'
                    : pathname.startsWith('/admin/lab')
                      ? '實驗室'
                      : '管理系統'}
            </span>
          </div>

          <div className='flex items-center gap-4'>
            <AdminSearch />

            <Button
              variant='ghost'
              size='icon'
              className='text-gray-400 relative'>
              <Bell size={20} />
              <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full'></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-2 border-l pl-4 cursor-pointer'>
                  <div className='text-right hidden sm:block'>
                    <p className='text-sm font-medium'>系統管理員</p>
                  </div>
                  <div className='h-8 w-8 bg-gray-200 rounded-full overflow-hidden'>
                    <User className='h-full w-full p-1 text-gray-500' />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-48'>
                <DropdownMenuLabel>我的帳號</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  <span>個人資料</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>設定</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-red-600 focus:text-red-600 cursor-pointer'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>登出</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className='p-6'>{children}</main>

        {/* Footer */}
        <footer className='mt-auto px-6 py-4 text-xs text-gray-400 flex items-center justify-between border-t'>
          <div className='flex gap-4'>
            <span>© {new Date().getFullYear()} 寵物食品透明度數據庫</span>
            <span>•</span>
            <span>系統說明文件</span>
            <span>•</span>
            <span>隱私權政策</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-2 h-2 bg-green-500 rounded-full'></span>
            <span>系統狀態：運作正常</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

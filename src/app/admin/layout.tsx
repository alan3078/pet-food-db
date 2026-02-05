'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Package,
  Settings,
  Bell,
  User,
  LogOut,
  Factory,
  ChevronLeft,
  ChevronRight,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/admin', icon: LayoutGrid, label: '總覽', exact: true },
    { href: '/admin/products', icon: Package, label: '產品管理' },
    { href: '/admin/brands', icon: Factory, label: '品牌管理' },
  ];

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Sidebar */}
      <aside 
        className={cn(
          'bg-white border-r flex flex-col transition-all duration-300 fixed h-full z-10',
          isCollapsed ? 'w-16 items-center' : 'w-64'
        )}
      >
        <div className={cn(
          'flex items-center h-16 border-b px-6',
          isCollapsed ? 'justify-center' : 'justify-start gap-3'
        )}>
          <div className={cn(
            'rounded-lg flex items-center justify-center font-bold transition-all bg-blue-50 text-blue-600',
            isCollapsed ? 'w-10 h-10' : 'w-8 h-8'
          )}>
            <span className='text-lg'>🐾</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-gray-900 truncate text-lg">Pet Treat DB</span>
          )}
        </div>

        <nav className='flex flex-col gap-2 p-2 flex-1 w-full'>
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-xl transition-colors',
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
                  isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
                )}
                title={isCollapsed ? item.label : undefined}>
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className='mt-auto flex flex-col p-2 border-t'>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'flex items-center rounded-xl transition-colors text-gray-400 hover:bg-gray-100',
              isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
            )}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!isCollapsed && <span className="font-medium">收合選單</span>}
          </button>
          
          <Link
            href='/admin/settings'
            className={cn(
              'flex items-center rounded-xl transition-colors text-gray-400 hover:bg-gray-100',
              isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
            )}
            title={isCollapsed ? "設定" : undefined}
          >
            <Settings size={24} className="shrink-0" />
            {!isCollapsed && <span className="font-medium">設定</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300',
        isCollapsed ? 'ml-16' : 'ml-64'
      )}>
        {/* Header */}
        <header className='h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            {/* Simple Breadcrumbs */}
            <span>首頁</span>
            <span>›</span>
            <span className='bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium'>
              {pathname === '/admin'
                ? '總覽'
                : pathname.startsWith('/admin/products')
                  ? '產品管理'
                  : pathname.startsWith('/admin/brands')
                    ? '品牌管理'
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

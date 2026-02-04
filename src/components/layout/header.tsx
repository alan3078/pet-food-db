'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PawPrint, User as UserIcon, LogOut, Settings, LayoutGrid, Coffee } from 'lucide-react';
import { type User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LoginModal } from '@/components/auth/login-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 gap-4'>
        <Link
            href='/'
            className='flex items-center gap-2 shrink-0'>
            <PawPrint className='h-6 w-6 text-primary' />
            <span className='text-lg font-bold hidden sm:inline-block'>Pet Food DB</span>
            <span className='text-lg font-bold sm:hidden'>PFDB</span>
          </Link>

        <nav className='hidden items-center gap-6 md:flex shrink-0'>
          <Link
            href='/products'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'>
            產品資料庫
          </Link>
          <Link
            href='/wiki/barcodes'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'>
            條碼百科
          </Link>
          <Link
            href='#'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'>
            關於我們
          </Link>
        </nav>

        <div className='flex items-center gap-2'>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden">
                   <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                     <UserIcon className="h-5 w-5 text-gray-500" />
                   </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">我的帳號</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer w-full flex items-center">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>後台管理</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>個人資料</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>設定</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>登出</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginModal>
              <Button
                variant='ghost'
                size='sm'>
                登入
              </Button>
            </LoginModal>
          )}
          <Button size='sm' className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold gap-2 shadow-sm">
            <Coffee size={16} />
            Buy me a coffee
          </Button>
        </div>
      </div>
    </header>
  );
}

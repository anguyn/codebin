'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/use-current-user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, Heart, LogOut, Code2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { signOut } from '@/lib/server/auth';

interface UserMenuProps {
  locale: string;
}

export function UserMenu({ locale }: UserMenuProps) {
  const { user, isAuthenticated, isLoading } = useCurrentUser();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-secondary h-10 w-10 animate-pulse rounded-full" />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href={`/${locale}/login`}>Sign In</Link>
        </Button>
        <Button asChild>
          <Link href={`/${locale}/register`}>Sign Up</Link>
        </Button>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const initials =
    user?.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" asChild className="p-0">
          <Avatar
            className="bg-muted h-10 w-10 overflow-hidden rounded-full"
            aria-label={user?.name ?? 'User avatar'}
          >
            {user?.image ? (
              <AvatarImage
                src={user.image}
                alt={user.name ?? 'User'}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="flex items-center justify-center">
                {user?.name ? (
                  <span className="text-sm font-medium">{initials}</span>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user?.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div className="cursor-not-allowed">
            {/* <Link href={`/${locale}/profile`} className="cursor-pointer"> */}
            <User className="mr-2 h-4 w-4" />
            Profile
            {/* </Link> */}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/my-snippets`} className="cursor-pointer">
            <Code2 className="mr-2 h-4 w-4" />
            My Snippets
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/favorites`} className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Favorites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div className="cursor-not-allowed">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

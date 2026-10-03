import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Language-aware versions of Next.js navigation.
 *
 * Always import Link from here, never from 'next/link'. These keep the
 * visitor's language when they move around the site — so an Arabic user
 * stays in Arabic instead of being dropped back into English.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

"use client";

import React, { MouseEventHandler, type HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// react icons
import {
  FaDiscord as Discord,
  FaTelegram as Telegram,
  FaTelegramPlane as TelegramPlane,
  FaHandHoldingWater as HandHoldingWater,
} from "react-icons/fa";
import {
  FaMedium as Medium,
  FaXTwitter as Twitter,
  FaSortDown as SortDown,
  FaSortUp as SortUp,
} from "react-icons/fa6";
import {
  TbArrowsLeftRight as ArrowsRightLeft,
  TbUserPlus as UserPlus,
} from "react-icons/tb";
import { LuCopy as Copy, LuCopyCheck as CopyCheck } from "react-icons/lu";
import { IoShieldCheckmark as IoShieldCheckmark } from "react-icons/io5";

// heroicons of tailwind
import {
  ArrowLeftIcon as ArrowLeft,
  ArrowRightIcon as ArrowRight,
  ArrowUpRightIcon as ArrowUpRight,
  ArrowPathIcon as Refresh,
  ArrowTopRightOnSquareIcon as External,
  ArrowsUpDownIcon as ArrowsUpDown,
  AdjustmentsHorizontalIcon as SettingHorizontal,
  AdjustmentsVerticalIcon as SettingVertical,
  Bars3Icon as Menu,
  BellIcon as Bell,
  CheckBadgeIcon as CheckBadge,
  CheckCircleIcon as CheckCircle,
  CheckIcon as Check,
  ChevronDownIcon as ChevronDown,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
  ChevronUpIcon as ChevronUp,
  ChevronUpDownIcon as ChevronUpDown,
  Cog6ToothIcon as Setting,
  ExclamationCircleIcon as ErrorCircle,
  ExclamationTriangleIcon as ErrorTriangle,
  InformationCircleIcon as Info,
  LinkIcon as Link,
  LockClosedIcon as LockClosed,
  LockOpenIcon as LockOpen,
  MagnifyingGlassIcon as Search,
  MoonIcon as Moon,
  PencilIcon as Edit,
  PencilSquareIcon as EditSquare,
  PlusCircleIcon as PlusCircle,
  PlusIcon as Plus,
  QueueListIcon as QueueList,
  SunIcon as Sun,
  Squares2X2Icon as GridList,
  StarIcon as Star,
  TrashIcon as Trash,
  TrophyIcon as Trophy,
  WalletIcon as Wallet,
  XCircleIcon as CloseCircle,
  XMarkIcon as Close,
} from "@heroicons/react/24/outline";
import {
  AdjustmentsHorizontalIcon as SettingHorizontalFill,
  AdjustmentsVerticalIcon as SettingVerticalFill,
  BellIcon as BellFill,
  CheckBadgeIcon as CheckBadgeFill,
  CheckCircleIcon as CheckCircleFill,
  Cog6ToothIcon as SettingFill,
  InformationCircleIcon as InfoFill,
  LockClosedIcon as LockClosedFill,
  LockOpenIcon as LockOpenFill,
  MoonIcon as MoonFill,
  PlusCircleIcon as PlusCircleFill,
  QueueListIcon as QueueListFill,
  SunIcon as SunFill,
  Squares2X2Icon as GridListFill,
  StarIcon as StarFill,
  TrashIcon as TrashFill,
  TrophyIcon as TrophyFill,
  WalletIcon as WalletFill,
  XCircleIcon as CloseCircleFill,
} from "@heroicons/react/24/solid";

import type { ComponentProps } from "@/types";

export type IconVariantProps = VariantProps<typeof iconVariants>;
export const iconVariants = cva(
  "flex items-center justify-center bg-transparent duration-75",
  {
    variants: {
      variant: {
        primary: "bg-black-200 dark:bg-white-200",
        gold: "text-gold-light dark:text-gold-dark",
        silver: "text-silver-light dark:text-silver-dark",
        bronze: "text-bronze-light dark:text-bronze-dark",
        danger:
          "border border-black-200 dark:border-white-200 bg-card-light dark:bg-card-dark hover:border-danger hover:bg-danger-foreground-light hover:dark:border-danger hover:dark:bg-danger-foreground-dark",
      },
      withBorder: {
        true: "border border-black-300 dark:border-white-300 bg-card-light dark:bg-card-dark hover:border-primary-light dark:hover:border-primary-dark hover:bg-primary-light-foreground dark:hover:bg-primary-dark-foreground",
      },
      round: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      size: {
        2: "w-2 h-2",
        2.5: "w-2.5 h-2.5",
        3: "w-3 h-3",
        4: "w-4 h-4",
        5: "w-5 h-5 tablet_sm:w-4 tablet_sm:h-4",
        6: "w-6 h-6 tablet_sm:w-5 tablet_sm:h-5",
        8: "w-8 h-8",
      },
      padding: {
        1: "p-1",
        1.5: "p-1.5",
        2: "p-2",
        4: "p-4",
      },
    },
    defaultVariants: {
      round: "none",
      withBorder: false,
    },
  }
);

export type IconType = keyof typeof icons;
export interface IconProps
  extends ComponentProps,
    Omit<HTMLAttributes<SVGSVGElement>, "onClick">,
    IconVariantProps {
  name: IconType;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function Icon({
  name,
  variant,
  round,
  size,
  padding,
  withBorder,
  onClick,
  className,
  ...props
}: IconProps) {
  if (!icons[name]) return null;

  const NextIcon = icons[name];

  return (
    <div
      onClick={onClick}
      className={twMerge(
        iconVariants({ variant, round, padding, withBorder }),
        onClick && "cursor-pointer",
        className
      )}
    >
      <NextIcon
        {...props}
        className={twMerge("w-6 h-6", iconVariants({ size }))}
      />
    </div>
  );
}

export const icons = {
  // react-icons
  discord: Discord,
  medium: Medium,
  telegram: Telegram,
  "telegram-plane": TelegramPlane,
  twitter: Twitter,
  sortUp: SortUp,
  sortDown: SortDown,
  handHoldingWater: HandHoldingWater,
  userPlus: UserPlus,
  copy: Copy,
  copyCheck: CopyCheck,
  shieldCheckmark: IoShieldCheckmark,
  // @heroicons
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  "arrows-right-left": ArrowsRightLeft,
  "arrows-up-down": ArrowsUpDown,
  bell: Bell,
  "bell-fill": BellFill,
  check: Check,
  "check-badge": CheckBadge,
  "check-badge-fill": CheckBadgeFill,
  "check-circle": CheckCircle,
  "check-circle-fill": CheckCircleFill,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "chevron-up-down": ChevronUpDown,
  close: Close,
  "close-circle": CloseCircle,
  "close-circle-fill": CloseCircleFill,
  edit: Edit,
  "edit-square": EditSquare,
  "error-circle": ErrorCircle,
  "error-triangle": ErrorTriangle,
  external: External,
  "grid-list": GridList,
  "grid-list-fill": GridListFill,
  info: Info,
  "info-fill": InfoFill,
  link: Link,
  "lock-closed": LockClosed,
  "lock-closed-fill": LockClosedFill,
  "lock-open": LockOpen,
  "lock-open-fill": LockOpenFill,
  refresh: Refresh,
  menu: Menu,
  moon: Moon,
  "moon-fill": MoonFill,
  plus: Plus,
  "plus-circle": PlusCircle,
  "plus-circle-fill": PlusCircleFill,
  "queue-list": QueueList,
  "queue-list-fill": QueueListFill,
  setting: Setting,
  "setting-fill": SettingFill,
  "setting-horizontal": SettingHorizontal,
  "setting-horizontal-fill": SettingHorizontalFill,
  "setting-vertical": SettingVertical,
  "setting-vertical-fill": SettingVerticalFill,
  search: Search,
  star: Star,
  "star-fill": StarFill,
  sun: Sun,
  "sun-fill": SunFill,
  trash: Trash,
  "trash-fill": TrashFill,
  trophy: Trophy,
  "trophy-fill": TrophyFill,
  wallet: Wallet,
  "wallet-fill": WalletFill,
};

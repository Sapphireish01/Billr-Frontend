"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const DashboardIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3.3335 4.16671C3.3335 3.94569 3.42129 3.73373 3.57757 3.57745C3.73385 3.42117 3.94582 3.33337 4.16683 3.33337H7.50016C7.72118 3.33337 7.93314 3.42117 8.08942 3.57745C8.2457 3.73373 8.3335 3.94569 8.3335 4.16671V8.33337C8.3335 8.55439 8.2457 8.76635 8.08942 8.92263C7.93314 9.07891 7.72118 9.16671 7.50016 9.16671H4.16683C3.94582 9.16671 3.73385 9.07891 3.57757 8.92263C3.42129 8.76635 3.3335 8.55439 3.3335 8.33337V4.16671ZM11.6668 4.16671C11.6668 3.94569 11.7546 3.73373 11.9109 3.57745C12.0672 3.42117 12.2791 3.33337 12.5002 3.33337H15.8335C16.0545 3.33337 16.2665 3.42117 16.4228 3.57745C16.579 3.73373 16.6668 3.94569 16.6668 4.16671V5.83337C16.6668 6.05439 16.579 6.26635 16.4228 6.42263C16.2665 6.57891 16.0545 6.66671 15.8335 6.66671H12.5002C12.2791 6.66671 12.0672 6.57891 11.9109 6.42263C11.7546 6.26635 11.6668 6.05439 11.6668 5.83337V4.16671ZM3.3335 13.3334C3.3335 13.1124 3.42129 12.9004 3.57757 12.7441C3.73385 12.5878 3.94582 12.5 4.16683 12.5H7.50016C7.72118 12.5 7.93314 12.5878 8.08942 12.7441C8.2457 12.9004 8.3335 13.1124 8.3335 13.3334V15.8334C8.3335 16.0544 8.2457 16.2663 8.08942 16.4226C7.93314 16.5789 7.72118 16.6667 7.50016 16.6667H4.16683C3.94582 16.6667 3.73385 16.5789 3.57757 16.4226C3.42129 16.2663 3.3335 16.0544 3.3335 15.8334V13.3334ZM11.6668 10.8334C11.6668 10.6124 11.7546 10.4004 11.9109 10.2441C12.0672 10.0878 12.2791 10 12.5002 10H15.8335C16.0545 10 16.2665 10.0878 16.4228 10.2441C16.579 10.4004 16.6668 10.6124 16.6668 10.8334V15.8334C16.6668 16.0544 16.579 16.2663 16.4228 16.4226C16.2665 16.5789 16.0545 16.6667 15.8335 16.6667H12.5002C12.2791 6.66671 12.0672 6.57891 11.9109 16.4226C11.7546 16.2663 11.6668 16.0544 11.6668 15.8334V10.8334Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const PlansIcon = ({ className }: { className?: string }) => (
  <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <mask id="path-1-inside-1_99_307" fill="white">
      <path d="M13.7891 1.25977H15V20H0V1.25977H1.23047V0H2.48047V1.25977H5V0H6.25V1.25977H8.76953V0H10.0195V1.25977H12.5391V0H13.7891V1.25977ZM13.75 18.75V2.50977H1.25V18.75H13.75ZM11.25 5.00977V6.25977H3.75V5.00977H11.25ZM3.75 16.2695V15.0195H11.25V16.2695H3.75ZM3.75 11.2598V10.0098H11.25V11.2598H3.75Z" />
    </mask>
    <path d="M13.7891 1.25977H12.2891V2.75977H13.7891V1.25977ZM15 1.25977H16.5V-0.240234H15V1.25977ZM15 20V21.5H16.5V20H15ZM0 20H-1.5V21.5H0V20ZM0 1.25977V-0.240234H-1.5V1.25977H0ZM1.23047 1.25977V2.75977H2.73047V1.25977H1.23047ZM1.23047 0V-1.5H-0.269531V0H1.23047ZM2.48047 0H3.98047V-1.5H2.48047V0ZM2.48047 1.25977H0.980469V2.75977H2.48047V1.25977ZM5 1.25977V2.75977H6.5V1.25977H5ZM5 0V-1.5H3.5V0H5ZM6.25 0H7.75V-1.5H6.25V0ZM6.25 1.25977H4.75V2.75977H6.25V1.25977ZM8.76953 1.25977V2.75977H10.2695V1.25977H8.76953ZM8.76953 0V-1.5H7.26953V0H8.76953ZM10.0195 0H11.5195V-1.5H10.0195V0ZM10.0195 1.25977H8.51953V2.75977H10.0195V1.25977ZM12.5391 1.25977V2.75977H14.0391V1.25977H12.5391ZM12.5391 0V-1.5H11.0391V0H12.5391ZM12.5391 0V1.5H13.7891V0V-1.5H12.5391V0ZM13.7891 0H12.2891V1.25977H13.7891H15.2891V0H13.7891ZM13.75 18.75H15.25V2.50977H13.75H12.25V18.75H13.75ZM13.75 2.50977V1.00977H1.25V2.50977V4.00977H13.75V2.50977ZM1.25 2.50977V1.00977H-0.25V2.50977H1.25ZM1.25 18.75H-0.25V20.25H1.25V18.75ZM11.25 5.00977H9.75V6.25977H11.25H12.75V5.00977H11.25ZM11.25 6.25977V4.75977H3.75V6.25977V7.75977H11.25V6.25977ZM3.75 6.25977H5.25V5.00977H3.75H2.25V6.25977H3.75ZM3.75 5.00977V6.50977H11.25V5.00977V3.50977H3.75V5.00977ZM3.75 16.2695H5.25V15.0195H3.75H2.25V16.2695H3.75ZM3.75 15.0195V16.5195H11.25V15.0195V13.5195H3.75V15.0195ZM11.25 15.0195H9.75V16.2695H11.25H12.75V15.0195H11.25ZM11.25 16.2695V14.7695H3.75V16.2695V17.7695H11.25V16.2695ZM3.75 11.2598H5.25V10.0098H3.75H2.25V11.2598H3.75ZM3.75 10.0098V11.5098H11.25V10.0098V8.50977H3.75V10.0098ZM11.25 10.0098H9.75V11.2598H11.25H12.75V10.0098H11.25ZM11.25 11.2598V9.75977H3.75V11.2598V12.7598H11.25V11.2598Z" fill="currentColor" mask="url(#path-1-inside-1_99_307)" />
  </svg>
);

const CustomersIcon = ({ className }: { className?: string }) => (
  <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3.39298 6.44036C4.0181 7.06548 4.86594 7.41667 5.75 7.41667C6.63405 7.41667 7.4819 7.06548 8.10702 6.44036C8.73214 5.81523 9.08333 4.96739 9.08333 4.08333C9.08333 3.19928 8.73214 2.35143 8.10702 1.72631C7.4819 1.10119 6.63405 0.75 5.75 0.75C4.86594 0.75 4.0181 1.10119 3.39298 1.72631C2.76786 2.35143 2.41667 3.19928 2.41667 4.08333C2.41667 4.96739 2.76786 5.81523 3.39298 6.44036Z" fill="currentColor" />
    <path d="M15.75 13.25C15.75 11.7983 14.3583 10.5642 12.4167 10.1058M10.75 13.25C10.75 11.4083 8.51167 9.91667 5.75 9.91667C2.98833 9.91667 0.75 11.4083 0.75 13.25M10.75 7.41667C11.6341 7.41667 12.4819 7.06548 13.107 6.44036C13.7321 5.81523 14.0833 4.96739 14.0833 4.08333C14.0833 3.19928 13.7321 2.35143 13.107 1.72631C12.4819 1.10119 11.6341 0.75 10.75 0.75M5.75 7.41667C4.86594 7.41667 4.0181 7.06548 3.39298 6.44036C2.76786 5.81523 2.41667 4.96739 2.41667 4.08333C2.41667 3.19928 2.76786 2.35143 3.39298 1.72631C4.0181 1.10119 4.86594 0.75 5.75 0.75C6.63405 0.75 7.4819 1.10119 8.10702 1.72631C8.73214 2.35143 9.08333 3.19928 9.08333 4.08333C9.08333 4.96739 8.73214 5.81523 8.10702 6.44036C7.4819 7.06548 6.63405 7.41667 5.75 7.41667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const InvoicesIcon = ({ className }: { className?: string }) => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14.0833 15.75H4.08333C3.19928 15.75 2.35143 15.3988 1.72631 14.7737C1.10119 14.1486 0.75 13.3007 0.75 12.4167V2.41667C0.75 1.97464 0.925595 1.55072 1.23816 1.23816C1.55072 0.925595 1.97464 0.75 2.41667 0.75H10.75C11.192 0.75 11.616 0.925595 11.9285 1.23816C12.2411 1.55072 12.4167 1.97464 12.4167 2.41667V13.25C12.4167 14.6308 12.7025 15.75 14.0833 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M15.7503 6.58335C15.7503 6.14133 15.5747 5.7174 15.2622 5.40484C14.9496 5.09228 14.5257 4.91669 14.0837 4.91669H12.417V13.6667C12.417 14.8167 12.9337 15.75 14.0837 15.75C15.2337 15.75 15.7503 14.8167 15.7503 13.6667V6.58335Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M9.08301 7.41665H4.08301M9.08301 4.08331H4.08301M6.58301 10.75H4.08301" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Plans", href: "/plans", icon: PlansIcon },
  { label: "Customers", href: "/customers", icon: CustomersIcon },
  { label: "Invoices", href: "/invoices", icon: InvoicesIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col justify-between border-r border-border bg-surface transition-all duration-200",
        collapsed ? "w-18" : "w-60"
      )}
    >
      <div className="flex flex-col gap-2.5">
        <div className="pt-6.5 pl-10.25">
          <Logo showText={!collapsed} />
        </div>

        <nav className="flex flex-col gap-1 pt-0 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors font-montserrat",
                  isActive
                    ? "bg-navy text-white rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-sm"
                    : "text-text-primary hover:bg-surface-muted hover:text-text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors font-montserrat",
            pathname === "/settings"
              ? "bg-navy text-white"
              : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          )}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary font-montserrat"
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronsLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

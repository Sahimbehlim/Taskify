"use client";

import AppSidebar from "@/components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AppContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, Fragment } from "react";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
  }, [user]);

  if (user === null) return null;

  // Create breadcrumb segments based on pathname
  const segments = pathname.split("/").filter(Boolean);

  const formattedSegments = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {formattedSegments.map((seg, idx) => (
                <Fragment key={seg.href}>
                  <BreadcrumbItem>
                    {seg.isLast ? (
                      <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={seg.href}>{seg.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>

                  {!seg.isLast && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col p-4 gap-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

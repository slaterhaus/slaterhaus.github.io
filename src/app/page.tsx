"use client";
import { useGetViewConfig } from "@/routing/routes";

export default function Page() {
  const config = useGetViewConfig();
  return config?.Component ? <config.Component /> : null
}

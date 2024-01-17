"use client";
import { useGetViewConfig } from "@/routing/routes";

export default function Page() {
  const {Component} = useGetViewConfig();
  return <Component/>
}

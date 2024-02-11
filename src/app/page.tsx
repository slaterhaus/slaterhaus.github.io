"use client";
import { useGetViewConfig } from "@/routing/routes";
import {redirect} from "next/navigation";

export default function Page() {
  return redirect('/p/?view=home')
}

"use client";
import {useGetViewConfig} from "@/routing/routes";
import {Client} from "@/components/frontend";

export default function Page() {
    const config = useGetViewConfig();
    if (config?.Component) return <Client><config.Component /></Client>
    return <h1>Doesn't look like anything to me</h1>;
}

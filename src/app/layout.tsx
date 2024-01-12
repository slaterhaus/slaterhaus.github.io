import { Providers } from "@/components/providers";

export default function Layout({children}: { children: React.ReactNode }) {

  return (
      <html lang="en">
      <body>
      <Providers>{children}</Providers>
      </body>
      </html>
  );
}

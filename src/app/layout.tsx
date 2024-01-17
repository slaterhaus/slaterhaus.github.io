import { Client } from "@/components/frontend";

export default function Layout({children}: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
          }}
      >
      <Client>{children}</Client>
      </body>
      </html>
  );
}

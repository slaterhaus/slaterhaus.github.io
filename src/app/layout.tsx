import { Client } from "@/components/frontend";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
            margin: 0,
          // width: "100vw",
          // height: "100vh",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // userSelect: "none",
        }}
      >
      {children}
      </body>
    </html>
  );
}

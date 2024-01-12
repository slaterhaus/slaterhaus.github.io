import { CameraRouter } from "@/components/routing/camera-router";
import { Frontend } from "@/components/frontend";

export default function Layout({ children }: { children: React.ReactNode }) {
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
        <Frontend>{children}</Frontend>
      </body>
    </html>
  );
}

import { Frontend } from "@/components/providers";
import { CameraRouter } from "@/components/camera-router";

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
        <Frontend>
          <CameraRouter />
          {children}
        </Frontend>
      </body>
    </html>
  );
}

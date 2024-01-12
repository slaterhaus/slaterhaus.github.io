"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/components/theme";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import Controls from "@/components/routing/controls";
import { CameraRouter } from "@/components/routing/camera-router";

export function Frontend({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <Canvas shadows>
        <CameraRouter />
        <Controls />
        {children}
      </Canvas>
    </ChakraProvider>
  );
}

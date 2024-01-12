"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/components/theme";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { FaceLandmarker } from "@react-three/drei";
import { useSearchParams } from "next/navigation";
import Controls from "@/components/controls";

export function Frontend({children}: { children: React.ReactNode }) {
  const controls = useSearchParams().get("controls");
  return (
      <ChakraProvider theme={theme}>
        <Canvas shadows>
          <FaceLandmarker>
            <Controls/>
            {children}
          </FaceLandmarker>
        </Canvas>
      </ChakraProvider>
  );
}

"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/components/theme";
import React from "react";
import { Canvas } from "@react-three/fiber";
import Controls from "@/routing/controls";
import { Camera } from "@/routing/camera";
import { PostProcessing } from "@/routing/post-processing";

export function Client({children}: { children: React.ReactNode }) {
  return (
      <ChakraProvider theme={theme}>
        <Canvas shadows>
          <Camera/>
          <Controls/>
          <PostProcessing />
          {children}
        </Canvas>
      </ChakraProvider>
  );
}

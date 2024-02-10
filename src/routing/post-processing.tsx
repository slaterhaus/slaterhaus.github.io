import { useGetViewConfig } from "@/routing/routes";
import { Autofocus, EffectComposer, DepthOfField } from "@react-three/postprocessing";

export const PostProcessing = () => {
  const config = useGetViewConfig();
  if (!config?.postProcessing) return null

  return <EffectComposer>
    <DepthOfField bokehScale={20} focusDistance={1}  />
    <Autofocus />
  </EffectComposer>
}
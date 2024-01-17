import { useGetViewConfig } from "@/routing/routes";
import { Autofocus, EffectComposer } from "@react-three/postprocessing";

export const PostProcessing = () => {
  const {postProcessing} = useGetViewConfig();
  if (!postProcessing) return null

  return <EffectComposer>
    <Autofocus focusRange={postProcessing?.autoFocus.focusRange ?? 100} bokehScale={postProcessing?.autoFocus?.bokehScale ?? 0}/>
  </EffectComposer>
}
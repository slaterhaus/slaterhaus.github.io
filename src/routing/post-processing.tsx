import {useGetViewConfig} from "@/routing/routes";
import {EffectComposer, DepthOfField, Bloom} from "@react-three/postprocessing";

export const PostProcessing = () => {
    const config = useGetViewConfig();
    if (!config?.postProcessing) return null
    const {
        bokehScale = 1,
        focusRange = 1,
        focusDistance = 0
    } = config?.postProcessing?.autoFocus
    return <EffectComposer>
        <DepthOfField
            focusDistance={focusDistance}
            focusRange={focusRange}
            bokehScale={bokehScale} // bokeh size
        />
        {config.postProcessing.bloom ? <Bloom radius={0}/> : <></>}

    </EffectComposer>
}
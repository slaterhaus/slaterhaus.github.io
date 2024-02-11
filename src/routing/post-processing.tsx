import {getDof, useGetViewConfig} from "@/routing/routes";
import {EffectComposer, DepthOfField, Bloom} from "@react-three/postprocessing";

export const PostProcessing = () => {
    const config = useGetViewConfig();
    if (!config?.postProcessing) return null
    const depthOfField = config?.postProcessing?.depthOfField;
    const dofProps = getDof(config?.postProcessing?.depthOfField)
    return <EffectComposer>
        {depthOfField ? <DepthOfField
            {...dofProps}
        /> : <></>}
        {config.postProcessing.bloom ? <Bloom radius={0}/> : <></>}

    </EffectComposer>
}
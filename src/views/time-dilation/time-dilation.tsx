import Planet from "@/views/time-dilation/planet";
import CentralMass from "@/views/time-dilation/central-mass";

export function TimeDilation() {
    // Constants for your simulation; adjust as necessary
    const G = 6.67430e-11; // Gravitational constant
    const M = 1.989e30; // Mass of the Sun, for example
    const c = 299792458; // Speed of light

    return (
        <>
            <ambientLight intensity={5}/>
            <pointLight position={[10, 10, 10]} />
            <CentralMass />
            <Planet distance={20} period={20} G={G} M={M} c={c} />
            <Planet distance={20} period={10} G={G} M={M} c={c} />
            <Planet distance={20} period={1} G={G} M={M} c={c} />
            <Planet distance={20} period={.1} G={G} M={M} c={c} />
        </>
    );
}

export default TimeDilation;
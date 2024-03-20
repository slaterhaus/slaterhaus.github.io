export function CentralMass() {
    return (
        <mesh>
            <sphereGeometry args={[5, 32, 32]}/>
            <meshStandardMaterial color="yellow"/>
        </mesh>
    );
}

export default CentralMass
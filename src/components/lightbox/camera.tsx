import {Camera, useCameraPermissions} from 'expo-camera';

function App() {
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View>
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    // Camera permissions are granted
    return (
        <View>
            <Camera style={styles.camera}>
                {/* Camera content */}
            </Camera>
        </View>
    );
}
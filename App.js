import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Clipboard } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

export default function App() {
  const [cameraPermission, setcameraPErmission] = useState(null);
  const [scanned, setscanned] = useState(false);
  const [data, setdata] = useState("");
  const [buttonState, setbuttonState] = useState(0);

  async function getPermission() {
    const data = await Permissions.askAsync(Permissions.CAMERA);
    if (data.status === "granted") {
      setcameraPErmission(true);
    }
  }

  async function handleBarCodeScanned({ type, data }) {
    Vibration.vibrate();
    setdata(data);
    setscanned(true);
    setbuttonState(0);
  }

  function scan() {
    setbuttonState(1)
  }

  useEffect(() => {
    getPermission();
  }, [])

  if (cameraPermission && buttonState) {
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <TouchableOpacity onPress={() => {
          setdata(data);
          setscanned(true);
          setbuttonState(0);
        }}
          style={{ transform: [{ translateX: 150 }, { translateY: 190 }] }}>
          <Text style={{ color: "#0c0", fontSize: 25 }}>CANCEL</Text>
        </TouchableOpacity>
      </View >)
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}
          onPress={() => { scan() }}>
          <Text style={{
            fontFamily: "monospace",
            fontSize: 30
          }}>
            SCAN
          </Text>
        </TouchableOpacity>
        {
          data ? (
            <View style={{ backgroundColor: "#000", marginTop: 100, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10, maxWidth: 400, maxHeight: 300 }}>
              <Text style={{ color: "#7d6", marginRight: 30, marginLeft: 20 }}>
                {data}
              </Text>
              <TouchableOpacity
                style={{
                  alignItems: "center", justifyContent: "center", height: 30, borderRadius: 10, width: 50,
                }}
              >
                <Icon
                  raised
                  name='copy'
                  type='font-awesome'
                  color='#000'
                  containerStyle={{ marginRight: 30 }}
                  reverseColor={"#f50"}
                  reverse={true}
                  onPress={() => { Clipboard.setString(data) }} />
              </TouchableOpacity>
            </View>) : (
            <View></View>
          )
        }
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 140,
    height: 140,
    backgroundColor: '#994444',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    borderWidth: 10,
    borderColor: "#ff4444cc",
  }
});

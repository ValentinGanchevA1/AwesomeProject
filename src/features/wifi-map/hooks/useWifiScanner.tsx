import {useState, useEffect, useCallback} from 'react';
import {Platform} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {useGeolocation} from '@/utils/geolocation';

export type WifiNetwork = {
  ssid: string;
  bssid: string;
  signalStrength: number;
  frequency: number;
  security: string;
  timestamp: number;
};

export const useWifiScanner = (scanInterval = 15000) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {getCurrentPosition} = useGeolocation();

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (status !== 'granted') throw new Error('Location permission denied');
      }
    } catch (err) {
      throw new Error('Permission error: ' + err);
    }
  };

  const scanNetworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await requestPermissions();

      const [wifiList, location] = await Promise.all([
        WifiManager.loadWifiList(),
        getCurrentPosition(),
      ]);

      const formattedNetworks = wifiList.map(network => ({
        ssid: network.SSID,
        bssid: network.BSSID,
        signalStrength: parseInt(network.level, 10),
        frequency: parseInt(network.frequency, 10),
        security: network.capabilities,
        timestamp: Date.now(),
        location,
      }));

      setNetworks(formattedNetworks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
      // For iOS demo purposes
      if (Platform.OS === 'ios') {
        setNetworks(mockNetworks);
      }
    } finally {
      setLoading(false);
    }
  }, [getCurrentPosition]);

  useEffect(() => {
    const interval = setInterval(scanNetworks, scanInterval);
    return () => clearInterval(interval);
  }, [scanInterval, scanNetworks]);

  return {networks, loading, error, scanNetworks};
};

// iOS Mock Data
const mockNetworks: WifiNetwork[] = [
  {
    ssid: 'CoffeeShopWiFi',
    bssid: '00:11:22:33:44:55',
    signalStrength: -65,
    frequency: 2412,
    security: 'WPA2',
    timestamp: Date.now(),
  },
  // ... more mock networks
];

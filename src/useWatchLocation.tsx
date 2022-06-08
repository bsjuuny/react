import { useState, useEffect } from 'react'

interface locationType {
  loaded: boolean
  coordinates?: { lat: number; lng: number }
  error?: { code: number; message: string }
}

const useWatchLocation = () => {
  const [location, setLocation] = useState<locationType>({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
  })

  const onSuccess = (location: { coords: { latitude: number; longitude: number } }) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    })
  }

  const onError = (error: { code: number; message: string }) => {
    setLocation({
      loaded: false,
      error,
    })
  }

  // 컴포넌트 안쪽에서 선언하면 에러 발생
  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
    maximumAge: 1000 * 3600 * 24, // 24 hour
  }

  useEffect(() => {
    // navigator 객체 안에 geolocation이 없다면
    // 위치 정보가 없는 것.
    if (!('geolocation' in navigator)) {
      onError({
        code: 0,
        message: 'Geolocation not supported',
      })
    }
    navigator.geolocation.watchPosition(onSuccess, onError, geolocationOptions)
  }, [])

  return location
}

export default useWatchLocation

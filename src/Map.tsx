import React, { useEffect } from 'react'
import useWatchLocation from './useWatchLocation'
import useLocalStorage from './useLocalStorage'

export default function Map() {
  let getLat: number = 0
  let getLng: number = 0
  const location = useWatchLocation()

  if (location.coordinates) { 
    getLat = location.coordinates.lat;
    getLng = location.coordinates.lng;
  }

  const script = document.createElement('script')
  script.innerHTML = `
    var setMap = null;
    function initTmap() {
      setMap = new Tmapv2.Map('TMapApp', {
          center: new Tmapv2.LatLng(`+ getLat +`, `+ getLng +`),
          width: '100%',
          height: '100%',
          zoom: 16
      });
      addMarkerAni(Tmapv2.MarkerOptions.ANIMATE_FLICKER);
    }

    var markers = [];
    var coords = [new Tmapv2.LatLng(`+ getLat + `, ` + getLng +`)];

    function addMarkerAni(aniType) {
      var coordIdx = 0;
      removeMarkers();

      var marker = new Tmapv2.Marker({
        position: coords[coordIdx++],
        draggable: true,
        animation: aniType,
        animationLength: 500,
        label: 'BRIT',
        title: '타이틀',
        map: setMap
      });
      markers.push(marker);
    }

    function removeMarkers() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    initTmap();
  `
  script.type = 'text/javascript'
  script.async = true

  if (getLat && getLng) {
    document.head.appendChild(script)
  }

  const [store, setStore, clearStore] = useLocalStorage('location', { lat: getLat, lng: getLng })
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  }

  if (location.loaded) {
  }

  return (
    <div
      id='TMapApp'
      style={{
        height: '100%',
        width: '100%',
        position: 'fixed',
      }}
    >
      {/* <button onClick={handleClick}> */}
      <button onClick={() => {
        setStore('location' + window.localStorage.length, { lat: getLat, lng: getLng })
      }}>
        Click me {window.localStorage.length}
      </button>
      <button onClick={() => {
        clearStore()
      }}>
        Clear
      </button>
    </div>
  )
}

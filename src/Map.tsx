import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import './App.css';
import useWatchLocation from './useWatchLocation'
import useLocalStorage from './useLocalStorage'
import axios from 'axios'

export default function Map() {
  let getLat: number = 0
  let getLng: number = 0
  const location = useWatchLocation()

  if (location.coordinates) { 
    getLat = location.coordinates.lat;
    getLng = location.coordinates.lng;
  }

  const script = document.createElement('script')
  let coords: string = ''
  coords = '[new Tmapv2.LatLng(' + getLat + ', ' + getLng + ')]'

  script.innerHTML = `
    var setMap = null;
    function initTmap() {
      setMap = new Tmapv2.Map('TMapApp', {
          center: new Tmapv2.LatLng(`+ getLat +`, `+ getLng +`),
          width: '100%',
          height: '500px',
          zoom: 16
      });
      addMarkerAni(Tmapv2.MarkerOptions.ANIMATE_FLICKER);
    }

    var markers = [];
    var coords = `+ coords +`;

    function addMarkerAni(aniType) {
      var coordIdx = 0;
      removeMarkers();

      var marker = new Tmapv2.Marker({
        position: coords[coordIdx++],
        draggable: true,
        animation: aniType,
        animationLength: 500,
        label: '<span style="font-weight: bold; color: red;">현 위치</span>',
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
  script.defer = true
  script.id = 'tmapInit'

  const script1 = document.createElement('script')
  script1.type = 'text/javascript'
  script1.defer = true
  script1.id = 'tmapSearch'

  const addSearchMaker = (getCoords: string) => {
    script1.innerHTML = `
      var markers1 = [];
      var coords1 = [`+ getCoords + `];

      function addMarker() {
        var coordIdx1 = 0;
        removeAddedMarkers();

        var func = function() {
          //Marker 객체 생성.
          var marker1 = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(coords1[coordIdx1].lat, coords1[coordIdx1].lng), //Marker의 중심좌표 설정.
            label: coords1[coordIdx1].index, //Marker의 라벨.
            title: (coords1[coordIdx1].index + ' ' + coords1[coordIdx1].title), //Marker 타이틀.
            map: setMap //Marker가 표시될 Map 설정.
          });
          markers1.push(marker1);
          coordIdx1++;

          if (coordIdx1 < (coords1.length - 1)) {
            // 일정 시간 간격으로 마커를 생성하는 함수를 실행합니다
            setTimeout(func, 1000);
          }
        }
        // 일정 시간 간격으로 마커를 생성하는 함수를 실행합니다
        setTimeout(func, 1000);
      }

      function removeAddedMarkers() {
        for (var i = 0; i < markers1.length; i++) {
          markers1[i].setMap(null);
        }
        markers1 = [];
      }

      addMarker();
    `
  }

  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    if (!rendered && getLat && getLng) {
      document.head.appendChild(script)
      setRendered(true)
    }
  }, [getLat, getLng, script])

  const [inputs, setInputs] = useState({
    search: ''
  });
  const { search } = inputs;
  const [states, setState] = useState({
    isLoading: true,
    result: [],
    meta: [],
  });

  const onChange = (e: any) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value // name 키를 가진 값을 value 로 설정
    });
  };

  const getSearch = async () => {
    const KAKAO_KEY: string | undefined = (process.env.REACT_APP_KAKAO_KEY as string)
    const search_radius: number = 600
    const search_size: number = 15
    let search_page: number = 1
    const search: string = inputs.search
    try {
      if (search === "") {
        setState({result: [], isLoading: false, meta: []})
      } else {
        const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
          params: {
            query: search,
            radius: search_radius,
            size: search_size,
            page: search_page,
            x: getLng,
            y: getLat,
          },
          headers: {
              'Authorization': KAKAO_KEY,
            }
          });

        let getCoords: string = '';
        response.data.documents.map((value: any, index: number) => {
          let getData = value["category_name"].split('>')
          value["category_name_detail"] = getData[getData.length - 1].trim()
          getCoords += '{lat:' + value["y"] + ',lng:' + value["x"] + ',title:\'' + value["place_name"] + '\',index:' + (index + 1) + '}'
          if (index < (response.data.documents.length - 1)) { getCoords += ', ' }
          addSearchMaker(getCoords)
        })
        setState({ result: response.data.documents, isLoading: false, meta: response.data.meta })

        let getJavascript = document.getElementById("tmapSearch")
        if (getJavascript) {
          getJavascript.remove()
        }
        document.head.appendChild(script1)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [store, setStore, clearStore] = useLocalStorage('location', { lat: getLat, lng: getLng })
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  }

  if (location.loaded) {
  }

  return (
    <div style={{padding: '20px', boxSizing: 'border-box'}}>
      <div id='TMapApp' style={{width: '100%', height: '400px', margin: '0 0 20px'}}></div>
      <div>
        <button type="button" onClick={() => {
            setStore('location' + window.localStorage.length, { lat: getLat, lng: getLng })
          }}>
          현재 위치 저장 {window.localStorage.length}
        </button>
        <button type="button" onClick={() => {
          clearStore()
        }}>
          초기화
        </button>
        <input name="search" placeholder="검색어를 입력하세요" onChange={onChange} value={search} />
        <button type="button" onClick={getSearch}>검색</button>
        { states.result.length === 0 && <p>검색결과 없음</p> }
        <ul style={{ margin: '10px 0 0' }}>
          {states.result.map((value, index) => (
            <li style={{ padding: '5px 0 0 20px' }}>
              <span key={ index }>
                {index+1} {value["place_name"]}
                <sub style={{ display: 'inline-block', margin: '0 0 0 10px', fontSize: '12px', color: '#999', verticalAlign: '2px' }}>
                  {value["category_name_detail"]}{" / "}{value["road_address_name"]}
                </sub>
              </span>
              <button type="button" data-x={value["x"]} data-y={value["y"]} style={{ display: 'inline-block', margin: '0 0 0 10px', verticalAlign: '2px' }}>선택</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

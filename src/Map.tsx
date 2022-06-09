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
          height: '400px',
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

  let count: number = 0

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

  const getSearchMovie = async () => {
    // const ID_KEY: string = '06KgZ7pRRC_FRihC_6ef';
    // const SECRET_KEY: string = 'VMa_XW3Qie';
    const KAKAO_KEY: string = 'KakaoAK d49e0f1eba3e8b2b6af118762ce8375a'
    const search_radius: number = 1600
    const search_size: number = 15
    let search_page: number = 1
    const search: string = inputs.search
    try {
      if (search === "") {
        setState({result: [], isLoading: false, meta: []})
      } else {
        // const { data: { items }} = await axios.get('/v2/local/search/keyword.json', {
        const response = await axios.get('/v2/local/search/keyword.json', {
          params: {
            query: search,
            radius: search_radius,
            size: search_size,
            page: search_page,
            x: getLng,
            y: getLat,
            // category_group_code: 'FD6',
          },
          headers: {
              // 'X-Naver-Client-Id': ID_KEY,
              // 'X-Naver-Client-Secret': SECRET_KEY
              'Authorization': KAKAO_KEY,
            }
          });

        console.log(response.data);
        response.data.documents.map((value: any, index: number) => {
          let getData = value["category_name"].split('>')
          value["category_name_detail"] = getData[getData.length - 1].trim()
        })
        setState({ result: response.data.documents, isLoading: false, meta: response.data.meta });
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
        <button type="button" onClick={getSearchMovie}>검색</button>
        { states.result.length === 0 && <p>검색결과 없음</p> }
        <ul style={{ margin: '10px 0 0' }}>
          {states.result.map((value, index) => (
            <li style={{ padding: '5px 0 0 20px' }}>
              <span key={ index }>
                {value["place_name"]}
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

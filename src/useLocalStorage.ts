import { getAllByPlaceholderText } from "@testing-library/react";
import React, { useState, useEffect } from "react";

const useLocalStorage = (keyName: string, defaultValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      let count: number = window.localStorage.length;

      if (defaultValue["lat"] === 0 || defaultValue["lng"] === 0) return false

      count++
      keyName = keyName + count
      window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
      return defaultValue;
    } catch (err) {
      return defaultValue;
    }
  })

  const setValue = (keyName: string, newValue: any) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.error(err)
    }
    setStoredValue(newValue);
  }

  const clearStore = () => {
    try {
      window.localStorage.clear()
    } catch (err) {
      console.error(err)
    }
  }

  return [storedValue, setValue, clearStore] as const;

  // const [userName, setUserName] = useState("");
  // const [check, setCheck] = useState(false);

  // const saveData = () => {
  //   const userObj = { name: userName };
  //   window.localStorage.setItem("userName", JSON.stringify(userObj));
  // };

  // const callData = () => {
  //   setCheck(true);
  // };

  // const onChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
  //   setUserName(e.target.value);
  //   setCheck(false);
  // };
  // return (
  //   <div>
  //     <input
  //       name="userName"
  //       value={userName}
  //       onChange={onChange}
  //       placeholder="이름을 입력하세요!"
  //     />
  //     <button onClick={saveData}>저장하기</button>
  //     <button onClick={callData}> 불러오기</button>

  //     {check ? <p>{window.localStorage.getItem("userName")}</p> : <> </>}
  //   </div>
  // );
};

export default useLocalStorage;
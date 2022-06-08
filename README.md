# REACT

## ⚙️ 초기 세팅

## CRA (create-react-app) with typescript

🥑 타입스크립트로 프로젝트 생성

```jsx
// --template typescript 
npx create-react-app 프로젝트명 --template typescript
```

🥑 ESLint 설정

```jsx
// eslint 설치
npm install eslint --save-dev
```

```jsx
// eslint 설정 (선택지)
npx eslint --init

// eslint 체크 범위 설정
? How would you like to use ESLint? … 
  To check syntax only
▸ To check syntax and find problems
  To check syntax, find problems, and enforce code style

// 모듈 설정
? What type of modules does your project use? … 
▸ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these

// 프로젝트 프레임워크 설정
? Which framework does your project use? … 
▸ React
  Vue.js
  None of these

// Browser, npm, JSON 설정....
```

⭐️ .eslintrc.json 파일 생성됨

```jsx
🔥 추가 패키지 설치

// typescript + eslint
npm i -d eslint-plugin-import @typescript-eslint/parser eslint-import-resolver-typescript

// prettier
npm i -d prettier eslint-config-prettier eslint-plugin-prettier
```

```jsx
// .eslintrc.json 파일 설정

{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
		"prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint", "react-hooks", "prettier"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "camelcase": "error",
    "spaced-comment": "error",
    "quotes": ["error", "single"],
    "no-duplicate-imports": "error",
    "react/jsx-filename-extension": [2, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
    "prettier/prettier": "error"
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
        "moduleDirectory": ["node_modules", "@types"]
      },
      "typescript": {}
    }
  }
}
```

```jsx
// .prettierrc 파일 생성 후 설정

{
  "semi": false,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "jsxSingleQuote": true,
  "bracketSpacing": true
}
```

```jsx
// package.json 파일에 scipts 부분 lint 명령어 추가

"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",

    "lint": "eslint src/**/*.{js,jsx,ts,tsx,json}",
    "lint:fix": "eslint --fix 'src/**/*.{js,jsx,ts,tsx,json}'",
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc"
  },

lint : 문제를 찾아준다.
lint fix : 문제를 찾아서 고치려고 시도해본다.
format : prettier를 사용해서 코드 스타일을 고쳐준다.
```

## 📒 라이브러리

- ### 상태관리
    
    #### [1] JOTAI
    
    ```jsx
    // 설치
    npm i jotai
    ```
    
    #### [2] REDUX
    
- ### CSS
    
    #### Emotion
    
    ```jsx
    // 설치
    
    npm i @emotion/styled @emotion/react
    ```
    
- ### API
    
    #### AXIOS
    
    ```jsx
    // 설치
    npm i axios
    ```
    
- ### ETC
    
    #### React-Query
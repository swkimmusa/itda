import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 16px;
    line-height: 24px;
    height: 100%;
  }

  body {
    height: 100%;
    font-family: "Pretendard Std Variable", "Pretendard Std", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    font-size: 14px;
    line-height: 1rem;
    letter-spacing: 0px;
    word-spacing: 0px;
    margin: 0px;

    &.no-scroll {
      overflow-y: hidden;
    }


    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  p, ul, ol, pre, table, blockquote {
    margin-top: 0px;
    margi-bottom: 0px;
  }

  ul ul, ol ol, ul ol, ol ul {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  ul {
    list-style-type: none;

    li {
      display: inline;
      margin: 0px;
    }
  }

  #app {

  }

  #root {

  }

  #app {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100%;
    height: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100%;
    height: 100%;
    width: 100%;
  }

  .cl-signIn-root,
  .cl-signUp-root {
    margin: auto;
    margin-top: 20px;
  }
  .cl-userButton-root {
    margin-left: auto;
  }
`;
export default GlobalStyle;

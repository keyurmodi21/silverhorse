import React from "react";

import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import NavBar from "./NavBar";
import { PostItemsContainer } from "./PostItems";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffb74d"
    },
    background: {
      paper: "#212121",
      default: "#212121",
    }, text: {
      primary: '#fff'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <PostItemsContainer />
    </ThemeProvider>
  );
}

export default App;

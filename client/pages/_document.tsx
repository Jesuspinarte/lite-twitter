/* eslint-disable @next/next/no-sync-scripts */
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

import theme from "./theme";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script src="//cdn.jsdelivr.net/npm/eruda"></script>
          <script>eruda.init();</script>
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

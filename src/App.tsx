import { ThemeProvider } from "@emotion/react";
import { Editor } from "@monaco-editor/react";
import {
  BorderColorRounded,
  FormatQuoteRounded,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  Tab,
  Toolbar,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { unified } from "unified";
let theme = createTheme({
  typography: { htmlFontSize: 20 },
});
theme = responsiveFontSizes(theme);

import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";

const parser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkStringify);

export const App: FC = () => {
  const [tab, setTab] = useState<0 | 1>(0);
  const [content, setContent] = useState<
    string | undefined
  >(undefined);
  useEffect(() => {
    console.debug(String(parser.processSync(content)));
  }, [content]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <TabContext value={tab}>
          <Toolbar>
            <TabList onChange={(_, value) => setTab(value)}>
              <Tab
                icon={<BorderColorRounded />}
                iconPosition="start"
                label="Editor"
                value={0}
              />
              <Tab
                icon={<FormatQuoteRounded />}
                iconPosition="start"
                label="Result"
                value={1}
              />
            </TabList>
          </Toolbar>
          <TabPanel
            value={0}
            sx={{
              height: "70vh",
            }}
          >
            <Editor
              value={content}
              onChange={(value) => setContent(value)}
              height="100%"
              language="markdown"
              options={{
                fontSize: theme.typography.htmlFontSize,
                wordWrap: "bounded",
                scrollBeyondLastLine: false,
                minimap: { enabled: false },
              }}
            />
          </TabPanel>
          <TabPanel value={1}></TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
};


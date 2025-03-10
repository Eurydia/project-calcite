import { ThemeProvider } from "@emotion/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { ContentCopyRounded } from "@mui/icons-material";
import {
  Button,
  Container,
  createTheme,
  CssBaseline,
  Grid2,
  responsiveFontSizes,
  Toolbar,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { toast, ToastContainer } from "react-toastify";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { nodeEmoji } from "~services/emoji";
import { remarkEmoji } from "~services/unified/remark";

let theme = createTheme({
  typography: { htmlFontSize: 20 },
});
theme = responsiveFontSizes(theme);

export const App: FC = () => {
  const mdContenteRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState<
    string | undefined
  >(undefined);

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco === null) {
      return;
    }
    monaco.languages.registerCompletionItemProvider(
      "markdown",
      {
        triggerCharacters: [":"],
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: nodeEmoji
              .search("")
              .map((emoji) => {
                return {
                  documentation: `:${emoji.name}:`,
                  insertText: `${emoji.name}:`,
                  label: `${emoji.name} (${emoji.emoji})`,
                  kind: monaco.languages.CompletionItemKind
                    .Keyword,
                  range,
                };
              }),
          };
        },
      }
    );
  }, [monaco]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container maxWidth="lg">
        <Grid2
          container
          spacing={2}
          height="100vh"
        >
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Editor
              value={content}
              width="100%"
              height="100%"
              onChange={(value) => setContent(value)}
              language="markdown"
              options={{
                fontSize: theme.typography.htmlFontSize,
                wordWrap: "bounded",
                scrollBeyondLastLine: false,
                minimap: { enabled: false },
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Toolbar
              variant="dense"
              disableGutters
            >
              <Button
                disableRipple
                disableElevation
                variant="contained"
                startIcon={<ContentCopyRounded />}
                onClick={() => {
                  if (mdContenteRef.current === null) {
                    return;
                  }
                  const textContent =
                    mdContenteRef.current.textContent;
                  if (textContent === null) {
                    return;
                  }
                  navigator.clipboard.writeText(
                    textContent
                  );
                  toast("Coped to clipboard", {
                    type: "success",
                  });
                }}
              >
                Copy
              </Button>
            </Toolbar>
            <div ref={mdContenteRef}>
              <Markdown
                remarkPlugins={[remarkGfm, remarkEmoji]}
                rehypePlugins={[rehypeSanitize]}
              >
                {content}
              </Markdown>
            </div>
          </Grid2>
        </Grid2>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
};


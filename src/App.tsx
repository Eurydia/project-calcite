import { ThemeProvider } from "@emotion/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import {
  ContentCopyRounded,
  ContentPasteRounded,
  DeleteRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  Grid2,
  Toolbar,
  Typography,
} from "@mui/material";
import { amber, indigo } from "@mui/material/colors";
import { Root } from "mdast";
import { FC, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { toast, ToastContainer } from "react-toastify";
import { visitParents } from "unist-util-visit-parents";
import { nodeEmoji } from "~services/emoji";
import { rehypeSanitize } from "~services/unified/rehype";
import {
  remarkEmoji,
  remarkGfm,
} from "~services/unified/remark";

const toBoldUnicode = (char: string): string => {
  if (char.length !== 1) {
    return char;
  }

  const charCode = char.codePointAt(0)!;
  if ("a" <= char && char <= "z") {
    return String.fromCodePoint(119737 + charCode);
  }
  if ("A" <= char && char <= "Z") {
    return String.fromCodePoint(119743 + charCode);
  }
  if ("0" <= char && char <= "9") {
    return String.fromCodePoint(55301 + charCode);
  }
  return char;
};

const toBoldItalicUnicode = (char: string): string => {
  if (char.length !== 1) {
    return char;
  }

  const charCode = char.codePointAt(0)!;
  if ("a" <= char && char <= "z") {
    return String.fromCodePoint(120309 + charCode);
  }
  if ("A" <= char && char <= "Z") {
    return String.fromCodePoint(120315 + charCode);
  }
  return char;
};

const toItalicUnicode = (char: string): string => {
  if (char.length !== 1) {
    return char;
  }

  const charCode = char.codePointAt(0)!;
  if ("a" <= char && char <= "z") {
    return String.fromCodePoint(119789 + charCode);
  }
  if ("A" <= char && char <= "Z") {
    return String.fromCodePoint(119795 + charCode);
  }
  return char;
};

const toMonospaceUnicode = (char: string): string => {
  if (char.length !== 1) {
    return char;
  }

  const charCode = char.codePointAt(0)!;
  if ("a" <= char && char <= "z") {
    return String.fromCodePoint(120361 + charCode);
  }
  if ("A" <= char && char <= "Z") {
    return String.fromCodePoint(120367 + charCode);
  }
  return char;
};

const remarkConvertUnicode = () => {
  return (tree: Root) => {
    visitParents(tree, (node, ancestors) => {
      switch (node.type) {
        case "strong": {
          const unicodeConverter = ancestors.some(
            (ancestor) => ancestor.type === "emphasis"
          )
            ? toBoldItalicUnicode
            : toBoldUnicode;
          node.children = node.children.map((child) => {
            if (child.type === "text") {
              const nextValue = child.value
                .split("")
                .map((char) => unicodeConverter(char))
                .join("");
              child.value = nextValue;
            }
            return child;
          });
          break;
        }
        case "emphasis": {
          const unicodeConverter = ancestors.some(
            (ancestor) => ancestor.type === "strong"
          )
            ? toBoldItalicUnicode
            : toItalicUnicode;
          node.children = node.children.map((child) => {
            if (child.type === "text") {
              const nextValue = child.value
                .split("")
                .map((char) => unicodeConverter(char))
                .join("");
              child.value = nextValue;
            }
            return child;
          });
          break;
        }
        case "code":
        case "inlineCode": {
          const convertedValue = node.value
            .split("")
            .map((char) => toMonospaceUnicode(char))
            .join("");
          node.value = convertedValue;
          break;
        }
      }
    });
  };
};

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export const App: FC = () => {
  const [content, setContent] = useState<
    string | undefined
  >(undefined);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco === null) {
      return;
    }

    monaco.languages.registerCompletionItemProvider(
      "markdown",
      {
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
                  documentation: emoji.name,
                  insertText: `:${emoji.name}:`,
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
      <CssBaseline enableColorScheme />
      <Grid2
        container
        spacing={2}
        padding={2}
        width="100%"
        height="90vh"
      >
        <Grid2
          size={{ xs: 12, md: 6 }}
          sx={{
            height: "100%",
            gap: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Toolbar
            variant="dense"
            disableGutters
            sx={{ gap: 1 }}
          >
            <Button
              variant="contained"
              startIcon={<ContentPasteRounded />}
              onClick={async () => {
                const content =
                  await navigator.clipboard.readText();
                setContent(content);
                toast.success("Pasted from clipboard");
              }}
            >
              Paste
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteRounded />}
              onClick={() => {
                setContent("");
                toast.success("Content cleared");
              }}
            >
              Clear
            </Button>
          </Toolbar>
          <Editor
            value={content}
            width="100%"
            height="100%"
            onChange={(value) => setContent(value)}
            language="markdown"
            options={{
              fontSize: 20,
              wordWrap: "bounded",
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
            }}
          />
        </Grid2>
        <Grid2
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Toolbar
            disableGutters
            variant="dense"
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              startIcon={<ContentCopyRounded />}
              onClick={() => {
                if (
                  content === undefined ||
                  contentRef === null ||
                  contentRef.current === null ||
                  contentRef.current.textContent === null
                ) {
                  return;
                }
                navigator.clipboard.writeText(
                  contentRef.current.textContent
                );
                toast.success("Copied to clipboard");
              }}
            >
              Copy
            </Button>
          </Toolbar>
          <Box ref={contentRef}>
            <Markdown
              components={{
                p: (props) => {
                  const { children } = props;
                  return (
                    <Typography
                      sx={{
                        textWrap: "balance",
                        wordBreak: "break-all",
                        width: "100%",
                      }}
                    >
                      {children}
                    </Typography>
                  );
                },
              }}
              remarkPlugins={[
                remarkGfm,
                remarkEmoji,
                remarkConvertUnicode,
              ]}
              rehypePlugins={[rehypeSanitize]}
            >
              {content}
            </Markdown>
          </Box>
        </Grid2>
      </Grid2>
      <ToastContainer />
    </ThemeProvider>
  );
};

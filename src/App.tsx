import { ThemeProvider } from "@emotion/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { ContentCopyRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  Grid2,
  Toolbar,
} from "@mui/material";
import { Root } from "mdast";
import { FC, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { toast, ToastContainer } from "react-toastify";
import { unified } from "unified";
import { visitParents } from "unist-util-visit-parents";
import { nodeEmoji } from "~services/emoji";
import { rehypeSanitize } from "~services/unified/rehype";
import {
  remarkEmoji,
  remarkGfm,
  remarkParse,
  remarkStringify,
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

const remarkBoldUnicode = () => {
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
        case "delete":
          break;
        case "code":
        case "inlineCode":
          break;
        default:
          break;
      }
    });
  };
};

const parser = unified()
  .use(remarkParse)
  .use(remarkBoldUnicode)
  .use(remarkStringify);

const theme = createTheme({
  typography: { htmlFontSize: 20 },
});

export const App: FC = () => {
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
      <CssBaseline />
      <Toolbar
        variant="dense"
        disableGutters
      >
        <Button
          disableRipple
          disableElevation
          disabled={content === undefined}
          variant="contained"
          startIcon={<ContentCopyRounded />}
          onClick={() => {
            if (content === undefined) {
              return;
            }
            navigator.clipboard.writeText(
              parser.processSync(content).toString()
            );
            toast.success("Copied to clipboard", {
              type: "success",
            });
          }}
        >
          Copy
        </Button>
      </Toolbar>
      <Grid2
        container
        spacing={2}
        minHeight={700}
        height="100%"
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
          <Box>
            <Markdown
              remarkPlugins={[
                remarkGfm,
                remarkEmoji,
                remarkBoldUnicode,
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

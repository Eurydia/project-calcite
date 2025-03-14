import { ThemeProvider } from "@emotion/react";
import { Editor } from "@monaco-editor/react";
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
  Divider,
  Grid2,
  Toolbar,
} from "@mui/material";
import { amber, indigo } from "@mui/material/colors";
import { FC, useCallback, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { StyledMarkdown } from "~components/StyledMarkdown";
import { useMonacoInit } from "~hooks/useMonacoInit";

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

  useMonacoInit();

  const handleCopyContent = useCallback(async () => {
    if (
      contentRef === null ||
      contentRef.current === null ||
      contentRef.current.textContent === null
    ) {
      return;
    }
    navigator.clipboard
      .writeText(contentRef.current.textContent)
      .then(
        () => {
          toast.success("Copied to clipboard");
        },
        () => toast.error("Failed to copy to clipboard")
      );
  }, []);

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
              onClick={() => setContent("")}
            >
              Clear
            </Button>
          </Toolbar>
          <Divider />
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
              onClick={handleCopyContent}
            >
              Copy
            </Button>
          </Toolbar>
          <Divider />
          <Box
            ref={contentRef}
            padding={4}
          >
            <StyledMarkdown content={content} />
          </Box>
        </Grid2>
      </Grid2>
      <ToastContainer
        autoClose={2000}
        closeOnClick
        limit={3}
        pauseOnFocusLoss={false}
        position="top-center"
      />
    </ThemeProvider>
  );
};

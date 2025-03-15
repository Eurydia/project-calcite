import { Typography } from "@mui/material";
import { FC } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import { remarkConvertUnicode } from "~services/unified/remarkConvertUnicode";

const COMPONENT_OVERRIDE: Components = {
  p: (props) => {
    const { children } = props;
    return (
      <Typography
        component="span"
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
  strong: (props) => {
    const { children } = props;
    return (
      <Typography
        component="span"
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
  em: (props) => {
    const { children } = props;
    return (
      <Typography
        component="span"
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
  code: (props) => {
    const { children } = props;
    return (
      <Typography
        component="span"
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
};

type StyledMarkdownProps = {
  content: string | undefined;
};
export const StyledMarkdown: FC<StyledMarkdownProps> = (
  props
) => {
  const { content } = props;
  return (
    <Markdown
      skipHtml
      components={COMPONENT_OVERRIDE}
      remarkPlugins={[
        remarkGfm,
        remarkEmoji,
        remarkConvertUnicode,
      ]}
      rehypePlugins={[rehypeSanitize]}
    >
      {content}
    </Markdown>
  );
};

import { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { emoji } from "~services/emoji";

export const useMonacoInit = () => {
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
            suggestions: emoji.search("").map((emoji) => {
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

  return monaco;
};

export const toBoldItalicUnicode = (
  char: string
): string => {
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

export const toItalicUnicode = (char: string): string => {
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

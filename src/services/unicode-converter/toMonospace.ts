export const toMonospaceUnicode = (
  char: string
): string => {
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

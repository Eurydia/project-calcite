export const toBoldUnicode = (char: string): string => {
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

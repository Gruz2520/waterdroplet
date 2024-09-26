export default function validatePassword(value: string): boolean {
  const trans = value.split('');
  const CAPITALS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  return (
    trans.length > 7 &&
    trans.length < 20 &&
    trans.filter((e) => !isNaN(Number(e))).length > 1 &&
    trans.some((s) => CAPITALS.includes(s)) &&
    trans.some((e) => e !== '0')
  );
}

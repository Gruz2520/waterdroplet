export default function validatePhone(value: string): boolean {
  const trans = value.split('');
  return (
    trans[0] === '+' ||
    (!isNaN(Number(trans[0])) &&
      trans.length > 3 &&
      trans.length < 10 &&
      !trans.slice(1).some((e) => isNaN(Number(e))))
  );
}

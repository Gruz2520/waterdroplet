export default interface FeedBackItemProps {
  item: {
    id: number;
    name: string;
    text: string;
    img: string;
  };
  color: 'red' | 'blue' | 'purple';
}

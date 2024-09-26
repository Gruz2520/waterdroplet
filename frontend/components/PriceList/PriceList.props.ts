export interface IService {
  id_service: number;
  service_name: string;
  price: string;
}

export interface IPriceListProps {
  itemsList: IService[];
}

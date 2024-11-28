import { Product } from "Src/database/entities";
import { IOrderAdditionalGroup } from "./IBodyOrderAdditionalGroup";

export interface IBodyOrderItem {
  product?: string | Partial<Product>;
  quantity?: number;
  price?: number;
  pricePerUnit?: number;
  products?: IBodyOrderItem[];
  metadata?: {
    proportion: {
      value: number;
      parts: number;
    };
  };
  additionalGroups?: IOrderAdditionalGroup[];

  setPrice(): void;
}
/*
produto => vários itens
item => vários itens
item => um produto
produto => n itens
item => 1 produto
*/
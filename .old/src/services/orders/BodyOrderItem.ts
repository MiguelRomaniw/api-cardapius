import { AdditionalGroup, Product } from "Src/database/entities";
import { IOrderAdditionalGroup } from "./IBodyOrderAdditionalGroup";
import { IBodyOrderItem } from "./IBodyOrderItem";

export class BodyOrderItem implements IBodyOrderItem {
  product?: string | Partial<Product> | undefined;
  quantity?: number | undefined;
  price?: number | undefined;
  pricePerUnit?: number | undefined;
  products?: BodyOrderItem[] | undefined;
  metadata?: { proportion: { value: number; parts: number } } | undefined;
  additionalGroups?: IOrderAdditionalGroup[] | undefined;

  setPrice(): void {
    const additionalsPrice = this.additionalGroups
      ? this.additionalGroups?.reduce((additionalsPrice, additionalGroup) => {
          return (
            additionalsPrice +
            additionalGroup.additionals.reduce((total, additional) => total + additional.quantity * additional.additional.price, 0)
          );
        }, 0)
      : 0;
    const productsPrice = this.product
      ? (this.product as Product).price
      : this.products!.reduce((productsPrice, product) => productsPrice + product.price!, 0);

    const proportion = this.metadata?.proportion || {
      parts: 1,
      value: 1,
    };

    this.pricePerUnit = Math.floor((productsPrice + additionalsPrice) * 100) / 100;
    this.price = Math.floor(100 * (this.quantity || 1) * (this.pricePerUnit * (proportion.value / proportion.parts))) / 100;
  }

  /**
   *
   */
  constructor(orderItem: Partial<BodyOrderItem>) {
    if (orderItem.products) {
      orderItem.products = orderItem.products.map((product) => new BodyOrderItem(product));
    }

    Object.assign(this, orderItem);

    this.setPrice();

    if (this.product) {
      const product = this.product as Product;

      this.product = {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        price: product.price,
      } as Partial<Product>;
    }

    if (this.additionalGroups) {
      this.additionalGroups = this.additionalGroups.map((additionalGroup: IOrderAdditionalGroup) => {
        const group = additionalGroup.additionalGroup as AdditionalGroup;

        return {
          id: group.id,
          name: group.name,
          required: group.required,
          minLimit: group.minLimit,
          maxLimit: group.maxLimit,
          additionals: additionalGroup.additionals.map((additional) => {
            return {
              id: additional.additional.id,
              name: additional.additional.name,
              description: additional.additional.description,
              price: additional.additional.price,
              quantity: additional.quantity,
            };
          }),
        };
      }) as any;
    }

    if (!this.products) {
      delete this.products;
    }
  }
}

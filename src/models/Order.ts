import { OrderStatus } from "../enums/OrderStatus";
import { formatCurrency, formatDate } from "../utils/formatters";

export interface OrderDetail {
  order_id: string;
  inventory_item_id: string;
  inventory_item_name: string;
  sku_code: string;
  file_name: string | null;
  quantity: number;
  unit_name: string;
}

export interface Order {
  order_id: string;
  ref_no: string;
  recipient_info: string;
  inventory_item_name: string;
  deposit_amount: number;
  total_amount: number;
  remain_amount: number;
  order_status: number;
  order_date: string;
  employee_note: string;
  page_name: string;
  employee_name: string;
  shipping_partner_name: string;
  total_item_quantity: number;
  shipping_note: string;
  channel_id: number;
  payment_type: string;
  ref_type: number;
  customer_name: string;
  seller_id: string | null;
  seller_name: string;
  stock_name: string;
  stock_id: string | null;
  recipient_address: string;
  recipient_tel: string;
  recipient_name: string;
  delivery_code: string;
  print_order_label_count: number;
  shipping_partner_name_org: string;
  shipping_partner_id: string;
  page_id: string;
  branch_id: string;
  shipping_partner_code: string;
  cancel_reason: string | null;
  cancel_date: string | null;
  shipping_partner_type: number;
  from_address: string;
  from_province_or_city_id_number: number | null;
  from_ward_or_commune_id_number: number | null;
  from_district_id_number: number | null;
  sale_channel_name: string;
  Details: OrderDetail[];
}

export class OrderDetailImpl implements OrderDetail {
  order_id: string;
  inventory_item_id: string;
  inventory_item_name: string;
  sku_code: string;
  file_name: string | null;
  quantity: number;
  unit_name: string;

  constructor(data: OrderDetail) {
    this.order_id = data.order_id;
    this.inventory_item_id = data.inventory_item_id;
    this.inventory_item_name = data.inventory_item_name;
    this.sku_code = data.sku_code;
    this.file_name = data.file_name;
    this.quantity = data.quantity;
    this.unit_name = data.unit_name;
  }

  getSubtotal(unitPrice: number): number {
    return this.quantity * unitPrice;
  }
}

export class OrderImpl implements Order {
  order_id!: string;
  ref_no!: string;
  recipient_info!: string;
  inventory_item_name!: string;
  deposit_amount!: number;
  total_amount!: number;
  remain_amount!: number;
  order_status!: number;
  order_date!: string;
  employee_note!: string;
  page_name!: string;
  employee_name!: string;
  shipping_partner_name!: string;
  total_item_quantity!: number;
  shipping_note!: string;
  channel_id!: number;
  payment_type!: string;
  ref_type!: number;
  customer_name!: string;
  seller_id!: string | null;
  seller_name!: string;
  stock_name!: string;
  stock_id!: string | null;
  recipient_address!: string;
  recipient_tel!: string;
  recipient_name!: string;
  delivery_code!: string;
  print_order_label_count!: number;
  shipping_partner_name_org!: string;
  shipping_partner_id!: string;
  page_id!: string;
  branch_id!: string;
  shipping_partner_code!: string;
  cancel_reason!: string | null;
  cancel_date!: string | null;
  shipping_partner_type!: number;
  from_address!: string;
  from_province_or_city_id_number!: number | null;
  from_ward_or_commune_id_number!: number | null;
  from_district_id_number!: number | null;
  sale_channel_name!: string;
  Details!: OrderDetail[];

  constructor(data: Order) {
    Object.assign(this, data);
    this.Details = data.Details.map((detail) => new OrderDetailImpl(detail));
  }

  getFormattedTotal(): string {
    return formatCurrency(this.total_amount);
  }

  getFormattedOrderDate(): string {
    return formatDate(this.order_date);
  }

  getStatusText(): string {
    switch (this.order_status) {
      case OrderStatus.NEW:
        return "Đơn mới";
      case OrderStatus.CONFIRMED:
        return "Đã xác nhận";
      case OrderStatus.PROCESSING:
        return "Đang xử lý";
      case OrderStatus.SHIPPING:
        return "Đang giao hàng";
      case OrderStatus.COMPLETED:
        return "Hoàn thành";
      case OrderStatus.CANCELLED:
        return "Đã hủy";
      case OrderStatus.RETURNED:
        return "Đã trả hàng";
      default:
        return "Không xác định";
    }
  }

  canCancel(): boolean {
    return (
      this.order_status === OrderStatus.NEW ||
      this.order_status === OrderStatus.CONFIRMED
    );
  }

  canReturn(): boolean {
    return this.order_status === OrderStatus.COMPLETED;
  }
}

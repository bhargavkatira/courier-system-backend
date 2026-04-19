export interface OrderPayload {
  customerCode: string;
  declaredValue: number;
  itemDescription: string;
  collectableValue: number;
  height: number;
  length: number;
  breadth: number;
  weight: number;
  pieces: number;

  serviceType: string;
  payMode: string;

  // Sender
  rtnName: string;
  rtnMobile: number;
  rtnAddress: string;
  rtnCity: string;
  rtnState: string;
  rtnPincode: number;

  // Receiver
  consName: string;
  consMobile: number;
  consAddress: string;
  consCity: string;
  consState: string;
  consPincode: number;

  invoiceNumber: string;
  invoiceDate: string;
  invoiceValue: number;

  orderNumber?: string; // generated
}
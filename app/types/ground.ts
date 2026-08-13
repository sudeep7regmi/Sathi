export interface Ground {
    id: string;
    name: string;
    address: string;
    pricePerHour: number;
    amenities: string;
    description?: string;
    paymentQrUrl?: string | null;
    paymentQrPublicId?: string | null;
  }
  
  export interface GroundFormData {
    name: string;
    address: string;
    pricePerHour: string;
    amenities: string;
    description: string;
  }
  
  export interface StatusMessage {
    text: string;
    type: "success" | "error";
  }
export interface CouponRequest {
  name: string;
  expiredAt: Date;
  website?: string;
}

export interface CouponResponse {
  id: string;
  name: string;
  website?: string;
  expiredAt: Date;
  createdAt: Date;
}

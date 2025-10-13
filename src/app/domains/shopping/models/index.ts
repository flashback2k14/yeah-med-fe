export interface CouponResponse {
  id: string;
  name: string;
  website: string;
  notes: string;
  expiredAt: Date;
  createdAt: Date;
}

export type CouponRequest = Omit<CouponResponse, 'id' | 'createdAt'>;

export const createCouponRequest = () => {
  return {
    name: '',
    website: '',
    notes: '',
    expiredAt: new Date(Date.now()),
  } as CouponRequest;
};

type Poll = {
  uid?: string;
  reportCount?: number;
  id?: string;
  title: string;
  description: string;
  createdAt: "";
  updatedAt: "";
  options: {
    value: string;
    votes: number;
  }[];
  public_link?: string;
  views: number;
  isBlocked: boolean;
  image?: string;
  createdBy: string;
};

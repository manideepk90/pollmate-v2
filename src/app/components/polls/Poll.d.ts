type Poll = {
  _id?: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  options: {
    value: string;
    votes: number;
  }[];
  publicLink?: string;
};

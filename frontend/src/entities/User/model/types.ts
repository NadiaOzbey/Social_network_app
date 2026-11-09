export type User = {
  _id: string;
  email: string;
  fullName: string;
  username: string;
  bio: string;
  image: string;
  externalLink: {
    title: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
};
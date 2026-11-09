export type PostAuthor = {
  _id: string;
  username: string;
  image: string;
};

export type Post = {
  _id: string;
  description: string;
  // teaser?: string;
  image: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostData = {
  description: string;
  // teaser?: string;
  image: File;
};

export type UpdatePostData = {
  description?: string;
  image?: File;
};
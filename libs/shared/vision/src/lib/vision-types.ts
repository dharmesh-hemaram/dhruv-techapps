export type VisionImageRequest = {
  content: string;
  imageUrl: string;
};

export type VisionImageResponse = {
  responses: Array<{ fullTextAnnotation: { text: string } }>;
};

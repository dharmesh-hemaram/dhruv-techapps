import { FirebaseFunctionsBackground } from '@dhruv-techapps/firebase-functions';
import { VisionImageRequest, VisionImageResponse } from './vision-types';

export class VisionBackground extends FirebaseFunctionsBackground {
  async imagesAnnotate({ content, imageUrl }: VisionImageRequest): Promise<string> {
    if (!content && !imageUrl) {
      throw new Error('No image data found');
    }
    const data: VisionImageRequest = { content, imageUrl };
    const result = await this.visionImagesAnnotate<VisionImageRequest, VisionImageResponse>(data);
    return result.responses[0].fullTextAnnotation.text;
  }
}

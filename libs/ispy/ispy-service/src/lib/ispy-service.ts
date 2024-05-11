import { IspyExtraQuestionType, IspyServiceResponseType } from './ispy-service.types';
import response from './response.json';

export class IspyService {
  static async getUser() {
    return Promise.resolve(response);
  }

  static async getExtraAnswers(data: IspyExtraQuestionType[]) {
    const response: IspyServiceResponseType = {};
    data.forEach((item: IspyExtraQuestionType) => {
      response[item.id] = item.question;
    });
    return Promise.resolve(response);
  }
}

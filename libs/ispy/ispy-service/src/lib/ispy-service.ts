import response from './response.json';

export class IspyService {
  static async getIspyUser() {
    return Promise.resolve(response);
  }

  static async getIspyQuestions(data: any) {
    data.forEach((item: any) => {
      response[item.name as keyof typeof response] = item.value;
    });
    return Promise.resolve(response);
  }
}

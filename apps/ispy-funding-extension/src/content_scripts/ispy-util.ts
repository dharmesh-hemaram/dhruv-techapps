import { IspyService } from '@dhruv-techapps/ispy-service';
import BatchProcessor from './batch';

const IspyUtil = (() => {
  const getIspyQuestions = () => {
    const questions: any = [];
    document
      .querySelector('.extra-questions')
      ?.querySelectorAll('.extra-answer.showing')
      .forEach((e) => {
        const question = e?.querySelector('label[for]');
        const name = question?.getAttribute('for');
        const value = question?.innerHTML;
        if (name && value) {
          questions.push({ [name]: value });
        }
      });

    return questions;
  };

  const process = async () => {
    const questions = getIspyQuestions();
    window.__api = IspyService.getIspyQuestions(questions);
    await BatchProcessor.start(questions);
    console.log('API', window.__api);
  };

  return {
    process,
  };
})();
export default IspyUtil;

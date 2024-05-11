import { IspyService, IspyExtraQuestionType } from '@dhruv-techapps/ispy-service';
import BatchProcessor from './batch';
import { Action } from '@dhruv-techapps/acf-common';

const IspyExtraQuestions = (() => {
  const getActions = (questions: Array<IspyExtraQuestionType>) => {
    return questions.map<Action>(({ id }) => {
      return { id: crypto.randomUUID(), elementFinder: `#${id}`, value: `Api::${id}` };
    });
  };
  const getQuestions = () => {
    const questions: Array<IspyExtraQuestionType> = [];
    document
      .querySelector('.extra-questions')
      ?.querySelectorAll('.extra-answer.showing')
      .forEach((e) => {
        const questionEle = e?.querySelector('label[for]');
        const id = questionEle?.getAttribute('for');
        const question = questionEle?.innerHTML;
        if (id && question) {
          questions.push({ id, question });
        }
      });

    return questions;
  };

  const process = async () => {
    const questions = getQuestions();
    window.__api = await IspyService.getExtraAnswers(questions);
    console.log('IspyExtraQuestions.process -> window.__api', window.__api);
    const actions = getActions(questions);
    await BatchProcessor.start(actions);
  };

  return {
    process,
  };
})();
export default IspyExtraQuestions;

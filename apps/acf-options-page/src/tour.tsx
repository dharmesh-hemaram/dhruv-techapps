export const steps = [
  {
    selector: '[data-testid=configurations-add]',
    content: () => (
      <div>
        To create a new setup, just click on "New Config".
        <br />
        <a href='https://getautoclicker.com/docs/3.x/config-list/add-configuration/' target='_blank' rel='noopener noreferrer'>
          Add Configuration
        </a>
      </div>
    ),
  },
  {
    selector: 'input[name=url]',
    content: () => (
      <div>
        Every configuration comes with its own special web address where it operates. You can even employ regular expressions to match multiple{' '}
        <a href='https://getautoclicker.com/docs/3.x/configuration/url/' target='_blank' rel='noopener noreferrer'>
          URLs
        </a>
        .
      </div>
    ),
  },
  {
    selector: '#add-action',
    content: () => (
      <div>
        Whether you\'re filling an input field or clicking a button, each is treated as a single action. To include additional actions, simply click on the "Add Action" button.
        <br />
        <a href='https://getautoclicker.com/docs/3.x/action/overview/' target='_blank' rel='noopener noreferrer'>
          Action
        </a>
      </div>
    ),
  },
  {
    selector: '[name=elementFinder]',
    content: () => (
      <div>
        Every component on a webpage, be it a button, link, input field, or any simple UI, is considered an element. The Element Finder feature assists the extension in locating these elements within
        the page.There are various methods available to locate elements within a webpage.
        <br />
        <a href='https://getautoclicker.com/docs/3.x/action/element-finder/' target='_blank' rel='noopener noreferrer'>
          Element Finder
        </a>
      </div>
    ),
  },
  {
    selector: '[name=value]',
    content: () => (
      <div>
        Values are employed to populate input fields, and if you wish to click a component, you can simply leave the field blank. Explore numerous other options available for customization.
        <br />
        <a href='https://getautoclicker.com/docs/3.x/action-value/overview/' target='_blank' rel='noopener noreferrer'>
          Value
        </a>
      </div>
    ),
  },
  {
    selector: '#tour',
    content: 'To restart the tour, simply click the link provided here.',
  },
];

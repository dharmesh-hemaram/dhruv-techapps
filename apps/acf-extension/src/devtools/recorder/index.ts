const types = {};
chrome.devtools.inspectedWindow.getResources((resources) => {
  console.log(resources);
  const result = `Resources on this page: 
  ${Object.entries(types)
    .map((entry) => {
      const [type, count] = entry;
      return `${type}: ${count}`;
    })
    .join('\n')}`;
  const div = document.createElement('div');
  div.innerText = result;
  document.body.appendChild(div);
});

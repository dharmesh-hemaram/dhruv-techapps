const Common = (() => {
  const getElements = async (elementFinder: string): Promise<Array<HTMLElement> | undefined> => {
    let elements: HTMLElement[] | undefined;
    try {
      if (/^(id::|#)/gi.test(elementFinder)) {
        const element = document.getElementById(elementFinder.replace(/^(id::|#)/gi, ''));
        elements = element ? [element] : undefined;
      } else if (/^Selector::/gi.test(elementFinder)) {
        const element = document.querySelector<HTMLElement>(elementFinder.replace(/^Selector::/gi, ''));
        elements = element ? [element] : undefined;
      } else if (/^ClassName::/gi.test(elementFinder)) {
        const classElements = document.getElementsByClassName(elementFinder.replace(/^ClassName::/gi, '')) as HTMLCollectionOf<HTMLElement>;
        elements = classElements.length !== 0 ? Array.from(classElements) : undefined;
      } else if (/^Name::/gi.test(elementFinder)) {
        const nameElements = document.getElementsByName(elementFinder.replace(/^Name::/gi, ''));
        elements = nameElements.length !== 0 ? Array.from(nameElements) : undefined;
      } else if (/^TagName::/gi.test(elementFinder)) {
        const tagElements = document.getElementsByTagName(elementFinder.replace(/^TagName::/gi, '')) as HTMLCollectionOf<HTMLElement>;
        elements = tagElements.length !== 0 ? Array.from(tagElements) : undefined;
      } else if (/^SelectorAll::/gi.test(elementFinder)) {
        const querySelectAll = document.querySelectorAll<HTMLElement>(elementFinder.replace(/^SelectorAll::/gi, ''));
        elements = querySelectAll.length !== 0 ? Array.from(querySelectAll) : undefined;
      } else {
        const nodes = document.evaluate(elementFinder, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (nodes.snapshotLength !== 0) {
          elements = [];
          let i = 0;
          while (i < nodes.snapshotLength) {
            elements.push(nodes.snapshotItem(i) as HTMLElement);
            i += 1;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    return elements;
  };

  return { getElements };
})();

export default Common;

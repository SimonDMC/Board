import { read } from './firebase';

export const dbListContainsValue = async (path: string, value: any) => {
	const list = await read(path);
	console.log(list);

	return list.includes(value);
};

// https://stackoverflow.com/a/6691294
export const pasteHtmlAtCaret = (html: any) => {
	let sel, range;
	if (window.getSelection) {
		// IE9 and non-IE
		sel = window.getSelection();
		if (sel!.rangeCount) {
			range = sel!.getRangeAt(0);
			range.deleteContents();

			// Range.createContextualFragment() would be useful here but is
			// only relatively recently standardized and is not supported in
			// some browsers (IE9, for one)
			const el = document.createElement('div');
			el.innerHTML = html;
			const frag = document.createDocumentFragment();
			let node, lastNode;
			while ((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
			}
			range.insertNode(frag);

			// Preserve the selection
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel!.removeAllRanges();
				sel!.addRange(range);
			}
		}
	}
};

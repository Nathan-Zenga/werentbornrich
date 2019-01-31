module.exports = function divide(arr, n, final) {
	if (!(arr instanceof Array)) { console.log("not an array"); return }
	if (!(final instanceof Array)) final = [];

	let tempArr = Object.assign([], arr);

	let row = tempArr.slice(0, n);
	tempArr = tempArr.slice(n);
	final.push(row);

	if (tempArr.length) {
		return divide(tempArr, n, final)
	} else {
		return final
	}
}
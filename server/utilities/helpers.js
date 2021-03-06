async function asyncForEach(mysql, array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(mysql, array[i]);
  }
}

module.exports = { asyncForEach };

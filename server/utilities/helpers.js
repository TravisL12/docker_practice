async function asyncForEach(mysql, array, callback) {
  const results = [];
  for (let i = 0; i < array.length; i++) {
    const data = await callback(mysql, array[i]);
    if (data && Object.keys(data).length > 0) {
      results.push(data);
    }
  }
  return results;
}

module.exports = { asyncForEach };

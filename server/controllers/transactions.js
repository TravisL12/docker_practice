async function getCategory(mysql, name, parentId) {
  let category = await mysql.record("categories", { name });
  if (!category) {
    const newCategory = await mysql.insert("categories", {
      name,
      parent_category_id: parentId,
    });
    category = await mysql.record("categories", newCategory.insertId);
  }

  return category;
}

module.exports = {
  add: async (mysql) => {
    const item = {
      description: "else something",
      payee: "else something",
      category: "Food",
      subcategory: "Restuarant",
    };

    const category = await getCategory(mysql, item.category);
    const subcategory = await getCategory(mysql, item.subcategory, category.id);

    const transaction = {
      description: item.description,
      payee: item.payee,
      amount: Math.abs(1000),
      date: new Date(),
      user_id: 1,
      category_id: category.id,
      sub_category_id: subcategory.id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await mysql.insert("transactions", transaction);

    return;
  },
};

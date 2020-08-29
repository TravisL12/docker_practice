async function getCategory(mysql, name, parentId) {
  if (!name) return name;

  let category = await mysql.record("categories", { name });
  if (!category) {
    const newCategory = await mysql.insert("categories", {
      name,
      parent_category_id: parentId,
    });
    category = await mysql.record("categories", newCategory.insertId);
  }

  return category.id;
}

module.exports = {
  add: async (mysql, item) => {
    const categoryId = await getCategory(mysql, item.category);
    const subcategoryId = await getCategory(
      mysql,
      item.subcategory,
      categoryId
    );

    const transaction = {
      description: item.description,
      payee: item.payee,
      amount: Math.abs(1000),
      date: new Date(),
      user_id: 1,
      category_id: categoryId,
      sub_category_id: subcategoryId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await mysql.insert("transactions", transaction);

    return;
  },
};

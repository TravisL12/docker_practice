async function getCategory(mysql, name, parentId) {
  if (!name) return name;

  let category = await mysql.record('categories', { name });
  if (!category) {
    const newCategory = await mysql.insert('categories', {
      name,
      parent_category_id: parentId,
    });

    if (newCategory) {
      category = await mysql.record('categories', newCategory.insertId);
    }
  }

  return category && category.id ? category.id : null;
}

function cleanDescription(description) {
  return description.replace(/\s+/g, ' ').replace(/(.)\1{2,}/g, '');
}

module.exports = {
  add: async (mysql, item) => {
    const { amount, category, date, description, payee, subcategory } = item;

    // parse date from description (more accurate transaction date)
    const dateRe = new RegExp(/((^\d{1,2}|\s\d{1,2})\/\d{2}\s)/);
    let newDate = description.match(dateRe);

    if (newDate) {
      const year = new Date(date).getFullYear(); // used to get the year
      newDate = [year, newDate[0].trim()].join('-');

      // no future stuff
      if (new Date() < new Date(newDate)) {
        newDate = date;
      }
    } else {
      newDate = date;
    }

    const transaction = {
      description: cleanDescription(description),
      payee,
      amount: +amount.replace(/[$,]/g, '') * 100,
      date: new Date(newDate),
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const categoryId = await getCategory(mysql, category);
    const subcategoryId = await getCategory(mysql, subcategory, categoryId);

    if (categoryId) {
      transaction.category_id = categoryId;
    }
    if (subcategoryId) {
      transaction.sub_category_id = subcategoryId;
    }

    mysql.insert('transactions', transaction).catch(function (err) {
      console.log('Error creating new transaction, mysql error:', err.message);
      console.table('Error item:', item.description);
    });
  },
};

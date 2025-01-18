const TRANSACTION_QUERY = `SELECT 
        t.id, t.description, t.payee, t.date, t.amount, cat.name category, subcat.name subcategory from transactions t
        left join categories cat on t.category_id = cat.id
        left join categories subcat on t.sub_category_id = subcat.id
      where description not like 'ONLINE TRANSFER TO%'`;

module.exports = { TRANSACTION_QUERY };

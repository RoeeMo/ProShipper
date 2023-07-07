const Item = require('../models/item');
const { getMessages } = require('../utils/messageUtils');
const { getUsernameOrID } = require('../utils/authUtils.js');
const pdf = require('html-pdf');
const { encode } = require('html-entities');

async function item_table(req, res) {
    try {
      const result = await Item.find().sort({ createdAt: 1 })
      res.render('items', { title: 'Items', username: req.decodedToken.username, items: result });
    } catch (err) {
      console.log(err);
    }
};

async function item_details(req, res) {
    const id = req.params.id;
    try {
      const item = await Item.findById(id);
      let raw_messages = await getMessages('item', id);
      // in each message, replace the sender from the user id to the username
      await Promise.all(raw_messages.map(async (message) => {
        message.sender = await getUsernameOrID(message.sender, 'id');
      }));
      // Sort messages by date
      const sortedMessages = raw_messages.sort((a, b) => b.timestamp - a.timestamp);
      res.render('details', { item: item, messages: sortedMessages, username: req.decodedToken.username, title: `Item Details - ${item.name}` });
    } catch (err) {
      res.status(404).render('404', { title: 'Item not found', username: req.decodedToken.username });
      console.log(err);
    };
};

async function add_item(req, res) {
    try {
      const item = new Item(req.body);
      await item.save();
      res.status(201).json({ success: true, msg: 'Item added successfully!' });
    } catch (err) {
      res.status(500).json({ success: false, msg: 'Something went wrong' });
      console.log(err);
    }
};

async function del_item(req, res) {
    try{
      const itemId = req.body.id;
      await Item.findByIdAndDelete(itemId);
      res.status(200).json({ success: true, msg: 'Item deleted successfully!' });
    } catch {
      console.log(err);
      res.status(500).json({ success: false, msg: 'Something went wrong' });
    }
};

async function generate_pdf(req, res) {
  const items = req.body.items; 

  let tableRows = '';
  await items.forEach(item => {
    tableRows += `
      <tr>
        <td>${encode(item.name)}</td>
        <td>${encode(item.price)}</td>
        <td>${encode(item.description)}</td>
      </tr>
    `; // encode() is used to prevent server side XSS
  });

  const htmlContent = `
  <html>
    <head>
      <title>Generated PDF</title>
      <style>
          h1 {
            text-align: center;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            padding: 10px;
            border: 1px solid black;
          }

          thead th {
            background-color: #f0f0f0;
          }

          tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
    </head>
    <body>
      <h1>Generated PDF</h1>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
  </html>
  `;
  
  const options = { format: 'Letter' };
  
  pdf.create(htmlContent, options).toStream((err, stream) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, msg: 'Something went wrong' });;
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=generated.pdf');
      stream.pipe(res);
    }
  })
};

async function search(req, res){
  const searchTerm = req.query.term; // Retrieve the search term from the query parameters

  try {
    // Perform the search operation
    const searchResults = await Item.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } }); // Sort the results by text score if needed

    // Return search results
    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
    item_table,
    item_details,
    add_item,
    del_item,
    generate_pdf,
    search
};
const Item = require('../models/item');
const { getMessages } = require('../utils/messageUtils');
const pdf = require('html-pdf');
const { encode } = require('html-entities');
const Message = require('../models/message');

async function listItems(req, res) {
    try {
        const result = await Item.find().sort({ createdAt: 1 })
        res.render('items', { title: 'Items', username: req.decodedToken.username, type:req.decodedToken.type, items: result });
    } catch (err) {
        console.log(err);
    }
};

async function viewItem(req, res) {
    const id = req.params.id;
    try {
        const item = await Item.findById(id);
        const raw_messages = await getMessages(id);
        const sortedMessages = raw_messages.sort((a, b) => b.timestamp - a.timestamp);
        return res.render('item-details', { item: item, messages: sortedMessages, username: req.decodedToken.username, type:req.decodedToken.type, title: `Item Details - ${item.name}` });
    } catch (err) {
        console.log(err);  
        return res.status(404).render('404', { title: 'Item not found', username: req.decodedToken.username, type:req.decodedToken.type });
    };
};

async function addItem(req, res) {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json({ success: true, msg: 'Item added successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'Something went wrong' });
    }
};

async function deleteItem(req, res) {
    try {
        const itemId = req.params.id;
        if (itemId) {
          await Item.findByIdAndDelete(itemId);
          await Message.deleteMany({ item_id: itemId });
          return res.status(200).json({ success: true, msg: 'Item deleted successfully!' });
        } else {
          return res.status(400).json({ success: false, msg: 'What did you do? :)' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: 'Something went wrong' });
    }
};

async function deleteMessagesOfItem(req, res) {
  try {
      const itemId = req.params.id;
      if (itemId) {
        await Message.deleteMany({ item_id: itemId });
        return res.status(200).json({ success: true, msg: 'Messages deleted successfully!' });
      } else {
        return res.status(400).json({ success: false, msg: 'What did you do? :)' });
      }
  } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
};

async function generatePdf(req, res) {
  const items = req.body.items; 

  let tableRows = '';
  await items.forEach(item => {
    tableRows += `
      <tr>
        <td>${encode(item.name)}</td>
        <td>${encode(item.price)}</td>
        <td>${encode(item.description)}</td>
      </tr>
    `; // The function encode() is used to prevent Server-Side XSS
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
      return res.status(500).json({ success: false, msg: 'Something went wrong' });;
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=items.pdf');
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
    return res.json(searchResults);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
    listItems,
    viewItem,
    addItem,
    deleteItem,
    deleteMessagesOfItem,
    generatePdf,
    search
};
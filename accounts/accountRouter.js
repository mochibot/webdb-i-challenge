const express = require('express');

const db = require('../data/dbConfig');

const router = express.Router();

//get all accounts
router.get('/', (req, res) => {
  db('accounts')
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ message: 'error fetching accounts' });
    })
})

//get specific accounts
router.get('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id})
    .then(response => {
      if (response.length === 0) {
        res.status(404).json({ message: 'no account with this id exists' });
      } else {
        res.status(200).json(response[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'error fetching account with id specified' });
    })
})

//add an account
router.post('/', (req, res) => {
  let account = req.body;
  if (!account.name || !account.budget) {
    res.status(400).json({ message: 'name and budget must be included' });
  } else {
    db('accounts')
      .where({ name: account.name })
      .then(response => {
        if (response.length === 0) {
          account.budget = Number(account.budget);
          db('accounts')
            .insert(account)
            .then(response => {
              res.status(201).json(response);
            })
            .catch(error => {
              res.status(500).json({ message: 'error fetching account with id specified' });
            })
        } else {
          res.status(400).json({ message: 'an account with this name already exists in the db'});
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'error fetching account with id specified' })
      })
  }
})

//delete an account
router.delete('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id})
    .del()
    .then(response => {
      if (response > 0) {
        res.status(200).json({ message: 'account was successfully deleted'});
      } else {
        res.status(404).json({ message: 'no account with this id exists' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'error deleting account from db' })
    })
})

//update an account
router.put('/:id', (req, res) => {
  let account = req.body;
  if (!account.name || !account.budget) {
    res.status(400).json({ message: 'name and budget must be included' });
  } else {
    account.budget = Number(account.budget);
    db('accounts')
      .where({ id: req.params.id})
      .update(account)
      .then(response => {
        if (response > 0) {
          res.status(200).json(account);
        } else {
          res.status(404).json({ message: 'no account with this id exists' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'error adding account to db' })
      })
  }
})

module.exports = router;
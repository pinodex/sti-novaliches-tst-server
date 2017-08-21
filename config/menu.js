'use strict'

module.exports = [
  {
    header: null,
    list: [
      {
        icon: 'home',
        identifier: 'home',
        route: 'dashboard.index',
        name: 'Home'
      },

      {
        icon: 'vcard',
        identifier: 'accounts',
        route: 'dashboard.accounts',
        name: 'Accounts'
      },

      {
        icon: 'desktop',
        identifier: 'clients',
        route: 'dashboard.clients',
        name: 'Clients'
      },

      {
        icon: 'folder',
        identifier: 'categories',
        route: 'dashboard.categories',
        name: 'Categories'
      },

      {
        icon: 'male',
        identifier: 'candidates',
        route: 'dashboard.candidates',
        name: 'Candidates'
      },

      {
        icon: 'list',
        identifier: 'criterias',
        route: 'dashboard.criterias',
        name: 'Criterias'
      },

      {
        icon: 'user',
        identifier: 'judges',
        route: 'dashboard.judges',
        name: 'Judges'
      },

      {
        icon: 'plug',
        identifier: 'connections',
        route: 'dashboard.connections',
        name: 'Connections'
      },

      {
        icon: 'star',
        identifier: 'scores',
        route: 'dashboard.scores',
        name: 'Scores'
      }
    ]
  }
]

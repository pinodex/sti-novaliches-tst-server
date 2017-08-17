'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route
  .get('/', 'MainController.index')
  .as('index')

Route.group('dashboard', () => {

  Route
    .get('/', 'Dashboard/MainController.index')
    .as('dashboard.index')
    .middleware('auth:account')

  Route
    .route('login', ['GET', 'POST'], 'Dashboard/MainController.login')
    .as('dashboard.login')

  Route
    .get('logout', 'Dashboard/MainController.logout')
    .as('dashboard.logout')
    .middleware('auth:account')

})
.prefix('dashboard')

/**
 * Accounts
 */
Route.group('dashboard.accounts', () => {

  Route
    .get('/', 'Dashboard/AccountController.index')
    .as('dashboard.accounts')

  Route
    .route('add', ['GET', 'POST'], 'Dashboard/AccountController.edit')
    .as('dashboard.accounts.add')

  Route
    .route(':id/edit', ['GET', 'POST'], 'Dashboard/AccountController.edit')
    .as('dashboard.accounts.edit')

  Route
    .route(':id/delete', ['GET', 'POST'], 'Dashboard/AccountController.delete')
    .as('dashboard.accounts.delete')

})
.prefix('dashboard/accounts')
.middleware('auth:account')

/**
 * Categories
 */
Route.group('dashboard.categories', () => {

  Route
    .get('/', 'Dashboard/CategoryController.index')
    .as('dashboard.categories')

  Route
    .route('add', ['GET', 'POST'], 'Dashboard/CategoryController.edit')
    .as('dashboard.categories.add')

  Route
    .route(':id/edit', ['GET', 'POST'], 'Dashboard/CategoryController.edit')
    .as('dashboard.categories.edit')

  Route
    .route(':id/delete', ['GET', 'POST'], 'Dashboard/CategoryController.delete')
    .as('dashboard.categories.delete')

})
.prefix('dashboard/categories')
.middleware('auth:account')

/**
 * Categories
 */
Route.group('dashboard.categories.sub', () => {

  Route
    .get(':id/subcategories', 'Dashboard/SubcategoryController.index')
    .as('dashboard.categories.sub')

  Route
    .route(':id/subcategories/add', ['GET', 'POST'], 'Dashboard/SubcategoryController.edit')
    .as('dashboard.categories.sub.add')

  Route
    .route(':id/subcategories/:sid/edit', ['GET', 'POST'], 'Dashboard/SubcategoryController.edit')
    .as('dashboard.categories.sub.edit')

  Route
    .route(':id/subcategories/:sid/delete', ['GET', 'POST'], 'Dashboard/SubcategoryController.delete')
    .as('dashboard.categories.sub.delete')

})
.prefix('dashboard/categories')
.middleware('auth:account')

/**
 * Candidates
 */
Route.group('dashboard.candidates', () => {

  Route
    .get('/', 'Dashboard/CandidateController.index')
    .as('dashboard.candidates')

  Route
    .route('add', ['GET', 'POST'], 'Dashboard/CandidateController.edit')
    .as('dashboard.candidates.add')

  Route
    .route(':id/edit', ['GET', 'POST'], 'Dashboard/CandidateController.edit')
    .as('dashboard.candidates.edit')

  Route
    .route(':id/delete', ['GET', 'POST'], 'Dashboard/CandidateController.delete')
    .as('dashboard.candidates.delete')

})
.prefix('dashboard/candidates')
.middleware('auth:account')

/**
 * Categories
 */
Route.group('dashboard.criterias', () => {

  Route
    .get('/', 'Dashboard/CriteriaController.index')
    .as('dashboard.criterias')

  Route
    .route('add', ['GET', 'POST'], 'Dashboard/CriteriaController.edit')
    .as('dashboard.criterias.add')

  Route
    .route(':id/edit', ['GET', 'POST'], 'Dashboard/CriteriaController.edit')
    .as('dashboard.criterias.edit')

  Route
    .route(':id/delete', ['GET', 'POST'], 'Dashboard/CriteriaController.delete')
    .as('dashboard.criterias.delete')

})
.prefix('dashboard/criterias')
.middleware('auth:account')

/**
 * Judges
 */
Route.group('dashboard.judges', () => {

  Route
    .get('/', 'Dashboard/JudgeController.index')
    .as('dashboard.judges')

  Route
    .route('add', ['GET', 'POST'], 'Dashboard/JudgeController.edit')
    .as('dashboard.judges.add')

  Route
    .route(':id/edit', ['GET', 'POST'], 'Dashboard/JudgeController.edit')
    .as('dashboard.judges.edit')

  Route
    .route(':id/delete', ['GET', 'POST'], 'Dashboard/JudgeController.delete')
    .as('dashboard.judges.delete')

    Route
    .route(':id/reset', ['GET', 'POST'], 'Dashboard/JudgeController.reset')
    .as('dashboard.judges.reset')

})
.prefix('dashboard/judges')
.middleware('auth:account')

/**
 * Connections
 */
Route.group('dashboard.connections', () => {

  Route
    .get('/', 'Dashboard/ConnectionController.index')
    .as('dashboard.connections')

})
.prefix('dashboard/connections')
.middleware('auth:account')

/**
 * Connections - Categories
 */
Route.group('dashboard.connections.candidates', () => {

  Route
    .get('/', 'Dashboard/Connection/CandidatesController.index')
    .as('dashboard.connections.candidates')

  Route
    .route('/:id',  ['GET', 'POST'], 'Dashboard/Connection/CandidatesController.edit')
    .as('dashboard.connections.candidates.edit')

  Route
    .route('/:id/filtered',  ['GET', 'POST'], 'Dashboard/Connection/CandidatesController.editFiltered')
    .as('dashboard.connections.candidates.edit.filtered')

})
.prefix('dashboard/connections/candidates')
.middleware('auth:account')

/**
 * Connections - Subcategories
 */
Route.group('dashboard.connections.subcategories', () => {

  Route
    .get('/', 'Dashboard/Connection/SubcategoriesController.index')
    .as('dashboard.connections.subcategories')

  Route
    .route('/:id',  ['GET', 'POST'], 'Dashboard/Connection/SubcategoriesController.edit')
    .as('dashboard.connections.subcategories.edit')

})
.prefix('dashboard/connections/subcategories')
.middleware('auth:account')

/**
 * Connections - Judges
 */
Route.group('dashboard.connections.judges', () => {

  Route
    .get('/', 'Dashboard/Connection/JudgesController.index')
    .as('dashboard.connections.judges')

  Route
    .route('/:id',  ['GET', 'POST'], 'Dashboard/Connection/JudgesController.edit')
    .as('dashboard.connections.judges.edit')

})
.prefix('dashboard/connections/judges')
.middleware('auth:account')

/**
 * Criterias - Categories
 */
Route.group('dashboard.connections.criterias', () => {

  Route
    .get('/', 'Dashboard/Connection/CriteriasController.index')
    .as('dashboard.connections.criterias')

  Route
    .route('/:id',  ['GET', 'POST'], 'Dashboard/Connection/CriteriasController.edit')
    .as('dashboard.connections.criterias.edit')

})
.prefix('dashboard/connections/criterias')
.middleware('auth:account')

/**
 * Scores
 */
Route.group('dashboard.scores', () => {

  Route
    .route('/', ['GET', 'POST'], 'Dashboard/ScoreController.index')
    .as('dashboard.scores')

  Route
    .get(':id/overview', 'Dashboard/ScoreController.overview')
    .as('dashboard.scores.overview')

  Route
    .get(':id/overview/print', 'Dashboard/ScoreController.overviewPrint')
    .as('dashboard.scores.overview.print')

  Route
    .get(':id/details', 'Dashboard/ScoreController.details')
    .as('dashboard.scores.details')

  Route
    .get(':id/details/print', 'Dashboard/ScoreController.detailsPrint')
    .as('dashboard.scores.details.print')

  Route
    .get(':id/criteria/:cid', 'Dashboard/ScoreController.criteria')
    .as('dashboard.scores.criteria')

  Route
    .get(':id/criteria/:cid/print', 'Dashboard/ScoreController.criteriaPrint')
    .as('dashboard.scores.criteria.print')

})
.prefix('dashboard/scores')
.middleware('auth:account')

/**
 * Program
 */
Route.group('dashboard.program', () => {

  Route
    .post('category', 'Dashboard/ProgramController.category')
    .as('dashboard.program.category')

  Route
    .post('update', 'Dashboard/ProgramController.update')
    .as('dashboard.program.update')

})
.prefix('dashboard/program')
.middleware('auth:account')

/**
 * API routes
 */
Route.group('api', () => {

  Route.get('/score', 'Api/ScoreController.get')

  Route.post('/score', 'Api/ScoreController.post')

})
.prefix('api')
.middleware('judge_token')

Route.group('api.auth', () => {

  Route
    .post('/login', 'Api/AuthController.login')
    .as('api.login')

  Route
    .post('/logout', 'Api/AuthController.logout')
    .as('api.logout')

})
.prefix('api/auth')

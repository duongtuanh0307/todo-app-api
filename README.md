#### Todo-releted route:

- POST /todos/add: Create new Todo Item
- PUT /todos/{todosId} Update Todo Item
- DELETE /todos/{todosId} Delete Todo Item
- GET /todos/{userId}: Get Todo Items of specific user

#### User-related route:

- PUT /user/{userId}: edit Username
- PUT /user/reminder/{userId}: edit reminder setting of specific user
- GET /user/{userId}: get infomation of user
- DELETE /user/{userId}: delete user and related setting, todo items

#### Authentication:

- POST /auth/login: get short-term token via email, create new account if email is not register yet
- POST /authenticate: get token using for CRUD

## TODO:

- Add login count or display instruction flag to control display/hide using instruction
- Add daily email sending function

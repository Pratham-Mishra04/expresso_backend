**API Documentation:**

**User Routes:**

1. **POST /users/login**: User Login
   - Description: Authenticate a user and generate an access token for further requests.
   - Request Method: POST
   - Request Body Parameters: User credentials (email and password).
   - Response: Returns an access token upon successful login and also the user details. (res.data.token, res.data.user)

2. **POST /users/signup**: User Signup
   - Description: Register a new user with the provided information.
   - Request Method: POST
   - Request Body Parameters: User details including profile picture (multipart/form-data).
   - Response: Returns an access token upon successful signup and also the user details. (res.data.token, res.data.user)

3. **PATCH /users/updatePassword**: Update User Password
   - Description: Update the password for the authenticated user.
   - Request Method: PATCH
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Body Parameters: Current and new password.
   - Response:  Returns an access token upon successful updation of password and also the user details. (res.data.token, res.data.user)

4. **GET /users/{userID}**: Get User Details
   - Description: Retrieve the details of a specific user.
   - Request Method: GET
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: User ID.
   - Response: Returns the user details. (res.data.doc)

5. **PATCH /users/{userID}**: Update User Details
   - Description: Update the details of a specific user.
   - Request Method: PATCH
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: User ID.
   - Request Body Parameters: Updated user details.
   - Response: Returns the user details. (res.data.doc)

6. **DELETE /users/{userID}**: Delete User
   - Description: Delete a specific user account.
   - Request Method: DELETE
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: User ID.
   - Response: Returns a success message upon successful user deletion.


**Consumer Routes:**

1. **POST /consumer**: Create an Order
   - Description: Create a new order for a consumer.
   - Request Method: POST
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Body Parameters: Order details.
   - Response: Returns the created order details. (res.data.order)

2. **GET /consumer/{orderID}**: Get an Order
   - Description: Retrieve the details of a specific order for a consumer.
   - Request Method: GET
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: Order ID.
   - Response: Returns the order details.  (res.data.order)

3. **DELETE /consumer/{orderID}**: Delete an Order
   - Description: Delete a specific order for a consumer.
   - Request Method: DELETE
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: Order ID.
   - Response: Returns a success message upon successful deletion of the order.


**Shipper Routes:**

1. **GET /shipper**: Get All Orders
   - Description: Retrieve a list of all orders for the shipper.
   - Request Method: GET
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Response: Returns a list of orders. (res.data.orders)

2. **GET /shipper/accept/{orderID}**: Accept Delivery
   - Description: Mark an order as accepted for delivery.
   - Request Method: GET
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: Order ID.
   - Response: Returns a success message upon successful acceptance.

3. **GET /shipper/pickUp/{orderID}**: Confirm Pick-up
   - Description: Confirm the pick-up of an order.
   - Request Method: GET
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: Order ID.
   - Response: Returns a success message upon successful confirmation.

4. **GET /shipper/otw/{orderID}**: Confirm On the Way
   - Description: Confirm being on the way for an order.
   - Request Method: GET
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: Order ID.
   - Response: Returns a success message upon successful confirmation.

5. **GET /shipper/otp/{orderID}**: Send OTP
   - Description: Send an OTP (One-Time Password) for order verification.
   - Request Method: GET
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: Order ID.
   - Response: Returns a success message upon successful OTP generation.

6. **POST /shipper/otp/{orderID}**: Verify OTP
   - Description: Verify the OTP (One-Time Password) for order verification.
   - Request Method: POST
   - Request Headers: Authorization header with a valid token as "Bearer {token}".
   - Request Path Parameters: Order ID.
   - Response: Returns a success message upon successful OTP verification.


**THINGS TO NOTE**

- Ensure to include the Authorization header with a valid token as "Bearer {token}" for authentication and authorization to access the protected routes.

- Complete API Documentation on route '/'.

- To get the complete idea of Request Bodies, checkout src/validators/joiValidators

- On successful request, the response will have the field "status" set to success i.e res.data.status = success.

- The following response status codes and the corresponding meanings - 

    - 200 OK: The request was successful, and the response body contains the requested data.
    - 201 Created: The request was successful, and a new resource was created as a result.
    - 204 No Content: The deletion requested for the data was successful.
    - 400 Bad Request: The request could not be understood or processed due to invalid syntax, missing parameters or validation errors.
    - 401 Unauthorized: The request requires authentication, and the token provided were either missing, invalid, or not in the correct format.
    - 404 Not Found: The requested resource could not be found on the server.
    - 500 Internal Server Error: An unexpected error occurred on the server while processing the request.




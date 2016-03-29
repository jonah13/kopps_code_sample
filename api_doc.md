FORMAT: 1A

# KOPPS

# AppHttpControllersApiV1ApiController
Api Functionality Controller

## Get the current user. [POST /getAuthenticatedUser]


+ Parameters
    + token (string, required) - Authentication Token

+ Request (application/json)
    + Headers

            Accept: application/x.kopps.v1+json

+ Response 200 (application/json)
    + Body

            {
                "first_name": "string",
                "last_name": "string",
                "type": "int",
                "company_id": "int",
                "need_approvals": "int"
            }

# AppHttpControllersApiV1AuthenticateController
Api Authentication Controller

## Get the current user. [POST /authenticate?username&password]


+ Parameters
    + username (string, required) - Username for user.
    + password (string, required) - Password for user.

+ Request (application/json)
    + Headers

            Accept: application/x.kopps.v1+json

+ Response 200 (application/json)
    + Body

            {
                "token": "string"
            }
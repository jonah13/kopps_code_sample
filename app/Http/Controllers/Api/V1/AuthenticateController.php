<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use Hash;
use Tymon\JWTAuth\Exceptions\JWTException;

/**
*	Api Authentication Controller
*
*	@Resource("API", uri="/api")
*/
class AuthenticateController extends Controller
{
	/**
     * Get the current user.
     *
	 * @Post("/authenticate?username&password")
	 * @Versions({"v1"})
     * @Request(headers={"Accept": "application/x.kopps.v1+json"})
	 * @Parameters({
	 *      @Parameter("username", required=true, description="Username for user."),
	 *		@Parameter("password", required=true, description="Password for user.")
	 * })
	 * @Response(200, body={"token": "string"})
     */
	public function authenticate(Request $request)
    {
        $credentials = $request->only('username', 'password');

        try {
            // verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt($credentials))
                return response()->json(['msg' => 'Please check your credentials and try again.'], 400);

        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['msg' => 'Something went wrong.'], 500);
        }

        if (!app()->make('UserManager')->checkIfActive($credentials['username']))
            return response()->json(['msg' => 'Your Account is inactive. Please contact the admin for activation.'], 400);

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }
}

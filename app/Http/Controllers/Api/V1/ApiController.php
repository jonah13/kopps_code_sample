<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
*	Api Functionality Controller
*
*	@Resource('API', uri='/api')
*/
class ApiController extends Controller
{

	/**
     * Get the current user.
     *
	 * @Post('/getAuthenticatedUser')
	 * @Versions({'v1'})
     * @Request(headers={'Accept': 'application/x.kopps.v1+json'})
	 * @Parameters({
	 *      @Parameter('token', required=true, description='Authentication Token')
	 * })
	 * @Response(200, body={'first_name': 'string', 'last_name': 'string', 'type': 'int', 'company_id': 'int', 'need_approvals': 'int'})
     */
	public function getAuthenticatedUser()
	{
		$user = app('Dingo\Api\Auth\Auth')->user();

		return response()->json($user);
	}

    public function checkUnique($table, $field, $value, $id)
    {
        return response()->json(
            app()->make('HelperManager')->checkUnique($table, $field, $value, $id)
        );
    }

	public function exportProducts()
	{
		$headers = [
			'Manf ID',
			'McKesson ID',
			'Product Name',
			'UOM',
			'Unit Quantity',
			'Category',
			'Manf',
			'Image',
			'Purchase price',
			'Default price',
			'Description',
			'Status'
		];

		$products = app()->make('ProductManager')->get();
		$products = array_map(function($object) {
			return [
				$object->manf_id,
				$object->mckesson_id,
				$object->name,
				$object->uom_abbr,
				$object->available_quantity,
				$object->category_name,
				$object->manf_name,
				$object->img,
				($object->default_price) ? $object->default_price : '0.00',
				($object->amt) ? $object->amt : '0.00',
				$object->description,
				($object->removed)  ? 'Inactive' : 'Active'
			];
		}, $products);

		array_unshift($products, $headers);

		return  app()->make('ExportManager')->toExcel($products, null);
	}

	public function exportOrder($type, $orderId)
	{
		$order = app()->make('OrderManager')->getOne($orderId);

		return app()->make('HelperManager')->exportOrder(
			$type,
			$order,
			app()->make('ProductOrderManager')->get(
				$orderId,
				$order->account_id,
				['column' => 'id', 'sort' => 'asc']
			)
		);
	}

	public function exportOrders($type, Request $request)
	{
		$orders = $orders = app()->make('OrderManager')->getList(
			$request->all(),
			1000,
			$request->input('account'),
			$request->input('location')
		);

		$location = ($request->has('location')) ? app()->make('LocationManager')->getOne($request->input('location')) : null;
		$user = ($request->has('user')) ? app()->make('UserManager')->getOne($request->input('user')) : null;

		return app()->make('HelperManager')->exportOrders(
			$type,
			$orders,
			$location,
			$user,
			$request->input('convertFrom'),
			$request->input('convertTo')
		);
	}

}

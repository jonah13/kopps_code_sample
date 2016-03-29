<?php

namespace App\Managers;

use DB;

use App\Models\Product;

class ProductManager
{
    /**
     * Gets shown products with custom price
     */
    public function getCustomProducts($params)
    {
        $query = DB::table('products AS p')
            ->join('uoms AS u', 'u.id', '=', 'p.uom')
            ->join('categories AS c', 'c.id', '=', 'p.category')
            ->join('manufacturers AS m', 'm.id', '=', 'p.manf')
            ->leftJoin('custom_items AS ci', function($join) {
                $join->on('ci.product_id', '=', 'p.id')
                    ->where('ci.account_id', '=', app('Dingo\Api\Auth\Auth')->user()->account);
            });

        if ($params['price'] === 'custom')
            $query->where('ci.hidden_custom_price', 0);

        if ($params['price'] === 'non')
            $query->where(function($query) {
                $query->whereNull('ci.product_id')
                    ->orWhere('hidden_custom_price', 1);
            });

        // sort by categories
        if (isset($params['categoryId']))
            $query->where('p.category', $params['categoryId']);

        if (isset($params['manufacturerId']))
            $query->where('p.manf', $params['manufacturerId']);

        if (isset($params['substr']) && $params['substr'] !== '') {
            $query->where(function($query) use ($params) {
                $words = explode(' ', $params['substr']);

                foreach ($words as $key => $word) {
                    if ($key == 0) {
                        $query->where('p.name', 'like', '%' . $word . '%');

                    } else {
                        $query->orWhere('p.name', 'like', '%' . $word . '%');
                    }

                    $query->orWhere('p.manf_id', 'like', '%' . $word . '%')
                        ->orWhere('p.description', 'like', '%' . $word . '%');
                }
            });
        }

        return $query
            ->selectRaw('
                p.*,
                u.uom_abbr,
                u.uom_name,
                c.name AS category_name,
                m.name AS manf_name,
                CASE
                    WHEN ci.custom_price IS NOT NULL AND ci.hidden_custom_price = 0 THEN ci.custom_price
                    ELSE p.default_price
                END AS price
            ')
            ->paginate($params['perPage']);
    }

    /**
     * Gets all products or filtered by ids / category
     */
    public function get($params = ['perPage' => null])
    {
        $query = DB::table('products AS p')
            ->join('manufacturers', 'manufacturers.id', '=', 'p.manf')
            ->join('categories', 'categories.id', '=', 'p.category')
            ->leftJoin('uoms', 'uoms.id', '=', 'p.uom');

        // get products by category id
        if (isset($params['category']))
            $query->where('p.category', $params['category']);

        if (!empty($params['filter'])) {
            // get products by given ids
            if ($params['filter'] === 'hidden')
                $query->whereIn('p.id', explode(',', $params['hidden']));

            // get all products except given array of ids
            if ($params['filter'] === 'shown') {
                $hidden = (count(explode(',', $params['hidden']))) ? explode(',', $params['hidden']) : [];
                $query->whereNotIn('p.id', $hidden);
            }

            if ($params['filter'] === 'custom_price')
                $query->whereIn('p.id', explode(',', $params['custom_price']));
        }

        if (isset($params['manufacturerId']))
            $query->where('p.manf', $params['manufacturerId']);

        if (isset($params['manfId']) && $params['manfId'] !== '') {
            $query->where(function($query) use ($params) {
                $query->where('p.name', 'like', '%' . $params['manfId'] . '%')
                    ->orWhere('p.manf_id', 'like', '%' . $params['manfId'] . '%');
            });
        }

        if (isset($params['substr']) && $params['substr'] !== '') {
            $query->where(function($query) use ($params) {
                $words = explode(' ', $params['substr']);

                foreach ($words as $key => $word) {
                    if ($key == 0) {
                        $query->where('p.name', 'like', '%' . $word . '%');

                    } else {
                        $query->orWhere('p.name', 'like', '%' . $word . '%');
                    }

                    $query->orWhere('p.manf_id', 'like', '%' . $word . '%')
                        ->orWhere('p.description', 'like', '%' . $word . '%')
                        ->orWhere('p.mckesson_id', 'like', '%' . $word . '%');
                }
            });
        }

        if (isset($params['column']))
            $query->orderBy($params['column'], $params['sort']);

        $query->selectRaw('
            p.*,
            categories.name AS category_name,
            manufacturers.name as manf_name,
            uoms.uom_abbr
        ');

        return (isset($params['perPage'])) ? $query->paginate($params['perPage']) : $query->get();
    }

    /**
     * Gets a product by id and two related to it by category products
     */
    public function getOneCustomProduct($productId)
    {
        return DB::select('
            SELECT
                products.*,
                CASE
                    WHEN ci.custom_price IS NOT NULL AND ci.hidden_custom_price = 0 THEN ci.custom_price
                    ELSE products.default_price
                END AS price
            FROM (
                SELECT
                    p.*,
                    u.uom_abbr,
                    u.uom_name,
                    c.name AS category_name,
                    m.name AS manf_name
                FROM products as p
                INNER JOIN uoms as u ON u.id = p.uom
                INNER JOIN categories AS c ON c.id = p.category
                INNER JOIN manufacturers AS m ON m.id = p.manf
                WHERE p.id = ?
                UNION
                SELECT
                    p.*,
                    u.uom_abbr,
                    u.uom_name,
                    c.name AS category_name,
                    m.name AS manf_name
                FROM products as p
                INNER JOIN uoms as u ON u.id = p.uom
                INNER JOIN categories AS c ON c.id = p.category
                INNER JOIN manufacturers AS m ON m.id = p.manf
                WHERE p.id <> ?
                AND p.removed = 0
                AND p.category = (SELECT category FROM products WHERE id = ?)
                LIMIT 3
            ) AS products
            LEFT JOIN custom_items AS ci ON ci.product_id = products.id AND ci.account_id = ?
        ', [
            $productId,
            $productId,
            $productId,
            app('Dingo\Api\Auth\Auth')->user()->account
        ]);
    }

    public function search($substr, $accountId) {
        return DB::table('product_order AS po')
            ->leftJoin('orders AS o', 'po.order_id', '=', 'o.id')
            ->leftJoin('products AS p', 'po.product_id', '=', 'p.id')
            ->join('uoms AS uo', 'uo.id', '=', 'p.uom')
            ->join('categories AS c', 'c.id', '=', 'p.category')
            ->join('manufacturers AS m', 'm.id', '=', 'p.manf')
            ->leftJoin('custom_items AS ci', function($join) use ($accountId) {
                $join->on('ci.product_id', '=', 'p.id')
                    ->where('ci.account_id', '=', $accountId);
            })
            ->where('o.status', 'favorite')
            ->where(function($query) use ($substr) {
                $query->where('p.name', 'like', '%' . $substr . '%')
                    ->orWhere('p.manf_id', 'like', '%' . $substr . '%');
            })
            ->groupBy('p.id')
            ->selectRaw('
                p.*,
                po.quantity,
                uo.uom_abbr,
                uo.uom_name,
                c.name AS category_name,
                m.name AS manf_name,
                CASE
                    WHEN ci.custom_price IS NOT NULL AND ci.hidden_custom_price = 0 THEN ci.custom_price
                    ELSE p.default_price
                END AS price
            ')
            ->get();
    }

    /**
     * Gets one product
     *
     * @param $productId - product id
     * @return Product
     */
    public function getOne($productId)
    {
        return Product::with('attributes')->find($productId);
    }

    /**
     * Removes a product
     *
     * @param {integer} $productId - product id
     */
    public function remove($productId) 
    {
        Product::where('id', $productId)->update(['removed' => 1]);
    }

    public function save($productData, $file, $filePath)
    {
        $product = new Product();
        // all product fields, which not related to other tables
        foreach ($productData as $key => $value) {
            $product->$key = $value;
        }

        if ($file)
            $product->img = $this->saveImg($file);
        else
            $product->img = $filePath;

        $product->save();

        return $product;
    }

    public function update($productData, $file, $filePath = null)
    {
        $product = Product::find($productData['id']);

        // all product fields, which not related to other tables
        foreach ($productData as $key => $value) {
            if ($key === 'uom' && $value === 'null') {
                continue;
            }

            $product->$key = $value;
        }

        if (!empty($file) || $file) {
            if (file_exists(env('IMG_FOLDER') . $product->img))
//                unlink(env('IMG_FOLDER') . $product->img);
            $product->img = $this->saveImg($file);
        } else {
            $product->img = ($filePath) ? $filePath : $product->img;
        }

        $product->save();

        return $product;
    }

    /**
     * Saves an image
     *
     * @param $file
     * @return full path
     */
    private function saveImg($file) {
        //image extension is here instead of full name. It allows to add some extension validation in future
        $fileOriginalName = $file->getClientOriginalName();
        $fileName = pathinfo($fileOriginalName, PATHINFO_FILENAME);
        $extension = pathinfo($fileOriginalName, PATHINFO_EXTENSION);
        $fileName = time() . "_" . $fileName . '.' . $extension;
        $file->move(env('IMG_FOLDER'), $fileName);

        return $fileName;
    }
}
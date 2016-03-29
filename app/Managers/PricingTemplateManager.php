<?php

namespace App\Managers;

use App\Models\PricingTemplate;
use App\Models\Product;

use DB;

class PricingTemplateManager {

    /**
     * Creates new pricing template
     *
     * @param {array} $pricingTemplateData
     * @param {array} $products - collection {product_id/hide/custom_price}
     */
    public function create($pricingTemplateData, $products) 
    {
        $pricingTemplate = new PricingTemplate();

        $pricingTemplate->name = $pricingTemplateData['name'];
        $pricingTemplate->description = $pricingTemplateData['description'];

        $pricingTemplate->save();

        $this->savePricingProducts($pricingTemplate, $products);
    }

    /**
     * Updates an exist pricing template
     *
     * @param {array} $pricingTemplateData
     * @param {array} $products - collection {product_id/hide/custom_price}
     */
    public function update($pricingTemplateData, $products)
    {
        $pricingTemplate = PricingTemplate::find($pricingTemplateData['id']);

        $pricingTemplate->name = $pricingTemplateData['name'];
        $pricingTemplate->description = $pricingTemplateData['description'];

        $pricingTemplate->save();

        DB::table('products_pricing_template')
            ->where('pricing_template_id', $pricingTemplate->id)
            ->delete();

        $this->savePricingProducts($pricingTemplate, $products);
    }

    /**
     * Removes the pricing template
     *
     * @param {integer} $pricingTemplateId
     */
    public function remove($pricingTemplateId) 
    {
        PricingTemplate::where('id', $pricingTemplateId)->update(['removed' => 1]);
    }

    /**
     * Gets list of all pricing templates
     *
     * @param $perPage
     * @param $column
     * @param $sort
     * @return {array with pagination data}
     */
    public function get($perPage, $column, $sort) 
    {
        $query = DB::table('pricing_template AS pt')
            ->leftJoin('products_pricing_template AS ppt', 'pt.id', '=', 'ppt.pricing_template_id')
            ->where('pt.removed', 0)
            ->orderBy($column, $sort)
            ->groupBy('pt.id')
            ->selectRaw('
                pt.id,
                pt.name,
                SUM(CASE ppt.hidden WHEN 1 THEN 1 ELSE 0 end) AS hidden,
                (SELECT COUNT(id) FROM accounts WHERE pricing_template_id = pt.id) AS accounts,
                SUM(CASE WHEN ppt.custom_price IS NULL THEN 0 ELSE 1 END) AS customized,
                (SELECT COUNT(*) FROM products) - SUM(case ppt.hidden WHEN 1 THEN 1 ELSE 0 END) AS shown
            ');

        return ($perPage) ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Gets one pricing template with all customized products
     *
     * @param $pricingTemplateId
     * @return collection {pricing_template/customized_products}
     */
    public function getOne($pricingTemplateId) 
    {
        $pricingTemplate = PricingTemplate::find($pricingTemplateId);
        $customizedProducts = DB::table('products_pricing_template as ppt')
            ->where('ppt.pricing_template_id', $pricingTemplateId)
            ->get();

        return [
            'pricing_template' => $pricingTemplate,
            'customized_products' => $customizedProducts
        ];
    }

    /**
     * Gets all customized products and their params
     *
     * @param {integer} $accountId - account id
     * @return {array}
     */
    public function getAllAdditions($accountId) 
    {
        return DB::table('custom_items AS ci')
            ->orWhere('ci.account_id', $accountId)
            ->selectRaw('ci.product_id, ci.hidden, ci.hidden_custom_price, ci.custom_price, ci.account_id')
            ->get();
    }

    /**
     * Saves custom items
     *
     * @param {integer} $accountId - account id
     * @param $products - collection {product_id/hide/custom_price}
     */
    public function saveCustomItems($accountId, $products) 
    {
        foreach ($products as $product) {
            // should determine if already have this product as customized
            $isExist = DB::table('custom_items')
                ->where('account_id', $accountId)
                ->where('product_id', $product['product_id'])
                ->count();

            if ($isExist) {
                DB::table('custom_items')
                    ->where('account_id', $accountId)
                    ->where('product_id', $product['product_id'])
                    ->update($product);
            } else {
                DB::table('custom_items')
                    ->where('account_id', $accountId)
                    ->where('product_id', $product['product_id'])
                    ->insert(array_merge(['account_id' => $accountId], $product));
            }
        }
    }

    /**
     * Copies pricing template products to custom items table
     *
     * @param {integer} - $pricingTemplateId
     * @param {integer} - $accountId
     */
    public function copyPricingTemplate($pricingTemplateId, $accountId)
    {
        $products = DB::table('products_pricing_template AS ppt')
            ->where('ppt.pricing_template_id', $pricingTemplateId)
            ->selectRaw('ppt.product_id, ppt.hidden, ppt.hidden_custom_price, ppt.custom_price')
            ->get();

        foreach ($products as $product) {
            DB::table('custom_items')->insert(array_merge(['account_id' => $accountId], (array) $product));
        }
    }

    /**
     * Saves pricing customized products
     *
     * @param $pricingTemplate - PricingTemplate
     * @param {array} $products
     */
    private function savePricingProducts($pricingTemplate, $products) 
    {
        foreach ($products as $value) {
            $pricingTemplate->products()->save(Product::find($value['product_id']), $value);
        }
    }
}
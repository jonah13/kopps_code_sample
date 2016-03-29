<?php

namespace App\Managers;

use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade as Pdf;

class ExportManager
{

    private $exportFileName = 'kopps';

    public function toPdf($orders, $params)
    {
        $pdf = Pdf::loadView('export', ['orders' => $orders, 'params' => $params]);
        return $pdf->setOrientation('landscape')->download($this->exportFileName . '.pdf');
    }

    public function savePdf($order, $products)
    {
        $path = dirname(dirname(dirname(__FILE__))). '/public/pdf/' . $order->id . '.pdf';
        $pdf = Pdf::loadView('export-order', ['order' => $order, 'products' => $products]);
        $pdf->setOrientation('landscape')->save($path);

        return $path;
    }

    public function toExcel($orders, $params)
    {
        Excel::create($this->exportFileName, function($excel) use ($orders, $params) {

            $excel->sheet('Sheetname', function($sheet) use ($orders, $params) {

                $firstCell = 'A1';

                if ($params) {
                    $sheet->mergeCells('A1:G1');
                    $sheet->row(1, [$this->getParamsString($params)]);
                    $firstCell = 'A2';
                }

                $sheet->fromArray($orders, null, $firstCell, false, false);
            });

        })->download('xls');
    }

    private function getParamsString($arr)
    {
        $str = '';

        foreach ($arr as $key => $val) {
            $str .= '  ' . $key . ': ' . $val;
        }

        return $str;
    }
}
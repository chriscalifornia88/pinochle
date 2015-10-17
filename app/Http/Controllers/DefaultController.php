<?php
/**
 * User: Christian Augustine
 * Date: 10/3/15
 * Time: 9:13 PM
 */

namespace App\Http\Controllers;

class DefaultController extends Controller
{
    /**
     * @codeCoverageIgnore
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return View('home');
    }
}

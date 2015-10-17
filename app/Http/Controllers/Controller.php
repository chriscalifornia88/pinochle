<?php

namespace App\Http\Controllers;

use App\BaseModel;
use App\Exceptions\ErrorCode;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Response;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    protected static $model = BaseModel::class;

    /** @var Response */
    protected $response;

    public function __construct()
    {
        $this->middleware('auth');

        $this->response = new Response();
    }

    /**
     * @return \Illuminate\Http\Response
     */
    protected function createResponse()
    {
        $httpCode = Response::CODE_OK;

        if (!is_null($this->response->getErrorCode())) {
            switch ($this->response->getErrorCode()) {
                case ErrorCode::ACCESS_DENIED:
                    $httpCode = Response::CODE_FORBIDDEN;
                    break;
                case ErrorCode::MODEL_NOT_FOUND:
                    $httpCode = Response::CODE_NOT_FOUND;
                    break;
                default:
                    $httpCode = Response::CODE_INTERNAL_SERVER_ERROR;
            }
        }

        return response()->json($this->response, $httpCode);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        /** @var BaseModel $model */
        $model = static::$model;

        try {
            $this->response->setData($model::fetch($id));
        } catch (\Exception $ex) {
            $this->response->setError($ex);
        }

        return $this->createResponse();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
//    public function create()
//    {
//        //
//    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
//    public function store(Request $request)
//    {
//        //
//    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
//    public function edit($id)
//    {
//        //
//    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
//    public function update(Request $request, $id)
//    {
//        //
//    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
//    public function destroy($id)
//    {
//        //
//    }
}

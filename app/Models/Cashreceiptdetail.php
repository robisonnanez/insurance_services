<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cashreceiptdetail extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'cashreceiptdetails';
    protected $primaryKey = 'id';

    protected $fillable = [
        'cashreceipt_id',
        'service_id',
        'name',
        'price'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->logExcept([
                'created_at',
                'updated_at',
                'deleted_at',
            ])
            ->dontSubmitEmptyLogs();
    }
}
